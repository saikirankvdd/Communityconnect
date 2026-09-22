#!/bin/bash

# CommunityConnect Terminal Visualizer Launcher
echo "=========================================================="
echo " Launching CommunityConnect Terminal Backend Console "
echo "=========================================================="

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
python3 "$SCRIPT_DIR/terminal_visualizer.py"
