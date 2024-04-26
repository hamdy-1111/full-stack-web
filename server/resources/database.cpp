#include "database.hpp"
SQLite::Database *DataBaseManager::users;

void DataBaseManager::InitDatabases() {
    users = new SQLite::Database("database/users.db", SQLite::OPEN_READWRITE);
    users->exec("CREATE TEMPORARY TABLE users_verify_temp ( [uuid] UUID NOT NULL UNIQUE, [username] VARCHAR(25) NOT NULL UNIQUE, [email] VARCHAR(254) NOT NULL UNIQUE, [salt] CHAR(16) NOT NULL, [password] CHAR(64) NOT NULL, [photo_state] INTEGER NOT NULL, [key] CHAR(40) NOT NULL, [otp_code] CHAR(6) NOT NULL, [time_unix] INTEGER NOT NULL, [trials] INTEGER NOT NULL)");
}


void DataBaseManager::FinalDatabases() {
    delete users;
}
