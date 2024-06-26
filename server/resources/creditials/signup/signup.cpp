#include "signup.hpp"
#include "database.hpp"
#include "util/security.hpp"
#include "util/email.hpp"

#include <fstream>

#include <mailio/mailboxes.hpp>
#include <mailio/smtp.hpp>

#include <SQLiteCpp/VariadicBind.h>
#include <nlohmann/json.hpp>
#include <thread>
// param user name = "username"
// param email     = "email"
// param password  = "password"
// param photo     = "photo"

using namespace mailio;
using namespace nlohmann;

#define MAXIMUM_USERNAME_LENGTH 25
#define MAX_TRIALS 5
shared_ptr<http_response> signup_resource::render_POST(const http_request &req) {

    // get user info
    string req_content = string(req.get_content());
    json req_json = json::parse(req_content);

    // if empty return
    if ( !req_json.contains("username") || !req_json.contains("email") || !req_json.contains("password") || !req_json.contains("photo")) {
        string_response *res = new string_response(to_string(json({{"error", "invalid-parameters"}})));
        res->with_header("Content-Type", "application/json");
        return shared_ptr<http_response>(res);
    }
    string username = req_json["username"];
    string email = req_json["email"];
    string password = req_json["password"];
    
    std::cout << "a sign up request received\n";
    // check if username is too long
    if (username.size() > MAXIMUM_USERNAME_LENGTH) {
        string_response *res = new string_response(to_string(json({{"error", "username-too-long"}, {"max", MAXIMUM_USERNAME_LENGTH}})));
        res->with_header("Content-Type", "application/json");
        return shared_ptr<http_response>(res);
    }
    // check if username exists
    if (username_exists(username)) {
        std::cout << "Bad request: username already exists and verified\n";
        string_response *res = new string_response(to_string(json({{"error", "user-exists"}})));
        res->with_header("Content-Type", "application/json");
        return shared_ptr<http_response>(res);
    }

    if (email_exists(email)) {
        std::cout << "Bad request: email already exists and verified\n";
        string_response *res = new string_response(to_string(json({{"error", "email-exists"}})));
        res->with_header("Content-Type", "application/json");
        return shared_ptr<http_response>(res);
    }

    // if username or email exists in temp database delete them
    if (username_exists(username, true)) {
        SQLite::Statement query_delete(*DataBaseManager::users, "DELETE FROM users_verify_temp WHERE username = ?");
        query_delete.bind(1, username);
        query_delete.exec();
    }

    if (email_exists(email, true)) {
        SQLite::Statement query_delete(*DataBaseManager::users, "DELETE FROM users_verify_temp WHERE email = ?");
        query_delete.bind(1, email);
        query_delete.exec();
    }
    // generate uuid;
    string uuid = generate_uuid_v4();

    // check if user uploaded a photo
    int photo_state;
    string photo = req_json["photo"];
    if (photo == "0" || photo.empty()) {
        photo_state = 0;
    } else {
        photo_state = 1;
        std::ofstream(PHOTO_PREFIX + uuid + "-temp") << photo;
    }

    // generate salt and hash password
    string salt = random_string(16);
    string password_hashed = sha256_string(salt + password);

    // otp
    string otp_code = generate_otp_code();
    sendOTPEmail(email, otp_code);

    // generate random key
    string key = random_string(40);

    try {
        // insert user info in the temp table
        SQLite::Statement query(*DataBaseManager::users, "INSERT INTO users_verify_temp ([uuid], [username], [email], [salt], [password], [photo_state], [key], [otp_code] , [time_unix], [trials]) VALUES ( ? , ? , ? , ? , ? , ? , ? , ? , strftime('%s', 'now') , ? )");
        SQLite::bind(query, uuid, username, email, salt, password_hashed, photo_state, key, otp_code, MAX_TRIALS);
        query.exec();

        json res = {
            {"error", "no-error"},
            {"uuid", uuid},
            {"key", key},
        };
        string_response *res_json = new string_response(to_string(res));
        res_json->with_header("Content-Type", "application/json");
        return shared_ptr<http_response>(res_json);
    } catch (std::exception &e) {
        std::cout << e.what() << std::endl;
    }
}


bool signup_resource::username_exists(string username, bool temp_db) {
    try {
        std::unique_ptr<SQLite::Statement> query;
        if (temp_db) {
            query = std::make_unique<SQLite::Statement>(*DataBaseManager::users, "SELECT username FROM users_verify_temp WHERE username = ?");
        } else {
            query = std::make_unique<SQLite::Statement>(*DataBaseManager::users, "SELECT username FROM users WHERE username = ?");
        }
        query->bind(1, username);
        while (query->executeStep()) {
            return true;
        }
        return false;
    } catch (SQLite::Exception &e) {
        std::cout << e.what() << std::endl;
        throw e;
    }
}

bool signup_resource::email_exists(string email, bool temp_db) {
    try {
        std::unique_ptr<SQLite::Statement> query;
        if (temp_db) {
            query = std::make_unique<SQLite::Statement>(*DataBaseManager::users, "SELECT email FROM users_verify_temp WHERE email = ?");
        } else {
            query = std::make_unique<SQLite::Statement>(*DataBaseManager::users, "SELECT email FROM users WHERE email = ?");
        }
        query->bind(1, email);
        while (query->executeStep()) {
            return true;
        }
        return false;
    } catch (SQLite::Exception &e) {
        std::cout << e.what() << std::endl;
        throw e;
    }
}