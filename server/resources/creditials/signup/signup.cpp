#include "signup.hpp"
#include "database.hpp"
#include "util/security.hpp"
#include <fstream>
shared_ptr<http_response> signup_resource::render_POST(const http_request &req) {
    string uuid = generate_uuid_v4();
    for (auto &file_key : req.get_files()) {
        if (file_key.first == "photo") {
            for (auto &file : file_key.second) {
                if( file.second.get_file_size() > 10 * 1024 * 1024 ) {
                    return shared_ptr<http_response>(new string_response("Photo too large max size 10MB"));
                }
                string filename = file.second.get_file_system_file_name();
                std::ofstream("database/photos/" + uuid + ".png") << std::ifstream(filename).rdbuf();
            }
        }
    }
    string email = req.get_arg("email");
    string username = req.get_arg("username");
    string password = req.get_arg("password");

    if( email.empty() || username.empty() || password.empty() ) {
        return shared_ptr<http_response>(new string_response("A Field is missing please fill the form"));
    }

    string salt = random_string(16);
    string salted_password = salt + password;
    string hashed_password = sha256_string(salted_password);

    

    try {
        SQLite::Statement query(*DataBaseManager::users, "INSERT INTO users VALUES (?, ?, ?, ?, ?)");

        query.bind(1, uuid);
        query.bind(2, username);
        query.bind(3, hashed_password);
        query.bind(4, salt);
        query.bind(5, email);

        query.exec();
        return shared_ptr<http_response>(new string_response("User saved successfully."));
    } catch (SQLite::Exception &e) {
        std::cout << e.what() << std::endl;
        return shared_ptr<http_response>(new string_response("Something went wrong"));
    }
}