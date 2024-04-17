#include "email.hpp"
#include <fstream>
#include <sstream>
std::string constructHTMLEmail(const std::string &recipient, const std::string &subject, const std::string &body)
{
 
    std::ifstream in = std::ifstream("email_template/email.html");
    std::stringstream ss;
    ss << in.rdbuf();
    std::string htmlEmail = ss.str();
    return htmlEmail;
}

/*
ofstream stands for output file stream
it just write files
ok

ifstream reads  input file stream
ok
complete coding
I forgot how to read files I  need auto completetion
yeah like u 
  */