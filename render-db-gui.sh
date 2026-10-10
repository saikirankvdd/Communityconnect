#!/bin/bash
# Neat Structured Standalone Database GUI for Render PostgreSQL

H2_JAR=$(find "$HOME/.m2/repository/com/h2database/h2" -name "h2-*.jar" | head -n 1)
PG_JAR=$(find "$HOME/.m2/repository/org/postgresql/postgresql" -name "postgresql-*.jar" | head -n 1)

RENDER_URL="jdbc:postgresql://ep-raspy-darkness-b3hdjbk5.c-4.ap-southeast-1.aws.neon.tech/neondb?sslmode=require"
RENDER_USER="neondb_owner"
RENDER_PASS="npg_u6TFSRVELoy8"

echo "========================================================"
echo " 🗄️ Launching Neat Structured Render DB GUI..."
echo "========================================================"
echo " Driver: PostgreSQL Driver"
echo " Host: dpg-dapc9qvf3r2c73c7hqjg-a.ohio-postgres.render.com"
echo "========================================================"
echo ""

java -cp "${H2_JAR}:${PG_JAR}" org.h2.tools.Console \
  -url "${RENDER_URL}" \
  -driver "org.postgresql.Driver" \
  -user "${RENDER_USER}" \
  -password "${RENDER_PASS}"
