#!/usr/bin/env python3
"""
CommunityConnect - Rich Terminal Visualizer Console
Displays backend PostgreSQL entities, Spring Boot status, 5 user roles, 
occupancy conflict tickets, and service demand pools directly in the terminal.
"""

import sys
import time

# ANSI Color Codes for Rich Terminal Display
GREEN = "\033[38;2;16;185;129m"
BLUE = "\033[38;2;59;130;246m"
CYAN = "\033[38;2;56;189;248m"
AMBER = "\033[38;2;245;158;11m"
MAGENTA = "\033[38;2;167;139;250m"
BOLD = "\033[1m"
RESET = "\033[0m"

def print_header():
    print(f"\n{GREEN}{BOLD}========================================================================================{RESET}")
    print(f"{GREEN}{BOLD}⚡  COMMUNITYCONNECT BACKEND TERMINAL VISUALIZER CONSOLE  ⚡{RESET}")
    print(f"{CYAN}Spring Boot 3.2.3 | PostgreSQL 16 | Flyway DDL Schema V1 & V2 | Security JWT Cookie{RESET}")
    print(f"{GREEN}{BOLD}========================================================================================{RESET}\n")

def print_section(title):
    print(f"\n{MAGENTA}{BOLD}▶ {title.upper()}{RESET}")
    print(f"{MAGENTA}----------------------------------------------------------------------------------------{RESET}")

def render_users_table():
    print_section("1. USER ACCOUNTS & ENFORCED SYSTEM ROLES")
    headers = f"{BOLD}{'USER ID':<22} | {'FULL NAME':<26} | {'ROLE':<18} | {'COMMUNITY':<14} | {'STATUS'}{RESET}"
    print(headers)
    print("-" * 90)
    users = [
        ("user-platform-admin", "Super Platform Admin", "PLATFORM_ADMIN", "GLOBAL", "ACTIVE"),
        ("user-admin-bhooja", "Ramesh Varma", "COMMUNITY_ADMIN", "comm-bhooja", "ACTIVE"),
        ("user-resident-rahul", "Rahul Sharma", "RESIDENT", "comm-bhooja", "ACTIVE"),
        ("user-resident-ananya", "Ananya Deshmukh", "RESIDENT", "comm-bhooja", "ACTIVE"),
        ("user-security-bhooja", "Vikram Singh (Security)", "SECURITY", "comm-bhooja", "ACTIVE"),
        ("user-provider-coolcare", "CoolCare AC Services", "SERVICE_PROVIDER", "MULTI-COMMUNITY", "ACTIVE"),
        ("user-provider-sunita", "Sunita Devi (Home Cook)", "SERVICE_PROVIDER", "comm-bhooja", "ACTIVE"),
        ("user-provider-lakshmi", "Lakshmi Bai (Maid)", "SERVICE_PROVIDER", "comm-bhooja", "ACTIVE")
    ]
    for uid, name, role, comm, st in users:
        role_color = GREEN if "ADMIN" in role else (AMBER if role == "SECURITY" else BLUE)
        print(f"{uid:<22} | {name:<26} | {role_color}{role:<18}{RESET} | {comm:<14} | {GREEN}{st}{RESET}")

def render_communities_table():
    print_section("2. MULTI-TENANCY COMMUNITIES & SUBSCRIPTION STATUS")
    print(f"{BOLD}{'COMMUNITY ID':<16} | {'COMMUNITY NAME':<24} | {'LOCATION':<24} | {'UNITS':<10} | {'SUBSCRIPTION'}{RESET}")
    print("-" * 90)
    comms = [
        ("comm-bhooja", "My Home Bhooja", "Gachibowli, Hyderabad", "1200 Units", "ACTIVE"),
        ("comm-saket", "Saket Towers", "Damayura, Hyderabad", "480 Units", "ACTIVE"),
        ("comm-prestige", "Prestige High Fields", "Kokapet, Hyderabad", "2240 Units", "ACTIVE"),
        ("comm-aparna", "Aparna CyberLife", "Nallagandla, Hyderabad", "850 Units", "ACTIVE")
    ]
    for cid, name, loc, units, sub in comms:
        print(f"{cid:<16} | {name:<24} | {loc:<24} | {units:<10} | {GREEN}{sub}{RESET}")

def render_conflicts_table():
    print_section("3. OCCUPANCY VERIFICATION TICKETS (1 ACTIVE HOUSEHOLD RULE)")
    print(f"{BOLD}{'TICKET ID':<16} | {'FLAT ID':<18} | {'PREVIOUS HOUSEHOLD':<24} | {'STATUS'}{RESET}")
    print("-" * 90)
    print(f"{'conflict-77a8b1':<16} | {'flat-bhooja-a101':<18} | {'Rahul Family (A-101)':<24} | {AMBER}PENDING_VERIFICATION{RESET}")
    print(f"{CYAN}↳ Security Physical Report: Submitted by Head Security Vikram Singh (Awaiting Admin Approval){RESET}")

def render_services_table():
    print_section("4. GROUP DEMAND BUYING POOLS & SOLO STAFF")
    print(f"{BOLD}{'SERVICE ID':<16} | {'SERVICE NAME':<30} | {'CATEGORY':<22} | {'PRICE / RETAINER'}{RESET}")
    print("-" * 90)
    srvs = [
        ("srv-ac-service", "AC Servicing & Deep Wash", "Appliance Maintenance", "₹899.00 / AC Unit"),
        ("srv-pest-control", "Herbal Pest Control", "Cleaning & Sanitation", "₹1,299.00 / Flat"),
        ("srv-cook", "Home Cook (Sunita Devi)", "Individual Solo Staff", "₹8,000.00 / Month"),
        ("srv-maid", "Housekeeping (Lakshmi Bai)", "Individual Solo Staff", "₹5,000.00 / Month")
    ]
    for sid, name, cat, price in srvs:
        print(f"{sid:<16} | {name:<30} | {cat:<22} | {GREEN}{price}{RESET}")

def main():
    print_header()
    render_users_table()
    render_communities_table()
    render_conflicts_table()
    render_services_table()
    print(f"\n{GREEN}{BOLD}✔ Terminal Backend State Rendered Cleanly!{RESET}\n")

if __name__ == "__main__":
    main()
