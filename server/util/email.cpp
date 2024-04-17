#include "email.hpp"

#include <fstream>
#include <iostream>
#include <mailio/message.hpp>
#include <mailio/smtp.hpp>
#include <sstream>

void sendOTPEmail(const std::string &recipient, const std::string &otp) {
    // this a lambda function like () => {} in javascript
    auto sendEmailTask = [&](const std::string &recipient, const std::string &otp) {
        try {

            std::string html_before_otp;
            std::string html_after_otp;

            std::ifstream in;
            in.open("email_template/email_before_otp.html");
            std::stringstream html_stream_b;
            html_stream_b << in.rdbuf();

            html_before_otp = html_stream_b.str();

            in.close();
            in.clear();

            in.open("email_template/email_after_otp.html");
            
            std::stringstream html_stream_a;
            html_stream_a << in.rdbuf();
            html_after_otp = html_stream_a.str();
            
            std::string email = html_before_otp + otp + html_after_otp; // construct full email
            mailio::message msg;
            msg.from(mailio::mail_address("", "digitalvibeoriginal@gmail.com"));
            msg.add_recipient(mailio::mail_address("", recipient));

            msg.subject("OTP VERIFICATION CODE");
            msg.add_header("Content-Type", "text/html; charset=UTF-8");
            msg.content(email);

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
