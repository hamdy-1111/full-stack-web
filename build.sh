#!/bin/bash

if [[ $1 != "windows" && $1 != "linux" ]]; then
    echo "./build.sh <OS NAME> (either windows or linux)"
    exit
fi

FLAGS=""
BUILD_TYPE=""
if [[ $2 == "release" ]]; then
    FLAGS="-DCMAKE_BUILD_TYPE=Release"
    BUILD_TYPE="RELEASE"
    echo "BUILD RELEASE"


elif [[ $2 == "debug" ]]; then
    FLAGS="-DCMAKE_BUILD_TYPE=Debug"
    BUILD_TYPE="DEBUG"
    echo "BUILD DEBUG"
fi

if [[ $1 == "windows" ]]; then
    cmake -S . -B cmakefiles-mingw/ -DOS_NAME:String=Windows $FLAGS
    cmake --build cmakefiles-mingw/ --parallel
    echo "WINDOWS BUILD DONE"
elif [[ $1 == "linux" ]]; then
    cmake -S . -B cmakefiles/ $FLAGS
    cmake --build cmakefiles/ --parallel
    echo "LINUX BUILD DONE"
fi
echo "BUILD TYPE: $BUILD_TYPE"