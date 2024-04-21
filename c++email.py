#!/bin/python
file = open("frontend/email.html")
lines = file.readlines()

for i in range(len(lines)):
    lines[i] = lines[i].replace("\n", "")
    lines[i] = lines[i].replace("\"", '\\"')
    lines[i] = "\"" + lines[i] + "\""
    print(lines[i])
