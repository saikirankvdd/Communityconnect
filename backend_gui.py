#!/usr/bin/env python3
import http.server
import socketserver
import json
import subprocess
import urllib.parse
import webbrowser
import threading
import time
import sys
import os

PORT = 5050
NEON_URL = "postgresql://neondb_owner:npg_u6TFSRVELoy8@ep-raspy-darkness-b3hdjbk5.c-4.ap-southeast-1.aws.neon.tech/neondb?sslmode=require"

class PersistentDBEngine:
    def __init__(self):
        self.lock = threading.Lock()
        self.proc = None
        self.connect()

    def connect(self):
        cmd = ['psql', NEON_URL, '-t', '-A', '-q']
        try:
            self.proc = subprocess.Popen(
                cmd,
                stdin=subprocess.PIPE,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                text=True,
                bufsize=1
            )
            print("🟢 Persistent DB connection established with Neon.")
        except Exception as e:
            print(f"🔴 DB Connection error: {e}")

    def query(self, sql):
        with self.lock:
            if not self.proc or self.proc.poll() is not None:
                print("🔄 Reconnecting to Neon DB...")
                self.connect()

            try:
                # Wrap SQL into single-line JSON string output
                clean_sql = sql.replace('\n', ' ').strip()
                wrapped = f"SELECT json_build_object('res', ({clean_sql}));\n"
                self.proc.stdin.write(wrapped)
                self.proc.stdin.flush()

                line = self.proc.stdout.readline()
                if not line:
                    self.connect()
                    return None
                
                parsed = json.loads(line.strip())
                return parsed.get('res')
            except Exception as e:
                print(f"Query error: {e}, falling back to single execution...")
                return self.fallback_query(sql)

    def fallback_query(self, sql):
        cmd = ["psql", NEON_URL, "-t", "-A", "-c", f"SELECT json_build_object('res', ({sql}));"]
        try:
            res = subprocess.run(cmd, capture_output=True, text=True, check=True)
            out = res.stdout.strip()
            if out:
                return json.loads(out).get('res')
        except Exception as e:
            print(f"Fallback query error: {e}")
        return None

db_engine = PersistentDBEngine()

class NeonStudioHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path

        if path == "/":
            self.send_response(200)
            self.send_header("Content-Type", "text/html")
            self.end_headers()
            self.wfile.write(HTML_TEMPLATE.encode('utf-8'))
            return

        if path == "/api/status":
            self.send_json({"status": "connected", "database": "Neon PostgreSQL", "latency": "ultra-fast-persistent"})
            return

        if path == "/api/tables":
            tables = db_engine.query("SELECT json_agg(t) FROM (SELECT table_name as name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name) t")
            self.send_json({"tables": tables if isinstance(tables, list) else []})
            return

        if path.startswith("/api/data/"):
            table_name = path.replace("/api/data/", "")
            query = f"""
            SELECT json_build_object(
              'schema', (SELECT json_agg(c) FROM (SELECT column_name, data_type, is_nullable FROM information_schema.columns WHERE table_name = '{table_name}' ORDER BY ordinal_position) c),
              'data', (SELECT json_agg(d) FROM (SELECT * FROM {table_name} LIMIT 200) d),
              'count', (SELECT COUNT(*) FROM {table_name})
            )
            """
            res = db_engine.query(query)
            if not res:
                res = {"schema": [], "data": [], "count": 0}
            data_list = res.get("data") or []
            schema_list = res.get("schema") or []
            cnt = res.get("count") if res.get("count") is not None else len(data_list)
            self.send_json({"table": table_name, "schema": schema_list, "data": data_list, "count": cnt})
            return

        self.send_error(404)

    def do_POST(self):
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length)
        body = json.loads(post_data.decode('utf-8'))

        def fmt_val(v):
            if v is None: return "NULL"
            s = str(v).replace("'", "''")
            return f"'{s}'"

        if self.path == "/api/insert":
            table = body.get("table")
            row = body.get("row", {})
            cols = list(row.keys())
            vals = [fmt_val(v) for v in row.values()]
            sql = f"INSERT INTO {table} ({', '.join(cols)}) VALUES ({', '.join(vals)})"
            res = db_engine.query(sql)
            self.send_json({"status": "success"})
            return

        if self.path == "/api/update":
            table = body.get("table")
            pk_col = body.get("pk_col", "id")
            pk_val = body.get("pk_val")
            row = body.get("row", {})
            set_clauses = [f"{k} = {fmt_val(v)}" for k, v in row.items() if k != pk_col]
            sql = f"UPDATE {table} SET {', '.join(set_clauses)} WHERE {pk_col} = {fmt_val(pk_val)}"
            res = db_engine.query(sql)
            self.send_json({"status": "success"})
            return

        if self.path == "/api/delete":
            table = body.get("table")
            pk_col = body.get("pk_col", "id")
            pk_val = body.get("pk_val")
            sql = f"DELETE FROM {table} WHERE {pk_col} = {fmt_val(pk_val)}"
            res = db_engine.query(sql)
            self.send_json({"status": "success"})
            return

        self.send_error(404)

    def send_json(self, data):
        self.send_response(200)
        self.send_header("Content-Type", "application/json")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.end_headers()
        self.wfile.write(json.dumps(data).encode('utf-8'))

