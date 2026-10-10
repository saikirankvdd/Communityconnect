#!/bin/bash
# Standalone Render Database Desktop GUI Application Launcher

DB_HOST="ep-raspy-darkness-b3hdjbk5.c-4.ap-southeast-1.aws.neon.tech"
DB_NAME="neondb"
DB_USER="neondb_owner"
DB_PASS="npg_u6TFSRVELoy8"
DB_URL="postgresql://${DB_USER}:${DB_PASS}@${DB_HOST}/${DB_NAME}?sslmode=require"

echo "========================================================="
echo " 🚀 Launching Standalone Render Database Desktop GUI"
echo "========================================================="
echo " Host: $DB_HOST"
echo " Database: $DB_NAME"
echo " User: $DB_USER"
echo " SSL Mode: Required"
echo "========================================================="
echo ""

if command -v /snap/bin/dbeaver-ce &> /dev/null; then
    echo "Starting DBeaver CE Desktop Application..."
    /snap/bin/dbeaver-ce &
elif command -v dbeaver-ce &> /dev/null; then
    echo "Starting DBeaver CE Desktop Application..."
    dbeaver-ce &
else
    echo "Launching Database GUI Terminal..."
    psql "$DB_URL"
fi
