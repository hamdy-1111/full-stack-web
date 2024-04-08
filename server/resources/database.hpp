#pragma once
#include <SQLiteCpp/SQLiteCpp.h>

class DataBaseManager final {
    public:
        DataBaseManager() = delete;
        static void InitDatabases();
        static void FinalDatabases();
        static SQLite::Database *users;

};