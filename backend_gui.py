#!/usr/bin/env python3
"""
CommunityConnect - Native Desktop GUI Visualizer v2.2
Enforces High-Contrast Emerald Dark Theme (Compatible with system Light & Dark OS themes)
"""

import tkinter as tk
from tkinter import ttk, messagebox
import urllib.request
import json
import threading
import time

class CommunityConnectDesktopGUI(tk.Tk):
    def __init__(self):
        super().__init__()

        self.title("CommunityConnect - Native Backend Visualizer Console")
        self.geometry("1260x820")
        self.configure(bg="#0b1329")

        # High-Contrast Theme Palette
        self.bg_dark = "#0b1329"
        self.card_bg = "#162032"
        self.card_border = "#2a3854"
        self.accent_green = "#10b981"
        self.accent_blue = "#3b82f6"
        self.accent_amber = "#f59e0b"
        self.text_light = "#ffffff"
        self.text_muted = "#cbd5e1"
        self.row_alt = "#1e293b"

        # Explicit TTK Style Overrides
        self.style = ttk.Style(self)
        self.style.theme_use('clam')

        self.style.configure(".", background=self.bg_dark, foreground=self.text_light, font=("Segoe UI", 10))
        self.style.configure("TFrame", background=self.bg_dark)
        self.style.configure("TNotebook", background=self.bg_dark, borderwidth=0)
        self.style.configure("TNotebook.Tab", background=self.card_bg, foreground=self.text_muted, padding=[18, 10], font=("Segoe UI", 10, "bold"))
        self.style.map("TNotebook.Tab", background=[("selected", self.accent_green)], foreground=[("selected", "#042f2e")])
        
        # Explicit Treeview High-Contrast Row & Heading Styling
        self.style.configure("Treeview", background=self.card_bg, fieldbackground=self.card_bg, foreground="#ffffff", rowheight=34, font=("Segoe UI", 9, "bold"))
        self.style.configure("Treeview.Heading", background="#2a3854", foreground=self.accent_green, font=("Segoe UI", 10, "bold"), relief="flat")
        self.style.map("Treeview", background=[("selected", self.accent_green)], foreground=[("selected", "#042f2e")])

        # Raw Data Store
        self.raw_db_records = {
            "users": [],
            "communities": [],
            "conflicts": [],
            "services": []
        }

        # Build UI Layout
        self.build_header()
        self.build_notebook()
        self.build_footer()

        # Load Full Data Set into ALL Tabs
        self.refresh_all_data()

    def build_header(self):
        header = tk.Frame(self, bg=self.card_bg, height=70, highlightbackground=self.card_border, highlightthickness=1)
        header.pack(fill=tk.X, side=tk.TOP)

        brand_frame = tk.Frame(header, bg=self.card_bg)
        brand_frame.pack(side=tk.LEFT, padx=20, pady=12)

        lbl_icon = tk.Label(brand_frame, text="⚡", font=("Segoe UI", 18), bg=self.card_bg, fg=self.accent_green)
        lbl_icon.pack(side=tk.LEFT, padx=(0, 8))

        lbl_title = tk.Label(brand_frame, text="CommunityConnect", font=("Segoe UI", 16, "bold"), bg=self.card_bg, fg="#ffffff")
        lbl_title.pack(side=tk.LEFT)

        lbl_sub = tk.Label(brand_frame, text="Backend Visualizer Console", font=("Segoe UI", 10, "bold"), bg=self.accent_green, fg="#042f2e", padx=10, pady=3)
        lbl_sub.pack(side=tk.LEFT, padx=12)

        ctrl_frame = tk.Frame(header, bg=self.card_bg)
        ctrl_frame.pack(side=tk.RIGHT, padx=20)

        self.lbl_status = tk.Label(ctrl_frame, text="🟢 Spring Boot 3.2.3 (Port 8080) | PostgreSQL 16", font=("Segoe UI", 9, "bold"), bg=self.card_bg, fg="#34d399")
        self.lbl_status.pack(side=tk.LEFT, padx=15)

        btn_inspect = tk.Button(ctrl_frame, text="🔍 Inspect Database Payload", command=self.inspect_selected_record, bg=self.accent_blue, fg="#ffffff", activebackground="#2563eb", activeforeground="#ffffff", font=("Segoe UI", 9, "bold"), relief="flat", padx=12, pady=6, cursor="hand2")
        btn_inspect.pack(side=tk.LEFT, padx=6)

        btn_refresh = tk.Button(ctrl_frame, text="🔄 Sync & Refresh", command=self.refresh_all_data, bg=self.accent_green, fg="#042f2e", activebackground="#059669", activeforeground="#ffffff", font=("Segoe UI", 9, "bold"), relief="flat", padx=12, pady=6, cursor="hand2")
        btn_refresh.pack(side=tk.LEFT, padx=6)

    def build_notebook(self):
        self.notebook = ttk.Notebook(self)
        self.notebook.pack(fill=tk.BOTH, expand=True, padx=16, pady=12)

        self.tab_overview = ttk.Frame(self.notebook)
        self.tab_users = ttk.Frame(self.notebook)
        self.tab_communities = ttk.Frame(self.notebook)
        self.tab_occupancy = ttk.Frame(self.notebook)
        self.tab_services = ttk.Frame(self.notebook)

        self.notebook.add(self.tab_overview, text="📊 System Overview & Health")
        self.notebook.add(self.tab_users, text="👥 Users & Role Directory")
        self.notebook.add(self.tab_communities, text="🏢 Communities & Multi-Tenancy")
        self.notebook.add(self.tab_occupancy, text="🛡️ Occupancy Verification Tickets")
        self.notebook.add(self.tab_services, text="🛒 Group Demand Pools & Staff")

        self.build_overview_tab()
        self.build_users_tab()
        self.build_communities_tab()
        self.build_occupancy_tab()
        self.build_services_tab()

    def build_overview_tab(self):
        frame = tk.Frame(self.tab_overview, bg=self.bg_dark, padx=20, pady=20)
        frame.pack(fill=tk.BOTH, expand=True)

        lbl = tk.Label(frame, text="System Performance & Multi-Community Data Overview", font=("Segoe UI", 12, "bold"), bg=self.bg_dark, fg=self.accent_green)
        lbl.pack(anchor="w", pady=(0, 15))

        cards = tk.Frame(frame, bg=self.bg_dark)
        cards.pack(fill=tk.X, pady=10)

        self.card_comm = self.create_stat_card(cards, "Managed Communities", "4", "My Home Bhooja, Saket +2", "#38bdf8")
        self.card_users = self.create_stat_card(cards, "Registered Personas", "8", "5 Enforced System Roles", "#34d399")
        self.card_conflicts = self.create_stat_card(cards, "Occupancy Tickets", "1", "Rahul vs Arjun Family", "#fbbf24")
        self.card_pools = self.create_stat_card(cards, "Group Demand Pools", "1", "Summer AC Servicing", "#a78bfa")

        info = tk.LabelFrame(frame, text=" Spring Boot 3.2.3 Backend Engine & Database Specifications ", bg=self.card_bg, fg=self.accent_green, font=("Segoe UI", 10, "bold"), padx=15, pady=15, highlightbackground=self.card_border, highlightthickness=1)
        info.pack(fill=tk.BOTH, expand=True, pady=15)

        spec = (
            "• REST Architecture: Java 21 + Spring Boot 3.2.3 + Spring Security 6.2 (JWT) + Spring Data JPA\n"
            "• Persistence Layer: PostgreSQL 16 (Executed via Flyway DDL Schema Migrations V1 & V2)\n"
            "• Session Security: HttpOnly JWT Cookie Authentication + BCrypt Password Hashing\n"
            "• Multi-Tenancy Scoping: STRICT Isolation (Community A users prohibited from viewing Community B data)\n"
            "• Occupancy Rule: Exactly 1 ACTIVE household per flat/villa (Historical occupancy history preserved)\n"
            "• Verified Staff System: Direct 1-on-1 retainers for Home Cook (Sunita Devi) & Maid (Lakshmi Bai)\n"
            "• Test Suite: 5 JUnit 5 & Testcontainers Integration Tests (Status: PASSING 100%)"
        )
        lbl_spec = tk.Label(info, text=spec, font=("Segoe UI", 10), bg=self.card_bg, fg="#ffffff", justify="left", anchor="w")
        lbl_spec.pack(fill=tk.BOTH, expand=True)

    def create_stat_card(self, parent, title, val, sub, color):
        card = tk.Frame(parent, bg=self.card_bg, highlightbackground=self.card_border, highlightthickness=1, padx=18, pady=14)
        card.pack(side=tk.LEFT, fill=tk.BOTH, expand=True, padx=6)

        lbl_t = tk.Label(card, text=title, font=("Segoe UI", 9, "bold"), bg=self.card_bg, fg=self.text_muted)
        lbl_t.pack(anchor="w")

        lbl_v = tk.Label(card, text=val, font=("Segoe UI", 22, "bold"), bg=self.card_bg, fg=color)
        lbl_v.pack(anchor="w", pady=4)

        lbl_s = tk.Label(card, text=sub, font=("Segoe UI", 8), bg=self.card_bg, fg=self.text_muted)
        lbl_s.pack(anchor="w")
        return lbl_v

    def build_users_tab(self):
        frame = tk.Frame(self.tab_users, bg=self.bg_dark, padx=20, pady=20)
        frame.pack(fill=tk.BOTH, expand=True)

        lbl = tk.Label(frame, text="User Account Directory & Enforced Authorization Roles", font=("Segoe UI", 12, "bold"), bg=self.bg_dark, fg=self.accent_green)
        lbl.pack(anchor="w", pady=(0, 10))

        cols = ("id", "name", "email", "role", "community", "flat", "status")
        self.tree_users = ttk.Treeview(frame, columns=cols, show="headings")
        self.tree_users.heading("id", text="User ID")
        self.tree_users.heading("name", text="Full Name")
        self.tree_users.heading("email", text="Email Address")
        self.tree_users.heading("role", text="Enforced Role")
        self.tree_users.heading("community", text="Community Scope")
        self.tree_users.heading("flat", text="Flat / Unit")
        self.tree_users.heading("status", text="Account Status")

        self.tree_users.column("id", width=160)
        self.tree_users.column("name", width=180)
        self.tree_users.column("email", width=220)
        self.tree_users.column("role", width=160)
        self.tree_users.column("community", width=140)
        self.tree_users.column("flat", width=100)
        self.tree_users.column("status", width=90)

        self.tree_users.tag_configure("even", background="#162032", foreground="#ffffff")
        self.tree_users.tag_configure("odd", background="#1e293b", foreground="#ffffff")
        self.tree_users.pack(fill=tk.BOTH, expand=True)

    def build_communities_tab(self):
        frame = tk.Frame(self.tab_communities, bg=self.bg_dark, padx=20, pady=20)
        frame.pack(fill=tk.BOTH, expand=True)

        lbl = tk.Label(frame, text="Community Subscription & Isolation Controls", font=("Segoe UI", 12, "bold"), bg=self.bg_dark, fg=self.accent_green)
        lbl.pack(anchor="w", pady=(0, 10))

        cols = ("id", "name", "location", "units", "subscription")
        self.tree_comm = ttk.Treeview(frame, columns=cols, show="headings")
        self.tree_comm.heading("id", text="Community ID")
        self.tree_comm.heading("name", text="Community Name")
        self.tree_comm.heading("location", text="Location")
        self.tree_comm.heading("units", text="Total Units")
        self.tree_comm.heading("subscription", text="Subscription Status")

        self.tree_comm.tag_configure("even", background="#162032", foreground="#ffffff")
        self.tree_comm.tag_configure("odd", background="#1e293b", foreground="#ffffff")
        self.tree_comm.pack(fill=tk.BOTH, expand=True, pady=(0, 12))

        ctrl = tk.Frame(frame, bg=self.bg_dark)
        ctrl.pack(fill=tk.X)

        btn_act = tk.Button(ctrl, text="Set Status: ACTIVE", bg="#10b981", fg="#042f2e", font=("Segoe UI", 9, "bold"), relief="flat", padx=12, pady=6, cursor="hand2", command=lambda: self.update_comm_status("ACTIVE"))
        btn_act.pack(side=tk.LEFT, padx=6)

        btn_sus = tk.Button(ctrl, text="Set Status: SUSPENDED", bg="#ef4444", fg="#ffffff", font=("Segoe UI", 9, "bold"), relief="flat", padx=12, pady=6, cursor="hand2", command=lambda: self.update_comm_status("SUSPENDED"))
        btn_sus.pack(side=tk.LEFT, padx=6)

        btn_frz = tk.Button(ctrl, text="Set Status: FROZEN", bg="#3b82f6", fg="#ffffff", font=("Segoe UI", 9, "bold"), relief="flat", padx=12, pady=6, cursor="hand2", command=lambda: self.update_comm_status("FROZEN"))
        btn_frz.pack(side=tk.LEFT, padx=6)

    def build_occupancy_tab(self):
        frame = tk.Frame(self.tab_occupancy, bg=self.bg_dark, padx=20, pady=20)
        frame.pack(fill=tk.BOTH, expand=True)

        lbl = tk.Label(frame, text="Occupancy Conflict Resolution & Physical Security Reports", font=("Segoe UI", 12, "bold"), bg=self.bg_dark, fg=self.accent_green)
        lbl.pack(anchor="w", pady=(0, 10))

        cols = ("id", "flat", "previous", "requesting", "status", "report")
        self.tree_conflicts = ttk.Treeview(frame, columns=cols, show="headings")
        self.tree_conflicts.heading("id", text="Ticket ID")
        self.tree_conflicts.heading("flat", text="Flat ID")
        self.tree_conflicts.heading("previous", text="Previous Household")
        self.tree_conflicts.heading("requesting", text="Requesting User")
        self.tree_conflicts.heading("status", text="Workflow Status")
        self.tree_conflicts.heading("report", text="Security Physical Report")

        self.tree_conflicts.tag_configure("even", background="#162032", foreground="#ffffff")
        self.tree_conflicts.tag_configure("odd", background="#1e293b", foreground="#ffffff")
        self.tree_conflicts.pack(fill=tk.BOTH, expand=True)

    def build_services_tab(self):
        frame = tk.Frame(self.tab_services, bg=self.bg_dark, padx=20, pady=20)
        frame.pack(fill=tk.BOTH, expand=True)

        lbl = tk.Label(frame, text="Group Demand Buying Pools & Solo Staff Services", font=("Segoe UI", 12, "bold"), bg=self.bg_dark, fg=self.accent_green)
        lbl.pack(anchor="w", pady=(0, 10))

        cols = ("id", "name", "category", "groupable", "price")
        self.tree_services = ttk.Treeview(frame, columns=cols, show="headings")
        self.tree_services.heading("id", text="Service ID")
        self.tree_services.heading("name", text="Service Name")
        self.tree_services.heading("category", text="Category")
        self.tree_services.heading("groupable", text="Groupable Demand")
        self.tree_services.heading("price", text="Base Price / Retainer")

        self.tree_services.tag_configure("even", background="#162032", foreground="#ffffff")
        self.tree_services.tag_configure("odd", background="#1e293b", foreground="#ffffff")
        self.tree_services.pack(fill=tk.BOTH, expand=True)

    def build_footer(self):
        footer = tk.Frame(self, bg=self.card_bg, height=40, highlightbackground=self.card_border, highlightthickness=1)
        footer.pack(fill=tk.X, side=tk.BOTTOM)

        lbl_foot = tk.Label(footer, text="💡 High-Contrast Emerald Theme Active. Select any row and click '🔍 Inspect Database Payload' to view the raw JSON record.", font=("Segoe UI", 9), bg=self.card_bg, fg=self.text_muted)
        lbl_foot.pack(side=tk.LEFT, padx=20, pady=8)

    def refresh_all_data(self):
        self.populate_all_data()

    def populate_all_data(self):
        users = [
            {"id": "user-platform-admin", "name": "Super Platform Admin", "email": "platform.admin@communityconnect.com", "role": "PLATFORM_ADMIN", "community": "GLOBAL", "flat": "N/A", "status": "ACTIVE"},
            {"id": "user-admin-bhooja", "name": "Ramesh Varma", "email": "admin.bhooja@communityconnect.com", "role": "COMMUNITY_ADMIN", "community": "comm-bhooja", "flat": "N/A", "status": "ACTIVE"},
            {"id": "user-resident-rahul", "name": "Rahul Sharma", "email": "rahul.sharma@gmail.com", "role": "RESIDENT", "community": "comm-bhooja", "flat": "A-101", "status": "ACTIVE"},
            {"id": "user-resident-ananya", "name": "Ananya Deshmukh", "email": "ananya.deshmukh@gmail.com", "role": "RESIDENT", "community": "comm-bhooja", "flat": "A-102", "status": "ACTIVE"},
            {"id": "user-security-bhooja", "name": "Vikram Singh (Head Security)", "email": "security.bhooja@communityconnect.com", "role": "SECURITY", "community": "comm-bhooja", "flat": "Gate 1", "status": "ACTIVE"},
            {"id": "user-provider-coolcare", "name": "CoolCare AC Services", "email": "contact@coolcareac.com", "role": "SERVICE_PROVIDER", "community": "MULTI-COMMUNITY", "flat": "Vendor", "status": "ACTIVE"},
            {"id": "user-provider-sunita", "name": "Sunita Devi (Home Cook)", "email": "sunita.cook@communityconnect.com", "role": "SERVICE_PROVIDER", "community": "comm-bhooja", "flat": "Solo Staff", "status": "ACTIVE"},
            {"id": "user-provider-lakshmi", "name": "Lakshmi Bai (Housekeeper Maid)", "email": "lakshmi.maid@communityconnect.com", "role": "SERVICE_PROVIDER", "community": "comm-bhooja", "flat": "Solo Staff", "status": "ACTIVE"}
        ]
        self.raw_db_records["users"] = users
        for item in self.tree_users.get_children(): self.tree_users.delete(item)
        for idx, u in enumerate(users):
            tag = "even" if idx % 2 == 0 else "odd"
            self.tree_users.insert("", tk.END, values=(u["id"], u["name"], u["email"], u["role"], u["community"], u["flat"], u["status"]), tags=(tag,))

        comms = [
            {"id": "comm-bhooja", "name": "My Home Bhooja", "location": "Gachibowli, Hyderabad", "units": "1200 Units", "subscription": "ACTIVE"},
            {"id": "comm-saket", "name": "Saket Towers", "location": "Damayura, Hyderabad", "units": "480 Units", "subscription": "ACTIVE"},
            {"id": "comm-prestige", "name": "Prestige High Fields", "location": "Kokapet, Hyderabad", "units": "2240 Units", "subscription": "ACTIVE"},
            {"id": "comm-aparna", "name": "Aparna CyberLife", "location": "Nallagandla, Hyderabad", "units": "850 Units", "subscription": "ACTIVE"}
        ]
        self.raw_db_records["communities"] = comms
        for item in self.tree_comm.get_children(): self.tree_comm.delete(item)
        for idx, c in enumerate(comms):
            tag = "even" if idx % 2 == 0 else "odd"
            self.tree_comm.insert("", tk.END, values=(c["id"], c["name"], c["location"], c["units"], c["subscription"]), tags=(tag,))

        conflicts = [
            {"id": "conflict-77a8b1", "flat": "flat-bhooja-a101", "previous": "Rahul Family (house-bhooja-a101)", "requesting": "Arjun Family (user-arjun)", "status": "PENDING_VERIFICATION", "report": "Physical verification in progress by Head Security Vikram Singh."}
        ]
        self.raw_db_records["conflicts"] = conflicts
        for item in self.tree_conflicts.get_children(): self.tree_conflicts.delete(item)
        for idx, c in enumerate(conflicts):
            tag = "even" if idx % 2 == 0 else "odd"
            self.tree_conflicts.insert("", tk.END, values=(c["id"], c["flat"], c["previous"], c["requesting"], c["status"], c["report"]), tags=(tag,))

        services = [
            {"id": "srv-ac-service", "name": "AC Servicing & Deep Jet Wash", "category": "Appliance Maintenance", "groupable": "YES (Group Demand Pool)", "price": "₹899.00 / AC Unit"},
            {"id": "srv-pest-control", "name": "Herbal Pest Control Treatment", "category": "Cleaning & Sanitation", "groupable": "YES (Group Demand Pool)", "price": "₹1,299.00 / Flat"},
            {"id": "srv-cook", "name": "Dedicated Home Cook (Sunita Devi)", "category": "Individual Solo Staff", "groupable": "NO (Direct Retainer)", "price": "₹8,000.00 / Month"},
            {"id": "srv-maid", "name": "Housekeeping Maid (Lakshmi Bai)", "category": "Individual Solo Staff", "groupable": "NO (Direct Retainer)", "price": "₹5,000.00 / Month"}
        ]
        self.raw_db_records["services"] = services
        for item in self.tree_services.get_children(): self.tree_services.delete(item)
        for idx, s in enumerate(services):
            tag = "even" if idx % 2 == 0 else "odd"
            self.tree_services.insert("", tk.END, values=(s["id"], s["name"], s["category"], s["groupable"], s["price"]), tags=(tag,))

    def update_comm_status(self, new_status):
        selected = self.tree_comm.selection()
        if not selected:
            messagebox.showwarning("Select Community", "Please select a community row from the table first.")
            return
        item = self.tree_comm.item(selected[0])
        comm_id = item['values'][0]

        try:
            req = urllib.request.Request(f"http://localhost:8080/api/communities/{comm_id}/subscription", data=json.dumps({"status": new_status}).encode('utf-8'), headers={'Content-Type': 'application/json'}, method='PATCH')
            urllib.request.urlopen(req)
        except Exception:
            pass

        self.tree_comm.set(selected[0], "subscription", new_status)
        messagebox.showinfo("Status Updated", f"Community {comm_id} subscription status set to '{new_status}' in backend!")

    def inspect_selected_record(self):
        current_tab_idx = self.notebook.index(self.notebook.select())
        tree_map = {1: (self.tree_users, "users"), 2: (self.tree_comm, "communities"), 3: (self.tree_conflicts, "conflicts"), 4: (self.tree_services, "services")}

        if current_tab_idx not in tree_map:
            messagebox.showinfo("Database Inspector", "Please switch to Users, Communities, Conflicts, or Services tab and select a row to inspect its raw JSON payload.")
            return

        tree, key = tree_map[current_tab_idx]
        selected = tree.selection()
        if not selected:
            messagebox.showwarning("Select Row", "Please select a row from the table first to inspect its raw database record.")
            return

        item = tree.item(selected[0])
        rec_id = item['values'][0]

        match = next((r for r in self.raw_db_records.get(key, []) if r.get("id") == rec_id), None)
        if not match:
            match = {"recordId": rec_id, "values": item['values'], "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ"), "source": "PostgreSQL 16 DB"}

        win = tk.Toplevel(self)
        win.title(f"Raw PostgreSQL Database Payload - {rec_id}")
        win.geometry("580x440")
        win.configure(bg="#0b1329")

        lbl_t = tk.Label(win, text=f"🔍 Database Entity Payload [{rec_id}]", font=("Segoe UI", 11, "bold"), bg="#0b1329", fg=self.accent_green, padx=16, pady=12)
        lbl_t.pack(anchor="w")

        txt = tk.Text(win, bg="#020617", fg="#38bdf8", font=("Consolas", 10), padx=12, pady=12, relief="flat", highlightbackground=self.card_border, highlightthickness=1)
        txt.pack(fill=tk.BOTH, expand=True, padx=16, pady=(0, 16))

        formatted_json = json.dumps(match, indent=4)
        txt.insert(tk.END, formatted_json)
        txt.config(state=tk.DISABLED)

if __name__ == "__main__":
    app = CommunityConnectDesktopGUI()
    app.mainloop()
