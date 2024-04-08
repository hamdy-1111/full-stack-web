#include "root.hpp"
#include <filesystem>
shared_ptr<http_response> root_resource::render_GET(const http_request &req) {
    return shared_ptr<http_response>(get_requested_content(req));
}

http_response *root_resource::get_requested_content(const http_request &req) {
    string req_path = string(req.get_path());
    string frontend_file = get_frontend_file(req_path);
    if (std::filesystem::exists(frontend_file)) {
        return new file_response(frontend_file, http::http_utils::http_ok, get_file_contenttype(frontend_file));
    } else {
        return new file_response("frontend/404.html", httpserver::http::http_utils::http_not_found, "text/html");
    }
}

const string root_resource::get_frontend_file(const string &filepath) {
    // if requested path is / return index.html
    return frontend_dir + (filepath == "/" ? "/index.html" : filepath);
}

const string root_resource::get_file_contenttype(const string &filepath) {
    string buffer = "";
    for (int i = filepath.size() - 1; i >= 0; i--) {
        if (filepath[i] == '.') {
            buffer = filepath.substr(i);
        }
    }

    if (buffer == ".html")
        return "text/html";

    if (buffer == ".css")
        return "text/css";

    if (buffer == ".js")
        return "text/javascript";

    // else
    return http::http_utils::application_octet_stream;
}