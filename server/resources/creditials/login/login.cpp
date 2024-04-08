#include "login.hpp"
#include "util/security.hpp"
#include <stdio.h>
#include "database.hpp"
shared_ptr<http_response> login_resource::render_POST(const http_request &req) {
    string username = req.get_arg("username");
    string password = req.get_arg("password");
    string res;
    if (username_password_match(username, password)) {
        res = "USER NAME AND PASSWORD CORRECT";
    } else {
        res = "USERNAME OR PASSWORD WRONG";
    }
    return shared_ptr<http_response>(new string_response(res));
}

bool login_resource::username_password_match(string username, string password) {
    try {
        SQLite::Statement query(*DataBaseManager::users, "SELECT username, password, salt FROM users WHERE username = ?");

        query.bind(1, username);
        while (query.executeStep()) {
            string stored_username      = query.getColumn(0);
            string stored_password_hash = query.getColumn(1);
            string stored_salt          = query.getColumn(2);
            string password_hash        = sha256_string(stored_salt.append(password));

            if (password_hash == stored_password_hash) {
                return true;
            } else {
                return false;
            }
        }
    } catch (SQLite::Exception &e) {
        std::cout << e.what() << std::endl;
    }
    return false;
}
