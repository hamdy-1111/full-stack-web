#pragma once
#include <SQLiteCpp/SQLiteCpp.h>
#define PHOTO_PREFIX "database/photos/"
class DataBaseManager final {
    public:
        DataBaseManager() = delete;
        static void InitDatabases();
        static void FinalDatabases();
        static SQLite::Database *users;

};