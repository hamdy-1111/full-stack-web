#include "email.hpp"

#include <fstream>
#include <iostream>
#include <mailio/message.hpp>
#include <mailio/mime.hpp>
#include <mailio/smtp.hpp>
#include <sstream>

void sendOTPEmail(const std::string &recipient, const std::string &otp) {
    std::cout << "OTP Code: " << otp << '\n';
    // this a lambda function like () => {} in javascript
    auto sendEmailTask = [&](const std::string &recipient, const std::string &otp) {
        try {
            std::string emailHTML =
                "<!DOCTYPE html>"
"<html lang=\"en\">"
""
"<head>"
"    <meta charset=\"UTF-8\">"
"    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">"
"    <title>Email OTP Verification</title>"
"</head>"
""
"<body style=\"font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0;\">"
""
"    <div class=\"container\""
"        style=\"max-width: 600px; margin: 50px auto; background-color: #050A30; border-radius: 10px; padding: 20px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);\">"
"        <img src=\"cid:email_cover.png\" alt=\"\""
"            style=\"display: block; margin: 0 auto; height: calc(100% / 3); width: 100%; border-radius: 10px; margin-bottom: 20px;\">"
"        <p class=\"user-name\" style=\"color: #00bcd4;\">Dear User</p>"
"        <p style=\"margin-bottom: 20px; color: #607D8B;\">Please use this OTP to verify that this is your email to sign"
"            up.</p>"
"        <p style=\"margin-bottom: 20px; color: #607D8B;\">If you did not request this verification, you can safely ignore"
"            this email.</p>"
"        <p style=\"color:white\">Your OTP is:</p>"
"        <p class=\"otp-code\" id=\"otpCode\""
"            style=\"font-size: 24px; font-weight: bold; color: #0795a3; text-align: center;\">"+otp+"</p>"
"        <!-- Replace with actual OTP -->"
"        <hr color=\"#607D8B\" height=\"1px\" width=\"95%\" align=\"center\">"
"        <div class=\"footer\">"
"            <div style=\"display: flex;flex-direction: column; gap: 15px;\">"
"            </div>"
"            <div width=\"100%\">"
"                <p align=\"center\" style=\"color:#bababa\">Best Regards,</p>"
"                <p align=\"center\" style=\"color:#bababa\">Digital vibes</p>"
"                <p align=\"center\" style=\"color:#bababa\">All rights reserved. © 2024 Digital vibes.</p>"
"            </div>"
"            <div style=\"display: flex;flex-direction: column; gap: 15px;\">"
"            </div>"
"        </div>"
"    </div>"
"    <p style=\"text-align: center;\">"
"        <a href=\"#\" style=\"color: #070F2B; text-decoration: none;\">Privacy Policy</a> |"
"        <a href=\"#\" style=\"color: #070F2B; text-decoration: none;\">Terms of Service</a> |"
"        <a href=\"#\" style=\"color: #070F2B; text-decoration: none;\">Unsubscribe</a><br>"
"        <small>This email was sent automatically. Please do not reply to this email.</small>"
"    </p>"
"</body>"
""
"</html>";

            mailio::message msg;
            msg.from(mailio::mail_address("", "digitalvibeoriginal@gmail.com"));
            msg.add_recipient(mailio::mail_address("", recipient));

            msg.content_type(mailio::message::media_type_t::MULTIPART, "related");
            msg.header_codec(mailio::message::header_codec_t::BASE64);
            msg.subject("OTP CODE");
            msg.boundary("myrandomstring");

            mailio::mime html;
            html.content_transfer_encoding(mailio::mime::content_transfer_encoding_t::QUOTED_PRINTABLE);
            html.content_type(mailio::message::media_type_t::TEXT, "html", "utf-8");
            html.content(emailHTML);
            msg.add_part(html);

            std::ifstream in("frontend/images/logo/email cover 2.png");
            std::ostringstream out;
            out << in.rdbuf();
            std::string imgcontent = out.str();

            mailio::mime img;

            img.header_codec(mailio::mime::header_codec_t::BASE64);
            img.content_type(mailio::mime::media_type_t::IMAGE, "png");
            img.content_transfer_encoding(mailio::mime::content_transfer_encoding_t::BASE_64);
            img.content_disposition(mailio::mime::content_disposition_t::ATTACHMENT);
            img.content(imgcontent);
            img.name("email_cover.png");
            img.content_id("email_cover.png");
            msg.add_part(img);

            mailio::dialog_ssl::ssl_options_t ssl_options;
            ssl_options.method = boost::asio::ssl::context::tls_client;

            mailio::smtps conn("smtp-relay.brevo.com", 587);
            conn.ssl_options(ssl_options);
            conn.authenticate("digitalvibeoriginal@gmail.com", "23FU0kLRCNmbQz4s", mailio::smtps::auth_method_t::START_TLS);
            conn.submit(msg);

        } catch (const std::exception &e) {
            std::cout << e.what() << '\n';
        }
    };
    // start lambda function in a new detached thread
    std::thread(sendEmailTask, recipient, otp).detach();
}
