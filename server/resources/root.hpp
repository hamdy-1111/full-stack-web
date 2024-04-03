#pragma once

#include <httpserver.hpp>
#include <iostream>
using namespace httpserver;
using std::string;
// is just std::shared_ptr<http_response>
typedef std::shared_ptr<http_response> response_ptr;

class root_resource : public http_resource {
public:
    response_ptr render(const http_request &req) override;

    file_response *get_requested_file(const http_request &req);

private:
    const string frontend_dir = "frontend";
    const string get_frontend_file(const string &filepath);
    const string get_file_contenttype(const string &filepath);
};
