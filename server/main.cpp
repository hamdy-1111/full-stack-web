// http library
#include <httpserver.hpp>
// standard libraries
#include <iostream>
// my code
#include "root.hpp"

using namespace httpserver;
int main(int argc, char const *argv[])
{
    webserver ws = create_webserver(80);

    root_resource root_rc;
    ws.register_resource("/", &root_rc, true);

    std::cout << "Starting server" << std::endl;
    ws.start(true);
    return 0;
}
