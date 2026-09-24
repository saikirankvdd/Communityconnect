#!/bin/bash
# Universal DB Terminal Launcher for H2 and Render PostgreSQL

# Default to H2 TCP URL or accept custom JDBC URL as first argument / environment variable
JDBC_URL="${1:-${DB_URL:-jdbc:h2:tcp://localhost:9092/mem:communityconnect}}"
JDBC_USER="${DB_USERNAME:-sa}"
JDBC_PASS="${DB_PASSWORD:-}"

H2_JAR="$HOME/.m2/repository/com/h2database/h2/2.2.224/h2-2.2.224.jar"

if [ ! -f "$H2_JAR" ]; then
    H2_JAR=$(find "$HOME/.m2/repository/com/h2database/h2" -name "h2-*.jar" | head -n 1)
fi

echo "========================================================"
echo " 🗄️ CommunityConnect Universal Database Terminal"
echo "========================================================"
echo " Connecting to: $JDBC_URL"
echo " User: $JDBC_USER"
echo " Type SQL commands ending with semicolon (;)"
echo " Type 'exit' to quit."
echo "========================================================"
echo ""

if [ -n "$H2_JAR" ]; then
    java -cp "$H2_JAR" org.h2.tools.Shell -url "$JDBC_URL" -user "$JDBC_USER" -password "$JDBC_PASS"
else
    echo "Error: H2 jar file not found. Please compile the backend first with 'mvn compile'."
fi
