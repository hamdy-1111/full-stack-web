#include "email.hpp"

#include <fstream>
#include <iostream>
#include <mailio/message.hpp>
#include <mailio/smtp.hpp>
#include <mailio/mime.hpp>
#include <sstream>

void sendOTPEmail(const std::string &recipient, const std::string &otp) {
    // this a lambda function like () => {} in javascript
    auto sendEmailTask = [&](const std::string &recipient, const std::string &otp) {
        try {
            std::string emailHTML = "<!DOCTYPE html> "
"<html lang=\"en\"> "
"<head> "
"<meta charset=\"UTF-8\"> "
"<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\"> "
"<title>Email OTP Verification</title> "
"<script src=\"https://kit.fontawesome.com/d36d507b4c.js\" crossorigin=\"anonymous\"></script> "
"<style> "
"    .copied { "
"        background-color: #5a5a5a; "
"        color: #fff; "
"        width: 60px; "
"        height: 25px; "
"        justify-content: center; "
"        align-items: center; "
"        border-radius: 5px; "
"        font-weight: 100; "
"        font-size: small; "
"        position: absolute; "
"        right: -20px; "
"        display: none; "
"        transition: filter 0.5s, transform 0.5s; /* Add transition for the filter and transform properties */ "
"        filter: blur(0px); /* Initial blur */ "
"        transform: scale(1); /* Initial transform scale */ "
"    } "
"    .blur-effect { "
"        filter: blur(1px); /* Apply blur effect */ "
"        transform: scale(0.8); /* Apply scale transformation */ "
"    } "
"</style> "
"</head> "
"<body style=\"font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0;\"> "
"<div class=\"container\" style=\"max-width: 600px; margin: 50px auto; background-color: #050A30; border-radius: 10px; padding: 20px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); \"> "
"    <img src=\"cid:email_cover.png\" alt=\"\" style=\"display: block; margin: 0 auto; height: calc(100% / 3); /* Make the image take one-third of the container's width */ margin-bottom: 20px; /* Add some space below the image */ width: 100%; border-radius: 10px; \"> "
"    <p class=\"user-name\" style=\"margin-bottom: 20px; color: #00bcd4; \">Dear User</p> "
"    <p style=\"margin-bottom: 20px; color: #607D8B; \">Please use this OTP to verify that this is your email to sign up.</p> "
"    <p style=\"margin-bottom: 20px; color: #607D8B; \">If you did not request this verification, you can safely ignore this email.</p> "
"    <p style=\"margin-bottom: 20px; color: #607D8B; \">Your OTP is:</p> "
"    <p style=\"margin-bottom: 20px; font-size: 24px; font-weight: bold; color: #0795a3; text-align: center;\" class=\"otp-code\" id=\"otpCode\">123456</p> <!-- Replace with actual OTP --> "
"    <button onclick=\"copyOTP()\"  style=\"display: block; width: 100%; max-width: 200px; margin: 0 auto; background-color: #607D8B; color: #fff; text-decoration: none; text-align: center; padding: 10px 20px; border-radius: 5px; border: none; cursor: pointer; letter-spacing: 1px; transition: .5s; position: relative;\" onmouseover=\"this.style.backgroundColor='#7EC8E3'; this.style.color='#fff'; this.style.letterSpacing='2px';\" onmouseout=\"this.style.backgroundColor='#607D8B'; this.style.color='#fff'; this.style.letterSpacing='1px';\">Copy Code<div class=\"copied\" style=\"display: none;\">copied</div></button>  "
"    <div class=\"line\" style=\"height: 1px; width: 80%; background-color: #607D8B; position: relative; top: 20px; left: 50%; transform: translateX(-50%); margin-bottom: 50px; \"></div> "
"    <div class=\"footer\" style=\"margin-top: 30px; text-align: center; font-size: 14px; display: flex; justify-content: space-evenly; align-items: center;\">"
"<div style=\"display: flex;flex-direction: column; gap: 15px;\">"
"            <a href=\"\" style=\"color: #070F2B; text-decoration: none;\"><svg xmlns=\"http://www.w3.org/2000/svg\" height=\"20\" width=\"20\" viewBox=\"0 0 512 512\"><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path fill=\"#74C0FC\" d=\"M512 256C512 114.6 397.4 0 256 0S0 114.6 0 256C0 376 82.7 476.8 194.2 504.5V334.2H141.4V256h52.8V222.3c0-87.1 39.4-127.5 125-127.5c16.2 0 44.2 3.2 55.7 6.4V172c-6-.6-16.5-1-29.6-1c-42 0-58.2 15.9-58.2 57.2V256h83.6l-14.4 78.2H287V510.1C413.8 494.8 512 386.9 512 256h0z\"/></svg></a>"
"            <a href=\"\" style=\"color: #070F2B; text-decoration: none;\"><svg xmlns=\"http://www.w3.org/2000/svg\" height=\"20\" width=\"20\" viewBox=\"0 0 512 512\"><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path fill=\"#00bcd4\" d=\"M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z\"/></svg></a>"
"        </div>"
"        <div>"
"        <p style=\"margin-bottom: 20px; color: #607D8B; \">Best Regards,</p>"
"        <p style=\"margin-bottom: 20px; color: #607D8B; \">Digital vibes</p>"
"        <p style=\"margin-bottom: 20px; color: #607D8B; \">All rights reserved. Â© 2024 Digital vibes.</p>"
"        </div>"
"        <div style=\"display: flex;flex-direction: column; gap: 15px;\">"
"            <a href=\"\" style=\"color: #070F2B; text-decoration: none;\"><i class=\"fa-brands fa-linkedin-in fa-beat-fade\" style=\"color:#7EC8E3;\" onmouseover=\"this.style.color='#607D8B'\" onmouseout=\"this.style.color='#7EC8E3'\"></i></a>"
"            <a href=\"\" style=\"color: #070F2B; text-decoration: none;\"><i class=\"fa-brands fa-instagram fa-beat-fade\" style=\"color:#7EC8E3;\" onmouseover=\"this.style.color='#607D8B'\" onmouseout=\"this.style.color='#7EC8E3'\"></i></a>"
"        </div>"
"    </div>"
"</div>"
"        <p style=\"text-align: center; margin-bottom: 20px; color: #607D8B;\">"
"            <a href=\"#\" style=\"color: #070F2B; text-decoration: none;\" onmouseover=\"this.style.textDecoration='underline'; this.style.color='#7EC8E3';\" onmouseout=\"this.style.textDecoration='none'; this.style.color='#070F2B';\">Privacy Policy</a> | "
"            <a href=\"#\" style=\"color: #070F2B; text-decoration: none;\" onmouseover=\"this.style.textDecoration='underline'; this.style.color='#7EC8E3';\" onmouseout=\"this.style.textDecoration='none'; this.style.color='#070F2B';\">Terms of Service</a> | "
"            <a href=\"#\" style=\"color: #070F2B; text-decoration: none;\" onmouseover=\"this.style.textDecoration='underline'; this.style.color='#7EC8E3';\" onmouseout=\"this.style.textDecoration='none'; this.style.color='#070F2B';\">Unsubscribe</a><br>"
"            <small>This email was sent automatically. Please do not reply to this email.</small>"
"        </p>"
"<script>"
"    function copyOTP() {"
"        var otpCode = document.getElementById(\"otpCode\");"
"        var range = document.createRange();"
"        range.selectNode(otpCode);"
"        window.getSelection().removeAllRanges();"
"        window.getSelection().addRange(range);"
"        document.execCommand(\"copy\");"
"        window.getSelection().removeAllRanges();"
"        var copiedMessage = document.querySelector(\".copied\");"
"        copiedMessage.style.display = \"flex\"; // Show copied message"
"        setTimeout(function() {"
"            copiedMessage.classList.add('blur-effect'); // Add blur effect"
"        }, 1000); // Delay blur effect by 1.5 seconds"
"        setTimeout(function() {"
"            copiedMessage.style.display = \"none\"; // Hide message after 2 seconds"
"            copiedMessage.classList.remove('blur-effect'); // Remove blur effect"
"        }, 1500);"
"    }"
"</script>"
""
"</body>"
"</html>";
            mailio::message msg;
            msg.from(mailio::mail_address("", "DigitalVibe@gmail.com"));
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

            mailio::smtps conn("smtp.elasticemail.com", 2525);
            conn.ssl_options(ssl_options);
            conn.authenticate("DigitalVibe@gmail.com", "E17F67D8279E9DF26E5F9ED177E88D40A634", mailio::smtps::auth_method_t::START_TLS);
            conn.submit(msg);
    

        } catch (const std::exception &e) {
            std::cout << e.what() << '\n';
        }
    };
    // start lambda function in a new detached thread
    std::thread(sendEmailTask, recipient, otp).detach();
}
