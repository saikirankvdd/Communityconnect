#!/bin/bash
# Universal DB Terminal Launcher for H2 and Render PostgreSQL

INPUT_URL="${1:-${DB_URL:-jdbc:h2:tcp://localhost:9092/mem:communityconnect}}"

# If connecting to PostgreSQL (Render DB)
if [[ "$INPUT_URL" == postgres* ]]; then
    PG_URL="${INPUT_URL#jdbc:}"
    # Automatically append ?sslmode=require if not present
    if [[ "$PG_URL" != *"sslmode="* ]]; then
        if [[ "$PG_URL" == *"?"* ]]; then
            PG_URL="${PG_URL}&sslmode=require"
        else
            PG_URL="${PG_URL}?sslmode=require"
        fi
    fi
    echo "========================================================"
    echo " 🗄️ Connecting to Render PostgreSQL Terminal (psql)..."
    echo "========================================================"
    echo ""
    psql "$PG_URL"
    exit 0
fi

# Otherwise connect to Local H2 DB
H2_JAR="$HOME/.m2/repository/com/h2database/h2/2.2.224/h2-2.2.224.jar"
if [ ! -f "$H2_JAR" ]; then
    H2_JAR=$(find "$HOME/.m2/repository/com/h2database/h2" -name "h2-*.jar" | head -n 1)
fi

echo "========================================================"
echo " 🗄️ Connecting to Local H2 Database Terminal..."
echo "========================================================"
echo " Type SQL commands ending with semicolon (;)"
echo " Type 'exit' to quit."
echo "========================================================"
echo ""

if [ -n "$H2_JAR" ]; then
    java -cp "$H2_JAR" org.h2.tools.Shell -url "$INPUT_URL" -user "${DB_USERNAME:-sa}" -password "${DB_PASSWORD:-}"
else
    echo "Error: H2 jar file not found. Please compile the backend first with 'mvn compile'."
fi
