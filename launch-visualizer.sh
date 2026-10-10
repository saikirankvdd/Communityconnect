#!/bin/bash

# CommunityConnect Native Desktop GUI Visualizer Launcher
echo "=========================================================="
echo " 🚀 Launching CommunityConnect Live Neon DB Desktop Studio "
echo "=========================================================="

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
chmod +x "$SCRIPT_DIR/backend_gui.py"
python3 "$SCRIPT_DIR/backend_gui.py"

