#include "email.hpp"

#include <fstream>
#include <iostream>
#include <mailio/message.hpp>
#include <mailio/smtp.hpp>
#include <sstream>

void sendOTPEmail(const std::string &recipient, const std::string &otp) {
    auto sendEmailTask = [&](const std::string &recipient, const std::string &otp) {
        try {
            std::string emailHTML = "<!DOCTYPE html>\
                <html lang=\"en\">\
                <head>\
                <meta charset=\"UTF-8\">\
                <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\
                <title>Email OTP Verification</title>\
                <script src=\"https://kit.fontawesome.com/d36d507b4c.js\" crossorigin=\"anonymous\"></script>\
                <style>\
                    :root{\
                        --background-color: #050A30;\
                        --text-color:#607D8B ;\
                        --opt-color:#0795a3;\
                        --light-color:#7EC8E3;\
                        --user-name-color:#00bcd4;\
                    }\
                    body {\
                        font-family: Arial, sans-serif;\
                        background-color: #f4f4f4;\
                        margin: 0;\
                        padding: 0;\
                    }\
                    .container {\
                        max-width: 600px;\
                        margin: 50px auto;\
                        background-color: var(--background-color);\
                        border-radius: 10px;\
                        padding: 20px;\
                        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);\
                    }\
                    h1 {\
                        text-align: center;\
                        margin-bottom: 30px;\
                    }\
                    p {\
                        margin-bottom: 20px;\
                        color: var(--text-color);\
                    }\
                    .otp-code {\
                        font-size: 24px;\
                        font-weight: bold;\
                        color: var(--opt-color);\
                        text-align: center;\
                    }\
                    button {\
                        display: block;\
                        width: 100%;\
                        max-width: 200px;\
                        margin: 0 auto;\
                        background-color: var(--text-color);\
                        color: #fff;\
                        text-decoration: none;\
                        text-align: center;\
                        padding: 10px 20px;\
                        border-radius: 5px;\
                        border: none;\
                        cursor: pointer;\
                        letter-spacing: 1px;\
                        transition: .5s;\
                        position: relative;\
                    }\
                    button:hover{\
                        background-color: var(--light-color);\
                        color: #fff;\
                        letter-spacing: 2px;\
                    }\
                    .copied {\
                        background-color: #5a5a5a;\
                        color: #fff;\
                        width: 60px;\
                        height: 25px;\
                        justify-content: center;\
                        align-items: center;\
                        border-radius: 5px;\
                        font-weight: 100;\
                        font-size: small;\
                        position: absolute;\
                        right: -20px;\
                        display: none;\
                        transition: filter 0.5s, transform 0.5s;\
                        filter: blur(0px);\
                        transform: scale(1);\
                    }\
                    .blur-effect {\
                        filter: blur(1px);\
                        transform: scale(0.8);\
                    }\
                    .footer {\
                        margin-top: 30px;\
                        text-align: center;\
                        font-size: 14px;\
                        display: flex;\
                        justify-content: space-evenly;\
                        align-items: center;\
                    }\
                    a {\
                        color: #070F2B;\
                        text-decoration: none;\
                    }\
                    a:hover {\
                        text-decoration: underline;\
                        color: var(--light-color);\
                    }\
                    img {\
                        display: block;\
                        margin: 0 auto;\
                        height: calc(100% / 3);\
                        margin-bottom: 20px;\
                        width: 100%;\
                        border-radius: 10px;\
                    }\
                    .line {\
                        height: 1px;\
                        width: 80%;\
                        background-color: var(--text-color);\
                        position: relative;\
                        top: 20px;\
                        left: 50%;\
                        transform: translateX(-50%);\
                        margin-bottom: 50px;\
                    }\
                    i {\
                        color: var(--light-color);\
                    }\
                    i:hover {\
                        color: var(--text-color);\
                    }\
                    .user-name {\
                        color: var(--user-name-color);\
                    }\
                </style>\
                </head>\
                <body>\
                <div class=\"container\">\
                    <img src=\"/frontend/images/logo/email cover 2.png\" alt=\"\">\
                    <p class=\"user-name\">Dear User</p>\
                    <p>Please use this OTP to verify that this is your email to sign up.</p>\
                    <p>If you did not request this verification, you can safely ignore this email.</p>\
                    <p>Your OTP is:</p>\
                    <p class=\"otp-code\" id=\"otpCode\">" + otp + "</p>\
                    <button onclick=\"copyOTP()\">Copy Code<div class=\"copied\">copied</div></button>\
                    <div class=\"line\"></div>\
                    <div class=\"footer\">\
                        <div style=\"display: flex;flex-direction: column; gap: 15px;\">\
                            <a href=\"\"><i class=\"fa-brands fa-facebook fa-beat-fade\"></i></a>\
                            <a href=\"\"><i class=\"fa-brands fa-twitter fa-beat-fade\"></i></a>\
                        </div>\
                        <div>\
                            <p>Best Regards,</p>\
                            <p>Digital vibes</p>\
                            <p>All rights reserved. © 2024 Digital vibes.</p>\
                        </div>\
                        <div style=\"display: flex;flex-direction: column; gap: 15px;\">\
                            <a href=\"\"><i class=\"fa-brands fa-linkedin-in fa-beat-fade\"></i></a>\
                            <a href=\"\"><i class=\"fa-brands fa-instagram fa-beat-fade\"></i></a>\
                        </div>\
                    </div>\
                </div>\
                <p style=\"text-align: center;\">\
                    <a href=\"#\">Privacy Policy</a> | \
                    <a href=\"#\">Terms of Service</a> | \
                    <a href=\"#\">Unsubscribe</a><br>\
                    <small>This email was sent automatically. Please do not reply to this email.</small>\
                </p>\
                <script>\
                    function copyOTP() {\
                        var otpCode = document.getElementById(\"otpCode\");\
                        var range = document.createRange();\
                        range.selectNode(otpCode);\
                        window.getSelection().removeAllRanges();\
                        window.getSelection().addRange(range);\
                        document.execCommand(\"copy\");\
                        window.getSelection().removeAllRanges();\
                        var copiedMessage = document.querySelector(\".copied\");\
                        copiedMessage.style.display = \"flex\";\
                        setTimeout(function() {\
                            copiedMessage.classList.add('blur-effect');\
                        }, 1000);\
                        setTimeout(function() {\
                            copiedMessage.style.display = \"none\";\
                            copiedMessage.classList.remove('blur-effect');\
                        }, 1500);\
                    }\
                </script>\
                </body>\
                </html>";

            // Remaining code for sending email...
        } catch (const std::exception &e) {
            std::cout << e.what() << '\n';
        }
    };
    std::thread(sendEmailTask, recipient, otp).detach();
}