HTML_TEMPLATE = """<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>CommunityConnect - Live Neon DB GUI Studio</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg: #0b0f19;
      --card-bg: #111827;
      --sidebar-bg: #0f172a;
      --border: #1e293b;
      --accent: #10b981;
      --accent-hover: #059669;
      --primary: #3b82f6;
      --danger: #ef4444;
      --text: #f8fafc;
      --text-muted: #94a3b8;
    }

    * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Inter', sans-serif; }

    body {
      background: var(--bg);
      color: var(--text);
      display: flex;
      height: 100vh;
      overflow: hidden;
    }

    .sidebar {
      width: 280px;
      background: var(--sidebar-bg);
      border-right: 1px solid var(--border);
      display: flex;
      flex-direction: column;
    }

    .brand {
      padding: 20px;
      border-bottom: 1px solid var(--border);
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .brand-logo {
      width: 36px;
      height: 36px;
      background: linear-gradient(135deg, #10b981, #3b82f6);
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      color: white;
    }

    .brand-title { font-size: 16px; font-weight: 700; color: white; }
    .brand-status { font-size: 11px; color: var(--accent); display: flex; align-items: center; gap: 6px; }
    .dot { width: 8px; height: 8px; background: var(--accent); border-radius: 50%; box-shadow: 0 0 8px var(--accent); }

    .tables-list {
      flex: 1;
      overflow-y: auto;
      padding: 12px;
    }

    .table-item {
      padding: 10px 14px;
      border-radius: 8px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      cursor: pointer;
      color: var(--text-muted);
      font-size: 13px;
      font-weight: 500;
      margin-bottom: 4px;
      transition: all 0.15s ease-in-out;
    }

    .table-item:hover, .table-item.active {
      background: rgba(59, 130, 246, 0.15);
      color: #60a5fa;
    }

    .table-badge {
      background: #1e293b;
      padding: 2px 8px;
      border-radius: 12px;
      font-size: 11px;
      color: var(--text-muted);
    }

    .main {
      flex: 1;
      display: flex;
      flex-direction: column;
      background: var(--bg);
      overflow: hidden;
    }

    .topbar {
      height: 64px;
      border-bottom: 1px solid var(--border);
      padding: 0 24px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: var(--card-bg);
    }

    .topbar-title {
      font-size: 18px;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .actions { display: flex; gap: 10px; }

    .btn {
      padding: 8px 16px;
      border-radius: 6px;
      border: none;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 6px;
      transition: all 0.2s;
    }

    .btn-primary { background: var(--accent); color: #022c22; }
    .btn-primary:hover { background: var(--accent-hover); }

    .btn-secondary { background: #334155; color: white; }
    .btn-secondary:hover { background: #475569; }

    .btn-danger { background: var(--danger); color: white; }

    .table-container {
      flex: 1;
      overflow: auto;
      padding: 20px;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      background: var(--card-bg);
      border-radius: 8px;
      overflow: hidden;
      border: 1px solid var(--border);
    }

    th, td {
      padding: 12px 16px;
      text-align: left;
      font-size: 13px;
      border-bottom: 1px solid var(--border);
    }

    th {
      background: #0f172a;
      color: var(--text-muted);
      font-weight: 600;
      position: sticky;
      top: 0;
      z-index: 10;
    }

    tr:hover { background: rgba(255, 255, 255, 0.02); }

    .code { font-family: 'JetBrains Mono', monospace; font-size: 12px; color: #38bdf8; }

    .modal-overlay {
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(0, 0, 0, 0.7);
      display: none;
      align-items: center;
      justify-content: center;
      z-index: 100;
    }

    .modal {
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 12px;
      width: 500px;
      max-height: 80vh;
      display: flex;
      flex-direction: column;
      padding: 24px;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5);
    }

    .modal-header { font-size: 18px; font-weight: 700; margin-bottom: 16px; display: flex; justify-content: space-between; }
    .modal-body { flex: 1; overflow-y: auto; display: flex; flex-direction: column; gap: 12px; }

    .form-group { display: flex; flex-direction: column; gap: 4px; }
    .form-group label { font-size: 12px; color: var(--text-muted); font-weight: 500; }
    .form-group input {
      background: #0f172a;
      border: 1px solid var(--border);
      color: white;
      padding: 8px 12px;
      border-radius: 6px;
      font-size: 13px;
    }

    .modal-footer { margin-top: 20px; display: flex; justify-content: flex-end; gap: 10px; }

    .search-input {
      background: #0f172a;
      border: 1px solid var(--border);
      color: white;
      padding: 8px 14px;
      border-radius: 6px;
      width: 250px;
      font-size: 13px;
    }
  </style>
</head>
<body>

  <div class="sidebar">
    <div class="brand">
      <div class="brand-logo">CC</div>
      <div>
        <div class="brand-title">CommunityConnect</div>
        <div class="brand-status"><span class="dot"></span> Persistent Neon Engine</div>
      </div>
    </div>

    <div style="padding: 12px; border-bottom: 1px solid var(--border);">
      <input type="text" id="tableFilter" class="search-input" placeholder="Search tables..." style="width: 100%;" onkeyup="filterTables()">
    </div>

    <div class="tables-list" id="tablesList">
    </div>
  </div>

  <div class="main">
    <div class="topbar">
      <div class="topbar-title">
        <span id="currentTableTitle">Select a Table</span>
        <span class="table-badge" id="currentCount">0 rows</span>
      </div>

      <div class="actions">
        <button class="btn btn-secondary" onclick="loadCurrentTable(true)">🔄 Refresh</button>
        <button class="btn btn-primary" onclick="openInsertModal()">➕ New Record</button>
      </div>
    </div>

    <div class="table-container">
      <table id="dataTable">
        <thead id="tableHead">
          <tr><th>Loading live tables...</th></tr>
        </thead>
        <tbody id="tableBody">
        </tbody>
      </table>
    </div>
  </div>

  <div class="modal-overlay" id="crudModal">
    <div class="modal">
      <div class="modal-header">
        <span id="modalTitle">Add Record</span>
        <span style="cursor:pointer;" onclick="closeModal()">✕</span>
      </div>
      <div class="modal-body" id="modalFields">
      </div>
      <div class="modal-footer">
        <button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
        <button class="btn btn-primary" id="saveBtn" onclick="saveRecord()">Save Record</button>
      </div>
    </div>
  </div>

  <script>
    let currentTable = null;
    let tableSchema = [];
    let currentData = [];
    const dataCache = {};

    async function loadTables() {
      const res = await fetch('/api/tables');
      const data = await res.json();
      const list = document.getElementById('tablesList');
      list.innerHTML = '';
      
      if (!data.tables || !Array.isArray(data.tables) || data.tables.length === 0) {
        list.innerHTML = '<div style="padding:15px; color:var(--text-muted); font-size:12px;">No tables found</div>';
        return;
      }
      
      data.tables.forEach(t => {
        const item = document.createElement('div');
        item.className = 'table-item';
        item.onclick = () => selectTable(t.name);
        item.innerHTML = `<span>📊 ${t.name}</span><span class="table-badge" id="badge_${t.name}">-</span>`;
        item.dataset.name = t.name;
        list.appendChild(item);
      });

      if (data.tables.length > 0) {
        const defaultTable = data.tables.find(t => t.name === 'users') ? 'users' : data.tables[0].name;
        selectTable(defaultTable);
      }
    }

    async function selectTable(name) {
      currentTable = name;
      document.querySelectorAll('.table-item').forEach(el => el.classList.remove('active'));
      const activeEl = document.querySelector(`.table-item[data-name="${name}"]`);
      if (activeEl) activeEl.classList.add('active');

      document.getElementById('currentTableTitle').innerText = `Table: ${name}`;

      // Instant UI cache check
      if (dataCache[name]) {
        renderTableData(dataCache[name]);
      }

      loadCurrentTable();
    }

    async function loadCurrentTable(forceRefresh = false) {
      if (!currentTable) return;
      const res = await fetch(`/api/data/${currentTable}`);
      const result = await res.json();
      dataCache[currentTable] = result;
      renderTableData(result);
    }

    function renderTableData(result) {
      tableSchema = result.schema || [];
      currentData = result.data || [];
      const totalCount = result.count !== undefined ? result.count : currentData.length;

      document.getElementById('currentCount').innerText = `${totalCount} records`;
      const badge = document.getElementById(`badge_${currentTable}`);
      if (badge) badge.innerText = totalCount;

      const thead = document.getElementById('tableHead');
      const tbody = document.getElementById('tableBody');

      if (tableSchema.length === 0) {
        thead.innerHTML = '<tr><th>No schema found</th></tr>';
        tbody.innerHTML = '';
        return;
      }

      let headHTML = '<tr>';
      tableSchema.forEach(col => {
        headHTML += `<th>${col.column_name}</th>`;
      });
      headHTML += '<th style="text-align:right;">Actions</th></tr>';
      thead.innerHTML = headHTML;

      if (!Array.isArray(currentData) || currentData.length === 0) {
        tbody.innerHTML = `<tr><td colspan="${tableSchema.length + 1}" style="text-align:center; padding: 40px; color: var(--text-muted);">No records found in this table. Click "+ New Record" to insert data.</td></tr>`;
        return;
      }

      let bodyHTML = '';
      currentData.forEach((row, idx) => {
        bodyHTML += '<tr>';
        tableSchema.forEach(col => {
          const val = row[col.column_name];
          bodyHTML += `<td><span class="${typeof val === 'string' && val.includes('-') ? 'code' : ''}">${val !== null ? val : '<i style="color:#64748b;">NULL</i>'}</span></td>`;
        });
        const pkCol = tableSchema[0].column_name;
        const pkVal = row[pkCol];
        bodyHTML += `<td style="text-align:right;">
          <button class="btn btn-secondary" style="padding:4px 8px; font-size:11px;" onclick="openEditModal(${idx})">✏️ Edit</button>
          <button class="btn btn-danger" style="padding:4px 8px; font-size:11px;" onclick="deleteRecord('${pkCol}', '${pkVal}')">🗑️</button>
        </td>`;
        bodyHTML += '</tr>';
      });
      tbody.innerHTML = bodyHTML;
    }

    function openInsertModal() {
      document.getElementById('modalTitle').innerText = `Add Record to ${currentTable}`;
      const fields = document.getElementById('modalFields');
      fields.innerHTML = '';
      tableSchema.forEach(col => {
        fields.innerHTML += `
          <div class="form-group">
            <label>${col.column_name} (${col.data_type})</label>
            <input type="text" id="input_${col.column_name}" placeholder="Enter ${col.column_name}">
          </div>
        `;
      });
      document.getElementById('saveBtn').onclick = saveNewRecord;
      document.getElementById('crudModal').style.display = 'flex';
    }

    async function saveNewRecord() {
      const row = {};
      tableSchema.forEach(col => {
        const val = document.getElementById(`input_${col.column_name}`).value;
        if (val.trim() !== '') row[col.column_name] = val;
      });

      await fetch('/api/insert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ table: currentTable, row: row })
      });

      closeModal();
      loadCurrentTable(true);
    }

    function openEditModal(rowIdx) {
      const row = currentData[rowIdx];
      const pkCol = tableSchema[0].column_name;
      const pkVal = row[pkCol];

      document.getElementById('modalTitle').innerText = `Edit Record in ${currentTable}`;
      const fields = document.getElementById('modalFields');
      fields.innerHTML = '';

      tableSchema.forEach(col => {
        const isPk = col.column_name === pkCol;
        fields.innerHTML += `
          <div class="form-group">
            <label>${col.column_name} ${isPk ? '(Primary Key)' : ''}</label>
            <input type="text" id="input_${col.column_name}" value="${row[col.column_name] || ''}" ${isPk ? 'disabled' : ''}>
          </div>
        `;
      });

      document.getElementById('saveBtn').onclick = () => updateRecord(pkCol, pkVal);
      document.getElementById('crudModal').style.display = 'flex';
    }

    async function updateRecord(pkCol, pkVal) {
      const row = {};
      tableSchema.forEach(col => {
        const val = document.getElementById(`input_${col.column_name}`).value;
        row[col.column_name] = val;
      });

      await fetch('/api/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ table: currentTable, pk_col: pkCol, pk_val: pkVal, row: row })
      });

      closeModal();
      loadCurrentTable(true);
    }

    async function deleteRecord(pkCol, pkVal) {
      if (!confirm(`Are you sure you want to delete record ${pkVal}?`)) return;

      await fetch('/api/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ table: currentTable, pk_col: pkCol, pk_val: pkVal })
      });

      loadCurrentTable(true);
    }

    function closeModal() {
      document.getElementById('crudModal').style.display = 'none';
    }

    function filterTables() {
      const q = document.getElementById('tableFilter').value.toLowerCase();
      document.querySelectorAll('.table-item').forEach(el => {
        const name = el.dataset.name.toLowerCase();
        el.style.display = name.includes(q) ? 'flex' : 'none';
      });
    }

    loadTables();
  </script>
</body>
</html>
"""

def main():
    print("==========================================================")
    print(" 🚀 Launching CommunityConnect Live Neon DB Desktop Studio ")
    print("==========================================================")
    print(" Host: ep-raspy-darkness-b3hdjbk5.c-4.ap-southeast-1.aws.neon.tech")
    print(" Database: neondb")
    print(" Engine: Persistent Connection Pool (Ultra-fast)")
    print(" Studio URL: http://localhost:5050")
    print("==========================================================")
    
    url = f"http://localhost:{PORT}"
    webbrowser.open(url)
    
    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer(("", PORT), NeonStudioHandler) as httpd:
        print(f"Server running live on port {PORT}...")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nShutting down DB Studio.")

if __name__ == "__main__":
    main()
