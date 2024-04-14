// http library
#include <httpserver.hpp>
// standard libraries
#include <iostream>
#include <fstream>
#include <sstream>
// my code
#include "root/root.hpp"
#include "creditials/login/login.hpp"
#include "creditials/signup/signup.hpp"
#include "creditials/verify/verify.hpp"

#include "resources/database.hpp"
using namespace httpserver;
class w : public webserver {
      
};

int main(int argc, char const *argv[])
{

    webserver ws = create_webserver(443)
        .file_upload_target(FILE_UPLOAD_MEMORY_ONLY)
        .file_upload_dir("database/cache")
        .generate_random_filename_on_upload()
        .tcp_nodelay();
        
    root_resource root_rc;
    login_resource login_rc;
    signup_resource signup_rc;
    verify_resource verify_rc;

    DataBaseManager::InitDatabases(); // Connect to databases
    
    ws.register_resource("/", &root_rc, true);
    ws.register_resource("/sign-in", &login_rc);
    ws.register_resource("/sign-up", &signup_rc);
    ws.register_resource("/verify-otp", &verify_rc);

    std::cout << "Connect to https://localhost:443" << std::endl; 
    ws.start(true);

    DataBaseManager::FinalDatabases(); // clean up memory
    return 0;
}
