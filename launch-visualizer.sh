#!/bin/bash

# CommunityConnect Native Desktop GUI Visualizer Launcher
echo "=========================================================="
echo " Launching CommunityConnect Native Desktop GUI Application "
echo "=========================================================="

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
python3 "$SCRIPT_DIR/backend_gui.py" &

echo "Native Desktop App Window opened on your laptop screen!"
