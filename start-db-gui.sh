#!/bin/bash
# Standalone H2 Database Desktop Application Window Launcher for CommunityConnect

URL="http://localhost:8080/h2-console"

echo "Launching Database Desktop GUI Window..."

if command -v brave-browser &> /dev/null; then
    brave-browser --app="$URL" >/dev/null 2>&1 &
elif command -v google-chrome &> /dev/null; then
    google-chrome --app="$URL" >/dev/null 2>&1 &
elif command -v chromium &> /dev/null; then
    chromium --app="$URL" >/dev/null 2>&1 &
elif command -v /snap/bin/dbeaver-ce &> /dev/null; then
    /snap/bin/dbeaver-ce >/dev/null 2>&1 &
else
    xdg-open "$URL"
fi
