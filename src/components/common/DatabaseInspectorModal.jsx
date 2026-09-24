import React, { useState, useEffect } from 'react';
import { 
  Database, RefreshCw, X, Table, Search, Terminal, 
  Layers, HardDrive, CheckCircle2, Play, Copy, Check, Info, Server
} from 'lucide-react';

export default function DatabaseInspectorModal({ isOpen, onClose }) {
  const [tables, setTables] = useState([]);
  const [activeTable, setActiveTable] = useState('');
  const [tableData, setTableData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('explorer'); // 'explorer' | 'sql' | 'schema'
  const [searchTerm, setSearchTerm] = useState('');
  const [dbStats, setDbStats] = useState({ totalTables: 0, totalRows: 0, dbEngine: 'H2 Database' });
  const [copiedRowIndex, setCopiedRowIndex] = useState(null);

  // SQL Workbench state
  const [sqlQuery, setSqlQuery] = useState('SELECT * FROM users;');
  const [queryResult, setQueryResult] = useState(null);
  const [queryError, setQueryError] = useState('');
  const [executingQuery, setExecutingQuery] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchTables();
    }
  }, [isOpen]);

  const fetchTables = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/database/tables');
      if (res.ok) {
        const data = await res.json();
        setTables(data.tables || []);
        setDbStats({
          totalTables: data.totalTables || 0,
          totalRows: data.totalRows || 0,
          dbEngine: data.dbEngine || 'H2 In-Memory (PostgreSQL Mode)'
        });
        if (data.tables && data.tables.length > 0 && !activeTable) {
          fetchTableData(data.tables[0].name);
        }
      }
    } catch (err) {
      console.error('Failed to fetch database tables:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTableData = async (tableName) => {
    setActiveTable(tableName);
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/database/tables/${tableName}`);
      if (res.ok) {
        const data = await res.json();
        setTableData(data);
      }
    } catch (err) {
      console.error('Failed to fetch table data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRunQuery = async () => {
    if (!sqlQuery.trim()) return;
    setExecutingQuery(true);
    setQueryError('');
    setQueryResult(null);

    try {
      const res = await fetch('/api/admin/database/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: sqlQuery })
      });
      const data = await res.json();

      if (res.ok) {
        setQueryResult(data);
      } else {
        setQueryError(data.error || 'Failed to execute query');
      }
    } catch (err) {
      setQueryError('Network error executing query');
    } finally {
      setExecutingQuery(false);
    }
  };

  const copyRowJson = (row, index) => {
    navigator.clipboard.writeText(JSON.stringify(row, null, 2));
    setCopiedRowIndex(index);
    setTimeout(() => setCopiedRowIndex(null), 2000);
  };

  if (!isOpen) return null;

  // Filter rows by search term
  const filteredRows = (tableData?.rows || []).filter(row => {
    if (!searchTerm) return true;
    return Object.values(row).some(val => 
      String(val).toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white w-full max-w-6xl h-[88vh] rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden">
        
        {/* Header Bar */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#006b2c] rounded-lg text-white shadow-md">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold tracking-tight text-white">Full-Stack Database Inspector</h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Connected
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {dbStats.dbEngine} • {dbStats.totalTables} Tables • {dbStats.totalRows} Total Records
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={fetchTables}
              disabled={loading}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-1.5 text-xs font-medium"
              title="Refresh Schema & Data"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-emerald-400' : ''}`} />
              Refresh
            </button>
            <button 
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              title="Close Inspector"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation & Controls */}
        <div className="bg-slate-50 border-b border-slate-200 px-6 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('explorer')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${
                activeTab === 'explorer' 
                  ? 'bg-[#006b2c] text-white shadow-sm' 
                  : 'text-slate-600 hover:bg-slate-200/70'
              }`}
            >
              <Table className="w-4 h-4" /> Data Explorer
            </button>
            <button
              onClick={() => setActiveTab('sql')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${
                activeTab === 'sql' 
                  ? 'bg-[#006b2c] text-white shadow-sm' 
                  : 'text-slate-600 hover:bg-slate-200/70'
              }`}
            >
              <Terminal className="w-4 h-4" /> SQL Workbench
            </button>
            <button
              onClick={() => setActiveTab('schema')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${
                activeTab === 'schema' 
                  ? 'bg-[#006b2c] text-white shadow-sm' 
                  : 'text-slate-600 hover:bg-slate-200/70'
              }`}
            >
              <Layers className="w-4 h-4" /> Schema View
            </button>
          </div>

          {activeTab === 'explorer' && (
            <div className="relative w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Filter table rows..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#006b2c]/20 focus:border-[#006b2c]"
              />
            </div>
          )}
        </div>

        {/* Main Content Body */}
        <div className="flex-1 flex overflow-hidden">
          
          {/* Sidebar: Table List */}
          <div className="w-64 border-r border-slate-200 bg-slate-50/50 flex flex-col">
            <div className="p-3 border-b border-slate-200 font-semibold text-xs text-slate-500 uppercase tracking-wider flex items-center justify-between">
              <span>Database Tables ({tables.length})</span>
              <HardDrive className="w-3.5 h-3.5 text-slate-400" />
            </div>

            <div className="flex-1 overflow-y-auto p-2 space-y-1">
              {tables.map((tbl) => (
                <button
                  key={tbl.name}
                  onClick={() => fetchTableData(tbl.name)}
                  className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-medium flex items-center justify-between transition-all ${
                    activeTable === tbl.name 
                      ? 'bg-emerald-50 text-[#006b2c] font-bold border border-emerald-200 shadow-sm' 
                      : 'text-slate-700 hover:bg-slate-200/60'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <Table className={`w-3.5 h-3.5 shrink-0 ${activeTable === tbl.name ? 'text-[#006b2c]' : 'text-slate-400'}`} />
                    <span className="truncate">{tbl.name}</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    activeTable === tbl.name 
                      ? 'bg-[#006b2c] text-white' 
                      : 'bg-slate-200 text-slate-600'
                  }`}>
                    {tbl.rowCount}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Right Panel: Explorer / SQL / Schema */}
          <div className="flex-1 bg-white flex flex-col overflow-hidden">

            {/* TAB 1: DATA EXPLORER */}
            {activeTab === 'explorer' && (
              <div className="flex-1 flex flex-col overflow-hidden">
                <div className="p-4 bg-slate-50/70 border-b border-slate-200 flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                      <span>Table:</span>
                      <span className="font-mono text-[#006b2c] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">{activeTable}</span>
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Showing {filteredRows.length} of {tableData?.totalRows || 0} records
                    </p>
                  </div>
                </div>

                <div className="flex-1 overflow-auto p-4">
                  {loading ? (
                    <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-2">
                      <RefreshCw className="w-6 h-6 animate-spin text-[#006b2c]" />
                      <span className="text-xs">Loading table data...</span>
                    </div>
                  ) : filteredRows.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-2">
                      <Info className="w-8 h-8 text-slate-300" />
                      <span className="text-xs font-medium">No records found in {activeTable}</span>
                    </div>
                  ) : (
                    <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="bg-slate-100 border-b border-slate-200 text-slate-700 font-semibold">
                            <th className="p-3 w-10 text-center text-slate-400">#</th>
                            {tableData?.columns?.map((col) => (
                              <th key={col.COLUMN_NAME} className="p-3 font-mono text-slate-800 whitespace-nowrap">
                                {col.COLUMN_NAME}
                              </th>
                            ))}
                            <th className="p-3 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 font-sans">
                          {filteredRows.map((row, idx) => (
                            <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                              <td className="p-3 text-center text-slate-400 font-mono text-[11px]">{idx + 1}</td>
                              {tableData?.columns?.map((col) => {
                                const val = row[col.COLUMN_NAME];
                                return (
                                  <td key={col.COLUMN_NAME} className="p-3 max-w-xs truncate text-slate-700 font-mono text-[11px]">
                                    {val === null || val === undefined ? (
                                      <span className="italic text-slate-400">null</span>
                                    ) : typeof val === 'boolean' ? (
                                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${val ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                                        {String(val)}
                                      </span>
                                    ) : (
                                      String(val)
                                    )}
                                  </td>
                                );
                              })}
                              <td className="p-3 text-right">
                                <button
                                  onClick={() => copyRowJson(row, idx)}
                                  className="p-1.5 text-slate-500 hover:text-[#006b2c] hover:bg-emerald-50 rounded transition-colors"
                                  title="Copy Row JSON"
                                >
                                  {copiedRowIndex === idx ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 2: SQL WORKBENCH */}
            {activeTab === 'sql' && (
              <div className="flex-1 flex flex-col p-4 space-y-4 overflow-hidden">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-[#006b2c]" /> Live SQL Execution Workbench
                  </h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSqlQuery('SELECT * FROM users;')}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-xs font-mono"
                    >
                      SELECT users
                    </button>
                    <button
                      onClick={() => setSqlQuery('SELECT * FROM services;')}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-xs font-mono"
                    >
                      SELECT services
                    </button>
                    <button
                      onClick={() => setSqlQuery('SELECT * FROM flyway_schema_history;')}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-xs font-mono"
                    >
                      SELECT flyway
                    </button>
                  </div>
                </div>

                <div className="relative">
                  <textarea
                    rows={4}
                    value={sqlQuery}
                    onChange={(e) => setSqlQuery(e.target.value)}
                    placeholder="Enter SQL Query (e.g. SELECT * FROM users;)"
                    className="w-full p-3 font-mono text-xs bg-slate-900 text-emerald-400 rounded-xl border border-slate-700 focus:outline-none focus:ring-2 focus:ring-[#006b2c]"
                  />
                  <button
                    onClick={handleRunQuery}
                    disabled={executingQuery}
                    className="absolute right-3 bottom-4 px-4 py-2 bg-[#006b2c] hover:bg-[#005422] text-white text-xs font-bold rounded-lg flex items-center gap-1.5 shadow-md transition-all disabled:opacity-50"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    {executingQuery ? 'Running...' : 'Execute Query'}
                  </button>
                </div>

                {queryError && (
                  <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-mono">
                    ⚠️ Error: {queryError}
                  </div>
                )}

                {queryResult && (
                  <div className="flex-1 flex flex-col overflow-hidden border border-slate-200 rounded-xl">
                    <div className="p-3 bg-slate-100 border-b border-slate-200 text-xs font-semibold text-slate-700 flex justify-between">
                      <span>Query Results ({queryResult.rowCount ?? queryResult.affectedRows} rows)</span>
                      <span className="font-mono text-slate-500">{queryResult.executionTimeMs} ms</span>
                    </div>

                    <div className="flex-1 overflow-auto p-2">
                      {queryResult.headers && queryResult.headers.length > 0 ? (
                        <table className="w-full text-left text-xs border-collapse">
                          <thead>
                            <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-mono">
                              {queryResult.headers.map(h => (
                                <th key={h} className="p-2 font-bold">{h}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-200 font-mono text-[11px]">
                            {queryResult.rows.map((row, idx) => (
                              <tr key={idx} className="hover:bg-slate-50">
                                {queryResult.headers.map(h => (
                                  <td key={h} className="p-2 max-w-xs truncate">{String(row[h] ?? 'null')}</td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      ) : (
                        <div className="p-4 text-xs font-mono text-emerald-700 bg-emerald-50 rounded-lg">
                          {queryResult.message || 'Query executed successfully.'}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: SCHEMA VIEW */}
            {activeTab === 'schema' && (
              <div className="flex-1 p-6 overflow-y-auto">
                <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-[#006b2c]" /> Table Schema & Column Specifications
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {tables.map(t => (
                    <div key={t.name} className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 space-y-2">
                      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                        <span className="font-mono font-bold text-xs text-[#006b2c]">{t.name}</span>
                        <span className="text-[10px] bg-slate-200 px-2 py-0.5 rounded text-slate-700 font-mono">{t.type}</span>
                      </div>

                      <div className="space-y-1 font-mono text-[11px]">
                        {t.columns?.map(col => (
                          <div key={col.COLUMN_NAME} className="flex items-center justify-between text-slate-600">
                            <span>{col.COLUMN_NAME}</span>
                            <span className="text-slate-400 text-[10px]">{col.DATA_TYPE_NAME} ({col.IS_NULLABLE})</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}
