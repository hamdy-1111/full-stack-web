#include "security.hpp"
#include <openssl/sha.h>
#include <random>
#include <sstream>

std::string sha256_string(const std::string &string) {
    std::string obuf;
    obuf.resize(64);

    unsigned char hash[SHA256_DIGEST_LENGTH];
    SHA256((unsigned char *)string.c_str(), string.size(), hash);
    int i = 0;
    for (i = 0; i < SHA256_DIGEST_LENGTH; i++) {
        sprintf(&obuf[0] + (i * 2), "%02x", hash[i]);
    }
    return obuf;
}

static const std::string CHARACTERS = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*()_+-=[]{}/\\|?<>\"\';:~`,.";
static std::random_device random_device;
static std::mt19937 generator(random_device());
static std::uniform_int_distribution<> distribution(0, CHARACTERS.size() - 1);

std::string random_string(std::size_t length) {
    
    std::string random_string;

    for (std::size_t i = 0; i < length; ++i) {
        random_string += CHARACTERS[distribution(generator)];
    }

    return random_string;
}

static std::random_device rd;
static std::mt19937 gen(rd());
static std::uniform_int_distribution<> dis(0, 15);
static std::uniform_int_distribution<> dis2(8, 11);

std::string generate_uuid_v4() {
    std::stringstream ss;
    int i;
    ss << std::hex;
    for (i = 0; i < 8; i++) {
        ss << dis(gen);
    }
    ss << "-";
    for (i = 0; i < 4; i++) {
        ss << dis(gen);
    }
    ss << "-4";
    for (i = 0; i < 3; i++) {
        ss << dis(gen);
    }
    ss << "-";
    ss << dis2(gen);
    for (i = 0; i < 3; i++) {
        ss << dis(gen);
    }
    ss << "-";
    for (i = 0; i < 12; i++) {
        ss << dis(gen);
    };
    return ss.str();
}

static std::random_device rd_otp;
static std::mt19937 gen_otp(rd_otp());
static std::uniform_int_distribution<> dis_otp('0','9');
std::string generate_otp_code() {
    std::string otp = "";
    otp.reserve(6);
    for(int i = 0; i < 6 ; i++){
        otp.push_back(dis_otp(gen_otp));
    }
    return otp;
}