#include "signup.hpp"
#include "database.hpp"
#include "util/security.hpp"
#include "util/email.hpp"

#include <fstream>

#include <mailio/message.hpp>
#include <mailio/smtp.hpp>
#include <iostream>
#include <SQLiteCpp/VariadicBind.h>
#include <nlohmann/json.hpp>
#include <thread>

using namespace mailio;
using namespace nlohmann;

shared_ptr<http_response> signup_resource::render_POST(const http_request &req)
{

    // get user info
    string req_content = string(req.get_content());
    json req_json = json::parse(req_content);

    string username = req_json["username"];
    string email = req_json["email"];
    string password = req_json["password"];
    std::cout << "content: " << req_content << std::endl;

    // if empty return
    if (username.empty() || email.empty() || password.empty())
    {
        string_response *res = new string_response(to_string(json({{"error", "invalid-parameters"}})));
        res->with_header("Content-Type", "application/json");
        return shared_ptr<http_response>(res);
    }
    // check if username is too long
    if (username.size() > 25)
    {
        string_response *res = new string_response(to_string(json({{"error", "username-too-long"}})));
        res->with_header("Content-Type", "application/json");
        return shared_ptr<http_response>(res);
    }
    // check if username exists
    if (username_exists(username))
    {
        string_response *res = new string_response(to_string(json({{"error", "user-exists"}})));
        res->with_header("Content-Type", "application/json");
        return shared_ptr<http_response>(res);
    }

    if (email_exists(email))
    {
        string_response *res = new string_response(to_string(json({{"error", "email-exists"}})));
        res->with_header("Content-Type", "application/json");
        return shared_ptr<http_response>(res);
    }

    // if username or email exists in temp database delete them
    if (username_exists(username, true))
    {
        SQLite::Statement query_delete(*DataBaseManager::users, "DELETE FROM users_verify_temp WHERE username = ?");
        query_delete.bind(1, username);
        while (query_delete.executeStep())
            ;
    }

    if (email_exists(email, true))
    {
        SQLite::Statement query_delete(*DataBaseManager::users, "DELETE FROM users_verify_temp WHERE email = ?");
        query_delete.bind(1, email);
        while (query_delete.executeStep())
            ;
    }
    // generate uuid;
    string uuid = generate_uuid_v4();

    // check if user uploaded a photo
    int photo_state;
    string photo = req_json["photo"];
    if (photo == "0" || photo.empty())
    {
        photo_state = 0;
    }
    else
    {
        photo_state = 1;
        std::ofstream("database/photos/" + uuid + "-temp") << photo;
    }

    // generate salt and hash password
    string salt = random_string(16);
    string password_hashed = sha256_string(salt + password);


    // otp
    string otp_code = generate_otp_code();
<<<<<<< HEAD

    // send OTP email
    send_email(email, otp_code); // This line sends the OTP email

    try
    {
=======
    sendOTPEmail(email, otp_code);

    // generate random key
    string key = random_string(40);

    try {
>>>>>>> baba3a63862ec842a93c31034928dd34d94a9051
        // insert user info in the temp table
        SQLite::Statement query(*DataBaseManager::users, "INSERT INTO users_verify_temp ([uuid], [username], [email], [salt], [password], [photo_state], [key], [otp_code] , [time_unix]) VALUES ( ? , ? , ? , ? , ? , ? , ? , ? , ?)");
        SQLite::bind(query, uuid, username, email, salt, password_hashed, photo_state, key, otp_code, time(nullptr));
        query.exec();

        json res = {
            {"error", "no-error"},
            {"uuid", uuid},
            {"key", key},
        };
        string_response *res_json = new string_response(to_string(res));
        res_json->with_header("Content-Type", "application/json");
        return shared_ptr<http_response>(res_json);
    }
    catch (std::exception &e)
    {
        std::cout << e.what() << std::endl;
    }
}

bool signup_resource::username_exists(string username, bool temp_db)
{
    try
    {
        std::unique_ptr<SQLite::Statement> query;
        if (temp_db)
        {
            query = std::make_unique<SQLite::Statement>(*DataBaseManager::users, "SELECT username FROM users_verify_temp WHERE username = ?");
        }
        else
        {
            query = std::make_unique<SQLite::Statement>(*DataBaseManager::users, "SELECT username FROM users WHERE username = ?");
        }
        query->bind(1, username);
        while (query->executeStep())
        {
            return true;
        }
        return false;
    }
    catch (SQLite::Exception &e)
    {
        std::cout << e.what() << std::endl;
        throw e;
    }
}

bool signup_resource::email_exists(string email, bool temp_db)
{
    try
    {
        std::unique_ptr<SQLite::Statement> query;
        if (temp_db)
        {
            query = std::make_unique<SQLite::Statement>(*DataBaseManager::users, "SELECT email FROM users_verify_temp WHERE email = ?");
        }
        else
        {
            query = std::make_unique<SQLite::Statement>(*DataBaseManager::users, "SELECT email FROM users WHERE email = ?");
        }
        query->bind(1, email);
        while (query->executeStep())
        {
            return true;
        }
        return false;
    }
    catch (SQLite::Exception &e)
    {
        std::cout << e.what() << std::endl;
        throw e;
    }
}

void signup_resource::send_email(const std::string &recipient_email, const std::string &otp)
{
    try
    {
        // Create the message
        message msg;
        msg.from(mailio::mail_address("", "digitalvibeoriginal@gmail.com"));
        msg.add_recipient(mail_address("", recipient_email));
        msg.subject("OTP Verification");

        // Construct the HTML content with OTP and inline CSS
        std::stringstream html_content;
        html_content << "<html><head>";
        html_content << "<meta charset='UTF-8'>";
        html_content << "<meta name='viewport' content='width=device-width, initial-scale=1.0'>";
        html_content << "<title>Email OTP Verification</title>";
        html_content << "<script src='https://kit.fontawesome.com/d36d507b4c.js' crossorigin='anonymous'></script>";
        html_content << "<style>";
        html_content << ":root{";
        html_content << "--background-color: #050A30;";
        html_content << "--text-color:#607D8B ;";
        html_content << "--opt-color:#0795a3;";
        html_content << "--light-color:#7EC8E3;";
        html_content << "--user-name-color:#00bcd4;";
        html_content << "}";
        html_content << "body {";
        html_content << "font-family: Arial, sans-serif;";
        html_content << "background-color: #f4f4f4;";
        html_content << "margin: 0;";
        html_content << "padding: 0;";
        html_content << "}";
        html_content << ".container {";
        html_content << "max-width: 600px;";
        html_content << "margin: 50px auto;";
        html_content << "background-color: var(--background-color);";
        html_content << "border-radius: 10px;";
        html_content << "padding: 20px;";
        html_content << "box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);";
        html_content << "}";
        html_content << "h1 {";
        html_content << "text-align: center;";
        html_content << "margin-bottom: 30px;";
        html_content << "}";
        html_content << "p {";
        html_content << "margin-bottom: 20px;";
        html_content << "color: var(--text-color);";
        html_content << "}";
        html_content << ".otp-code {";
        html_content << "font-size: 24px;";
        html_content << "font-weight: bold;";
        html_content << "color: var(--opt-color);";
        html_content << "text-align: center;";
        html_content << "}";
        html_content << "button {";
        html_content << "display: block;";
        html_content << "width: 100%;";
        html_content << "max-width: 200px;";
        html_content << "margin: 0 auto;";
        html_content << "background-color: var(--text-color);";
        html_content << "color: #fff;";
        html_content << "text-decoration: none;";
        html_content << "text-align: center;";
        html_content << "padding: 10px 20px;";
        html_content << "border-radius: 5px;";
        html_content << "border: none;";
        html_content << "cursor: pointer;";
        html_content << "letter-spacing: 1px;";
        html_content << "transition: .5s;";
        html_content << "position: relative;";
        html_content << "}";
        html_content << "button:hover{";
        html_content << "background-color: var(--light-color);";
        html_content << "color: #fff;";
        html_content << "letter-spacing: 2px;";
        html_content << "}";
        html_content << ".copied {";
        html_content << "background-color: #5a5a5a;";
        html_content << "color: #fff;";
        html_content << "width: 60px;";
        html_content << "height: 25px;";
        html_content << "justify-content: center;";
        html_content << "align-items: center;";
        html_content << "border-radius: 5px;";
        html_content << "font-weight: 100;";
        html_content << "font-size: small;";
        html_content << "position: absolute;";
        html_content << "right: -20px;";
        html_content << "display: none;";
        html_content << "transition: filter 0.5s, transform 0.5s;"; // Add transition for the filter and transform properties
        html_content << "filter: blur(0px);";                       // Initial blur
        html_content << "transform: scale(1);";                     // Initial transform scale
        html_content << "}";
        html_content << ".blur-effect {";
        html_content << "filter: blur(1px);";     // Apply blur effect
        html_content << "transform: scale(0.8);"; // Apply scale transformation
        html_content << "}";
        html_content << ".footer {";
        html_content << "margin-top: 30px;";
        html_content << "text-align: center;";
        html_content << "font-size: 14px;";
        html_content << "display: flex;";
        html_content << "justify-content: space-evenly;";
        html_content << "align-items: center;";
        html_content << "}";
        html_content << "a {";
        html_content << "color: #070F2B;";        // Blue color for links
        html_content << "text-decoration: none;"; // Remove default underline
        html_content << "}";
        html_content << "a:hover {";
        html_content << "text-decoration: underline;";
        html_content << "color: var(--light-color);";
        html_content << "}";
        html_content << "img {";
        html_content << "display: block;";
        html_content << "margin: 0 auto;";
        html_content << "height: calc(100% / 3);"; // Make the image take one-third of the container's width
        html_content << "margin-bottom: 20px;";    // Add some space below the image
        html_content << "width: 100%;";
        html_content << "border-radius: 10px;";
        html_content << "}";
        html_content << ".line {";
        html_content << "height: 1px;";
        html_content << "width: 80%;";
        html_content << "background-color: var(--text-color);";
        html_content << "position: relative;";
        html_content << "top: 20px;";
        html_content << "left: 50%;";
        html_content << "transform: translateX(-50%);";
        html_content << "margin-bottom: 50px;";
        html_content << "}";
        html_content << "i {";
        html_content << "color: var(--light-color);";
        html_content << "}";
        html_content << "i:hover {";
        html_content << "color: var(--text-color);";
        html_content << "}";
        html_content << ".user-name {";
        html_content << "color: var(--user-name-color);";
        html_content << "}";
        html_content << "</style>";
        html_content << "</head><body>";
        html_content << "<div class='container'>";
        html_content << "<img src='/frontend/images/logo/email cover 2.png' alt=''>";
        html_content << "<p class='user-name'>Dear User</p>";
        html_content << "<p>Please use this OTP to verify that this is your email to sign up.</p>";
        html_content << "<p>If you did not request this verification, you can safely ignore this email.</p>";
        html_content << "<p>Your OTP is:</p>";
        html_content << "<p class='otp-code' id='otpCode'>" << otp << "</p>"; // Replace with actual OTP
        html_content << "<button onclick='copyOTP()'>Copy Code<div class='copied'>copied</div></button>";
        html_content << "<div class='line'></div>";
        html_content << "<div class='footer'>";
        html_content << "<div style='display: flex;flex-direction: column; gap: 15px;'>";
        html_content << "<a href=''><i class='fa-brands fa-facebook fa-beat-fade'></i></a>";
        html_content << "<a href=''><i class='fa-brands fa-twitter fa-beat-fade'></i></a>";
        html_content << "</div>";
        html_content << "<div>";
        html_content << "<p>Best Regards,</p>";
        html_content << "<p>Digital vibes</p>";
        html_content << "<p>All rights reserved. © 2024 Digital vibes.</p>";
        html_content << "</div>";
        html_content << "<div style='display: flex;flex-direction: column; gap: 15px;'>";
        html_content << "<a href=''><i class='fa-brands fa-linkedin-in fa-beat-fade'></i></a>";
        html_content << "<a href=''><i class='fa-brands fa-instagram fa-beat-fade'></i></a>";
        html_content << "</div>";
        html_content << "</div>";
        html_content << "</div>";
        html_content << "<p style='text-align: center;'>";
        html_content << "<a href='#'>Privacy Policy</a> | ";
        html_content << "<a href='#'>Terms of Service</a> | ";
        html_content << "<a href='#'>Unsubscribe</a><br>";
        html_content << "<small>This email was sent automatically. Please do not reply to this email.</small>";
        html_content << "</p>";
        html_content << "<script>";
        html_content << "function copyOTP() {";
        html_content << "var otpCode = document.getElementById('otpCode');";
        html_content << "var range = document.createRange();";
        html_content << "range.selectNode(otpCode);";
        html_content << "window.getSelection().removeAllRanges();";
        html_content << "window.getSelection().addRange(range);";
        html_content << "document.execCommand('copy');";
        html_content << "window.getSelection().removeAllRanges();";
        html_content << "var copiedMessage = document.querySelector('.copied');";
        html_content << "copiedMessage.style.display = 'flex';"; // Show copied message
        html_content << "setTimeout(function() {";
        html_content << "copiedMessage.classList.add('blur-effect');"; // Add blur effect
        html_content << "}, 1000);";                                   // Delay blur effect by 1.5 seconds
        html_content << "setTimeout(function() {";
        html_content << "copiedMessage.style.display = 'none';";          // Hide message after 2 seconds
        html_content << "copiedMessage.classList.remove('blur-effect');"; // Remove blur effect
        html_content << "}, 1500);";
        html_content << "}";
        html_content << "</script>";
        html_content << "</body></html>";

        // Set the HTML content
        msg << html_content.str();

        // Establish connection to SMTP server and send the email
        mailio::smtps conn("smtp-relay.brevo.com", 587);
        dialog_ssl::ssl_options_t ssl_options;
        ssl_options.method = boost::asio::ssl::context::tls_client;
        conn.ssl_options(ssl_options);
        conn.authenticate("digitalvibeoriginal@gmail.com", "23FU0kLRCNmbQz4s", mailio::smtps::auth_method_t::START_TLS);
        conn.submit(msg);

        std::cout << "Email sent successfully!" << std::endl;
    }
    catch (const std::exception &ex)
    {
        std::cerr << "Error: " << ex.what() << std::endl;
    }
}
