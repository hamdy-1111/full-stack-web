#include "signup.hpp"
#include "database.hpp"
#include "util/security.hpp"
#include <fstream>
shared_ptr<http_response> signup_resource::render_POST(const http_request &req) {

    string uuid = generate_uuid_v4();
    string email = req.get_arg("email");
    string username = req.get_arg("username");
    
    if( username_exists(username) ) {
        return shared_ptr<http_response>( new string_response("User exists aborting") );
    }

    string password = req.get_arg("password");

    if( email.empty() || username.empty() || password.empty() ) {
        return shared_ptr<http_response>(new string_response("A Field is missing please fill the form"));
    }

    string salt = random_string(16);
    string salted_password = salt + password;
    string hashed_password = sha256_string(salted_password);


    string photo = string(req.get_arg("photo"));
    if( photo.size() > 10 * 1024 * 1024 ) { // Photo should be less than 10 MB
        return shared_ptr<http_response>(new string_response("Maximum size of the photo is 10 MB upload smaller pic"));
    }
    std::ofstream("database/photos/" + uuid + ".png") << photo;

    

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

bool signup_resource::username_exists(string username) {
    try {
        SQLite::Statement query(*DataBaseManager::users ,"SELECT username FROM users WHERE username = ?");
        query.bind(1, username);
        while( query.executeStep() ) {
            return true;
        }
        return false;
    } catch (SQLite::Exception &e) {
        std::cout << e.what() << std::endl;
        throw e;
    }
}