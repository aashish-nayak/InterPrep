import React, { useState } from 'react';
import { Database, Play, RotateCcw, Sparkles, Terminal, CheckCircle2, AlertCircle, Clock, Table as TableIcon, HelpCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { GlowCard } from './lightwind/glow-card';
import { executeSql, SQL_INTERVIEW_PRESETS, INITIAL_DATABASE } from '../lib/sqlEngine';
import { cn } from '../lib/utils';

export default function SqlPlayground() {
  const [selectedPresetIndex, setSelectedPresetIndex] = useState(0);
  const [sql, setSql] = useState(SQL_INTERVIEW_PRESETS[0].sql);
  const [result, setResult] = useState(() => executeSql(SQL_INTERVIEW_PRESETS[0].sql));
  const [activeSchemaTable, setActiveSchemaTable] = useState('employees');

  const handleRun = (queryToRun = sql) => {
    const res = executeSql(queryToRun);
    setResult(res);
  };

  const handleSelectPreset = (idx) => {
    setSelectedPresetIndex(idx);
    const chosen = SQL_INTERVIEW_PRESETS[idx];
    setSql(chosen.sql);
    handleRun(chosen.sql);
  };

  const handleExplain = () => {
    const explainQuery = `EXPLAIN ${sql}`;
    handleRun(explainQuery);
  };

  const handleReset = () => {
    setSql(SQL_INTERVIEW_PRESETS[selectedPresetIndex].sql);
    handleRun(SQL_INTERVIEW_PRESETS[selectedPresetIndex].sql);
  };

  return (
    <div className="space-y-6">
      {/* Header & Preset Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-hairline bg-card/60 backdrop-blur-sm">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-primary uppercase tracking-wider mb-1">
            <Database className="h-3.5 w-3.5" />
            <span>In-Browser Relational Engine</span>
            <span>•</span>
            <span>Live SQL Sandbox</span>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-foreground">
            Interview SQL Playground
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Test JOINs, Aggregations, GROUP BY, and EXPLAIN query execution plans directly in the browser.
          </p>
        </div>

        {/* Preset Picker */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-medium text-muted-foreground whitespace-nowrap">
            Interview Challenge:
          </label>
          <select
            value={selectedPresetIndex}
            onChange={(e) => handleSelectPreset(Number(e.target.value))}
            className="text-xs bg-bg border border-hairline rounded-lg px-3 py-1.5 font-medium text-foreground focus:outline-none focus:ring-1 focus:ring-primary max-w-[220px] truncate"
          >
            {SQL_INTERVIEW_PRESETS.map((p, idx) => (
              <option key={idx} value={idx}>
                {p.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Challenge Description Alert */}
      <div className="p-3.5 rounded-lg border border-primary/20 bg-primary/5 flex items-start gap-3 text-xs">
        <Sparkles className="h-4 w-4 text-primary shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-foreground">Goal: </span>
          <span className="text-muted-foreground">{SQL_INTERVIEW_PRESETS[selectedPresetIndex].description}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: SQL Editor & Schema Inspector (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="rounded-xl border border-hairline bg-card overflow-hidden shadow-sm">
            {/* Editor Top Bar */}
            <div className="px-4 py-2.5 bg-muted/40 border-b border-hairline flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Terminal className="h-4 w-4 text-primary" />
                <span className="text-xs font-mono font-medium text-foreground">query.sql</span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleExplain}
                  className="h-7 text-xs text-muted-foreground hover:text-foreground"
                >
                  EXPLAIN Plan
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleReset}
                  className="h-7 text-xs text-muted-foreground hover:text-foreground"
                >
                  <RotateCcw className="h-3 w-3 mr-1" />
                  Reset
                </Button>
                <Button
                  size="sm"
                  onClick={() => handleRun()}
                  className="h-7 text-xs px-3 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
                >
                  <Play className="h-3 w-3 mr-1 fill-current" />
                  Run SQL
                </Button>
              </div>
            </div>

            {/* Editor Area */}
            <div className="relative">
              <textarea
                value={sql}
                onChange={(e) => setSql(e.target.value)}
                placeholder="Write standard SQL query (SELECT, FROM, JOIN, WHERE...)"
                rows={8}
                className="w-full p-4 font-mono text-xs md:text-sm bg-bg text-foreground resize-y focus:outline-none"
                spellCheck={false}
              />
            </div>
          </div>

          {/* Database Schema Viewer */}
          <div className="rounded-xl border border-hairline bg-card/60 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
                <TableIcon className="h-3.5 w-3.5 text-primary" />
                <span>Preloaded Database Tables</span>
              </div>
              {/* Table Selector Tabs */}
              <div className="flex gap-1">
                {Object.keys(INITIAL_DATABASE).map(tbl => (
                  <button
                    key={tbl}
                    onClick={() => setActiveSchemaTable(tbl)}
                    className={cn(
                      "text-[11px] font-mono px-2 py-0.5 rounded transition-colors",
                      activeSchemaTable === tbl
                        ? "bg-primary text-primary-foreground font-semibold"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    )}
                  >
                    {tbl} ({INITIAL_DATABASE[tbl].length})
                  </button>
                ))}
              </div>
            </div>

            {/* Schema preview columns */}
            <div className="text-[11px] font-mono text-muted-foreground bg-bg/80 p-2.5 rounded-lg border border-hairline overflow-x-auto">
              <div className="flex flex-wrap gap-2">
                {Object.keys(INITIAL_DATABASE[activeSchemaTable][0] || {}).map(col => (
                  <span key={col} className="bg-muted px-2 py-0.5 rounded border border-hairline text-foreground">
                    {col}: <span className="text-primary">{typeof INITIAL_DATABASE[activeSchemaTable][0][col]}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Execution Output Grid (5 cols) */}
        <div className="lg:col-span-5 flex flex-col">
          <div className="rounded-xl border border-hairline bg-card overflow-hidden shadow-sm flex flex-col flex-1 min-h-[380px]">
            {/* Output Header */}
            <div className="px-4 py-2.5 bg-muted/40 border-b border-hairline flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-foreground">Query Result</span>
                {result.isExplain && (
                  <Badge variant="outline" className="text-[10px] text-amber-500 border-amber-500/30">
                    EXPLAIN Execution Plan
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-2 text-[11px] text-muted-foreground font-mono">
                <Clock className="h-3 w-3" />
                <span>{result.latencyMs}ms</span>
                <span>•</span>
                <span>{result.rows?.length || 0} rows</span>
              </div>
            </div>

            {/* Results Grid or Error */}
            <div className="p-4 flex-1 flex flex-col justify-start overflow-auto">
              {result.error ? (
                <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-xs flex items-start gap-2.5">
                  <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold">SQL Execution Error</div>
                    <div className="mt-1 font-mono text-[11px]">{result.error}</div>
                  </div>
                </div>
              ) : result.rows && result.rows.length > 0 ? (
                <div className="overflow-x-auto border border-hairline rounded-lg">
                  <table className="w-full text-left text-xs font-mono">
                    <thead className="bg-muted/60 text-muted-foreground border-b border-hairline text-[11px]">
                      <tr>
                        {result.columns.map((col, idx) => (
                          <th key={idx} className="px-3 py-2 font-semibold">
                            {col}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-hairline">
                      {result.rows.map((row, rIdx) => (
                        <tr key={rIdx} className="hover:bg-muted/30 transition-colors">
                          {result.columns.map((col, cIdx) => (
                            <td key={cIdx} className="px-3 py-2 whitespace-nowrap text-foreground">
                              {row[col] === null ? (
                                <span className="text-muted-foreground italic text-[10px]">NULL</span>
                              ) : typeof row[col] === 'number' ? (
                                <span className="text-primary font-medium">{row[col].toLocaleString()}</span>
                              ) : (
                                String(row[col])
                              )}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-muted-foreground text-xs">
                  <CheckCircle2 className="h-6 w-6 text-emerald-500 mb-2 opacity-80" />
                  <p>Query executed successfully with 0 rows returned.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
