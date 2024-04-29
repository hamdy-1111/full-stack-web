#include "verify.hpp"
#include "database.hpp"
#include "util/email.hpp"
#include "util/security.hpp"
#include <SQLiteCpp/SQLiteCpp.h>
#include <SQLiteCpp/VariadicBind.h>
#include <iostream>
#include <nlohmann/json.hpp>
using namespace nlohmann;
#define WAIT_TIME 45
shared_ptr<http_response> verify_resource::render_POST(const http_request &req) {
    string action;
    string uuid;
    string key;
    try {
        string req_content = string(req.get_content());
        json req_json = json::parse(req_content);
        action = req_json["action"];
        uuid = req_json["uuid"];
        key = req_json["key"];

        if (action == "verify") {
            string otp = req_json["otp-code"];
            return verify_user(uuid, key, otp);
        } else if (action == "resend") {
            return resend_code(uuid, key);
        } else {
            return shared_ptr<http_response>(new string_response("What are you trying to do you naughty user 🤨"));
        }

    } catch (const std::exception &e) {
        std::cout << e.what() << '\n';
    }
}

shared_ptr<http_response> verify_resource::verify_user(string uuid, string key, string otp) {
    try {
        SQLite::Statement query(*DataBaseManager::users, "SELECT otp_code, time_unix, trials FROM users_verify_temp WHERE uuid = ? AND key = ?");
        SQLite::bind(query, uuid, key);

        while (query.executeStep()) {
            string real_otp = query.getColumn(0);
            int time_unix = query.getColumn(1);
            int trials = query.getColumn(2);

            if (trials <= 0) {
                delete_user(uuid, key);
                json res = {
                    {"error", "too-many-trials"},
                    {"verified", false}};
                return shared_ptr<http_response>(new string_response(to_string(res), 200, "application/json"));
            }

            // if user is late delete
            if (time(nullptr) - time_unix > WAIT_TIME) {
                delete_user(uuid, key);
                return shared_ptr<http_response>(new string_response(to_string(json({{"error", "time-out"}, {"verified", false}}))));
            }

            if (real_otp == otp) {
                string new_key = add_new_user(uuid, key);
                if (new_key.empty()) {
                    string_response *res = new string_response(to_string(json({{"error", "something-wrong"}, {"verified", false}})));
                    res->with_header("Content-Type", "application/json");
                    return shared_ptr<http_response>(res);
                }
                json data = {
                    {"error", "no-error"},
                    {"uuid", uuid},
                    {"key", new_key},
                    {"verified", true}};
                string_response *res = new string_response(to_string(data));
                res->with_header("Content-Type", "application/json");
                return shared_ptr<http_response>(res);
            } else {
                SQLite::Statement query_dec(*DataBaseManager::users, "UPDATE users_verify_temp SET trials = trials - 1 WHERE uuid = ? AND key = ?");
                SQLite::bind(query_dec, uuid, key);
                if (query_dec.exec()) {
                    string_response *res = new string_response(to_string(json({{"error", "otp-code-wrong"}, {"verified", false}})));
                    res->with_header("Content-Type", "application/json");
                    return shared_ptr<http_response>(res);
                }
            }
        }
        return shared_ptr<http_response>(new string_response(to_string(json({{"error", "user-not-registered"}, {"verified", false}}))));
    } catch (std::exception &e) {
        std::cout << e.what() << std::endl;
    }
    return shared_ptr<http_response>(new string_response(to_string(json({{"error", "something-wrong"}, {"verified", false}}))));
}

shared_ptr<http_response> verify_resource::resend_code(string uuid, string key) {
    try {
        SQLite::Statement query = SQLite::Statement(*DataBaseManager::users, "SELECT email , time_unix FROM users_verify_temp WHERE uuid = ? AND key = ?");
        query.bind(1, uuid);
        query.bind(2, key);

        while (query.executeStep()) {
            string email = query.getColumn(0);
            int time_token = query.getColumn(1);

            if (time(nullptr) - time_token >= WAIT_TIME) {
                SQLite::Statement update_otp_query = SQLite::Statement(*DataBaseManager::users, "UPDATE users_verify_temp SET trials = 5 , time_unix = strftime('%s', 'now') , otp_code = ? WHERE uuid = ? AND key = ?");
                string otp = generate_otp_code();
                SQLite::bind(update_otp_query, otp, uuid, key);
                update_otp_query.exec();
                sendOTPEmail(email, otp);

                json response = {
                    {"error", "no-error"},
                    {"done", "code-resent"}};

                return shared_ptr<http_response>(new string_response(to_string(response), 200, "application/json"));
            } else {
                json response{
                    {"error", "wait-time"},
                    {"wait", WAIT_TIME - time(nullptr) + time_token},
                    {"done", "no-code-sent"},
                };

                return shared_ptr<http_response>(new string_response(to_string(response), 200, "application/json"));
            }
        }
        return shared_ptr<http_response>(new string_response(to_string(json({{"error", "user-not-registered"}, {"verified", false}}))));
    } catch (const std::exception &e) {
        std::cerr << e.what() << '\n';
    }
    return shared_ptr<http_response>(new string_response(to_string(json({{"error", "something-wrong"}, {"verified", false}}))));
}

string verify_resource::add_new_user(string uuid, string key) {
    string new_key = random_string(64);
    try {
        SQLite::Statement query(*DataBaseManager::users, "SELECT username, email, salt, password, photo_state FROM users_verify_temp WHERE uuid = ? AND key = ?");
        SQLite::bind(query, uuid, key);

        while (query.executeStep()) {
            string username = query.getColumn(0);
            string email    = query.getColumn(1);
            string salt     = query.getColumn(2);
            string password = query.getColumn(3);
            int photo_state = query.getColumn(4);

            SQLite::Statement query_add(*DataBaseManager::users, "INSERT INTO users ([uuid], [username], [email], [salt], [password], [key], [photo_state]) VALUES ( ? , ? , ? , ? , ? , ? , ? )");
            SQLite::bind(query_add, uuid, username, email, salt, password, new_key, photo_state);
            query_add.exec();
            std::rename((uuid+"-temp").c_str(), uuid.c_str());
            return new_key;
        }
    } catch (const std::exception &e) {
        std::cerr << e.what() << '\n';
    }
    return "";
}

void verify_resource::delete_user(const string &uuid, const string &key) {
    SQLite::Statement query_delete(*DataBaseManager::users, "DELETE FROM users_verify_temp WHERE uuid = ? AND key = ?");
    query_delete.bind(1, uuid);
    query_delete.bind(2, key);
    query_delete.exec();
}