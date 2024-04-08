#include "database.hpp"
SQLite::Database *DataBaseManager::users;

void DataBaseManager::InitDatabases() {
    users = new SQLite::Database("database/users.db", SQLite::OPEN_READWRITE);
}


void DataBaseManager::FinalDatabases() {
    delete users;
}
