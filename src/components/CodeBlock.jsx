import React, { useState, useEffect, useRef } from 'react';
import { Check, Copy, Play, Terminal, RotateCcw, Pencil, Eye, Table, Loader2, X } from 'lucide-react';
import { formatPhpCode } from '../lib/formatter';
import { executeSql } from '../lib/sqlEngine';
import { cn } from '../lib/utils';

/**
 * Tokenizes simple PHP/SQL code for syntax highlighting matching CodeWithAnimation
 */
function highlightCode(code, language = 'php') {
  if (!code) return '';

  const lines = code.split('\n');
  return lines.map((line, lineIdx) => {
    // Basic regex-based tokenizer for PHP/JS/SQL
    const tokenRegex = /(\/\/[^\n]*|\/\*[\s\S]*?\*\/|# [^\n]*)|(<\?php|\?>|\b(?:class|function|public|private|protected|static|return|new|if|else|elseif|foreach|for|while|switch|case|break|continue|extends|implements|namespace|use|trait|interface|abstract|final|throw|try|catch|finally|match|yield|enum|readonly|void|int|string|bool|float|array|object|mixed|true|false|null|SELECT|FROM|WHERE|JOIN|LEFT JOIN|INNER JOIN|GROUP BY|ORDER BY|HAVING|INSERT|UPDATE|DELETE|LIMIT|OFFSET|COUNT|AVG|SUM|MAX|MIN|ROUND|COALESCE|DISTINCT|AS|ON|AND|OR|DESC|ASC)\b)|(\$[a-zA-Z_\x7f-\xff][a-zA-Z0-9_\x7f-\xff]*)|("[^"\\]*(?:\\.[^"\\]*)*"|'[^'\\]*(?:\\.[^'\\]*)*')|(\b\d+\b)|(->|::|=>|\+|-|\*|\/|=|==|===|!=|!==|<|>|<=|>=|&&|\|\||!|\?)/g;

    let lastIndex = 0;
    const elements = [];
    let match;

    while ((match = tokenRegex.exec(line)) !== null) {
      if (match.index > lastIndex) {
        elements.push(line.slice(lastIndex, match.index));
      }

      const [full, comment, keyword, variable, str, num, operator] = match;

      if (comment) {
        elements.push(
          <span key={`${lineIdx}-${match.index}`} className="syntax-comment">
            {comment}
          </span>
        );
      } else if (keyword) {
        elements.push(
          <span key={`${lineIdx}-${match.index}`} className="syntax-keyword font-semibold">
            {keyword}
          </span>
        );
      } else if (variable) {
        elements.push(
          <span key={`${lineIdx}-${match.index}`} className="syntax-variable">
            {variable}
          </span>
        );
      } else if (str) {
        elements.push(
          <span key={`${lineIdx}-${match.index}`} className="syntax-string">
            {str}
          </span>
        );
      } else if (num) {
        elements.push(
          <span key={`${lineIdx}-${match.index}`} className="syntax-number">
            {num}
          </span>
        );
      } else if (operator) {
        elements.push(
          <span key={`${lineIdx}-${match.index}`} className="text-pink/80 dark:text-pink font-semibold">
            {operator}
          </span>
        );
      }

      lastIndex = tokenRegex.lastIndex;
    }

    if (lastIndex < line.length) {
      elements.push(line.slice(lastIndex));
    }

    return (
      <div key={lineIdx} className="table-row leading-[1.85]">
        <span className="table-cell select-none pr-4 text-right font-mono text-[12px] text-ink-mute/40 w-8">
          {lineIdx + 1}
        </span>
        <span className="table-cell whitespace-pre font-mono text-[13px] text-ink">
          {elements.length > 0 ? elements : '\n'}
        </span>
      </div>
    );
  });
}

export default function CodeBlock({
  code: initialCode,
  language = 'php',
  filename,
  questionId,
  category,
  className = '',
}) {
  const formattedInitial = language === 'php' ? formatPhpCode(initialCode) : initialCode;
  const [currentCode, setCurrentCode] = useState(formattedInitial || '');
  const [isEditing, setIsEditing] = useState(false);
  const [copied, setCopied] = useState(false);

  // Execution state
  const [execState, setExecState] = useState('idle'); // 'idle' | 'running' | 'done' | 'error'
  const [output, setOutput] = useState('');
  const [sqlResult, setSqlResult] = useState(null);
  const [execLatency, setExecLatency] = useState(null);

  const workerRef = useRef(null);
  const timeoutRef = useRef(null);
  const textareaRef = useRef(null);
  const lineNumbersRef = useRef(null);

  // Synchronize when question or code prop changes
  useEffect(() => {
    const formatted = language === 'php' ? formatPhpCode(initialCode) : initialCode;
    setCurrentCode(formatted || '');
    setExecState('idle');
    setOutput('');
    setSqlResult(null);
    setExecLatency(null);
    setIsEditing(false);
  }, [initialCode, language]);

  const cleanupWorker = () => {
    if (workerRef.current) {
      workerRef.current.terminate();
      workerRef.current = null;
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  useEffect(() => {
    return () => cleanupWorker();
  }, []);

  const isSql = language === 'sql' || category === 'sql';
  const isRunnable = isSql || language === 'php' || category === 'php' || category === 'oop' || category === 'coding' || category === 'patterns';
  const isModified = currentCode !== formattedInitial;

  function handleCopy() {
    if (!currentCode) return;
    navigator.clipboard.writeText(currentCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleReset() {
    setCurrentCode(formattedInitial || '');
    setExecState('idle');
    setOutput('');
    setSqlResult(null);
    setExecLatency(null);
  }

  function handleRun() {
    if (isSql) {
      runSql();
    } else {
      runPhp();
    }
  }

  function runSql() {
    setExecState('running');
    setOutput('');
    setSqlResult(null);

    const startTime = performance.now();
    try {
      const result = executeSql(currentCode);
      const latency = Number((performance.now() - startTime).toFixed(1));
      setExecLatency(latency);
      setSqlResult(result);
      if (result.error) {
        setExecState('error');
        setOutput(result.error);
      } else {
        setExecState('done');
      }
    } catch (err) {
      setExecState('error');
      setOutput(err?.message || 'Error executing SQL query.');
      setExecLatency(Number((performance.now() - startTime).toFixed(1)));
    }
  }

  function runPhp() {
    cleanupWorker();
    setExecState('running');
    setOutput('');
    setSqlResult(null);

    const startTime = performance.now();

    try {
      const instance = new Worker(new URL('../php-worker.js', import.meta.url), { type: 'module' });
      workerRef.current = instance;

      timeoutRef.current = setTimeout(() => {
        cleanupWorker();
        setExecState('error');
        setOutput('Execution stopped after 15 seconds. Check for an infinite loop, or retry if WebAssembly runtime was initializing.');
      }, 15000);

      instance.onmessage = ({ data }) => {
        if (workerRef.current !== instance) return;
        if (data.type === 'running') {
          return;
        }
        clearTimeout(timeoutRef.current);
        const latency = Number((performance.now() - startTime).toFixed(1));
        setExecLatency(latency);
        setOutput(data.output || '(Execution finished with no output)');
        setExecState(data.type === 'error' ? 'error' : 'done');
        cleanupWorker();
      };

      instance.onerror = (err) => {
        if (workerRef.current !== instance) return;
        clearTimeout(timeoutRef.current);
        cleanupWorker();
        setExecState('error');
        setOutput('The PHP WebAssembly runtime could not execute this snippet: ' + (err?.message || 'sandbox error.'));
      };

      instance.postMessage({ code: currentCode, trace: false });
    } catch (err) {
      setExecState('error');
      setOutput('Failed to launch PHP WebAssembly worker: ' + (err?.message || 'unknown error.'));
    }
  }

  function handleKeyDown(e) {
    // Ctrl+Enter or Cmd+Enter to run
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      handleRun();
      return;
    }

    // Tab key indents by 2 spaces
    if (e.key === 'Tab') {
      e.preventDefault();
      const target = e.currentTarget;
      const start = target.selectionStart;
      const end = target.selectionEnd;
      const nextValue = currentCode.substring(0, start) + '  ' + currentCode.substring(end);
      setCurrentCode(nextValue);
      setTimeout(() => {
        target.selectionStart = target.selectionEnd = start + 2;
      }, 0);
    }
  }

  const defaultFilename = filename || (isSql ? 'query.sql' : language === 'php' ? 'example.php' : `${language}.code`);
  const lines = currentCode.split('\n');
  const lineCount = Math.max(lines.length, 1);

  return (
    <div className={cn("rounded-2xl border border-hairline bg-surface-2 p-2.5 sm:p-3 shadow-raised transition-all", className)}>
      {/* Code window chrome header */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-2 pb-2.5 pt-0.5 text-xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5" aria-hidden="true">
            <span className="h-2.5 w-2.5 rounded-full bg-pink/70 transition-transform hover:scale-110" />
            <span className="h-2.5 w-2.5 rounded-full bg-sun transition-transform hover:scale-110" />
            <span className="h-2.5 w-2.5 rounded-full bg-teal/70 transition-transform hover:scale-110" />
          </div>

          <div className="inline-flex items-center gap-1.5 rounded-md border border-hairline bg-surface px-2.5 py-0.5 font-mono text-[11px] font-medium text-ink-mute shadow-2xs">
            {isSql ? (
              <Table className="h-3 w-3 text-pink" />
            ) : (
              <Terminal className="h-3 w-3 text-pink" />
            )}
            <span>{defaultFilename}</span>
          </div>

          {isModified && (
            <span className="text-[10px] text-pink bg-pink/10 px-2 py-0.5 rounded font-mono">
              Edited
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          {/* Edit / View Toggle */}
          <button
            type="button"
            onClick={() => setIsEditing(!isEditing)}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-[11px] font-medium transition-all cursor-pointer shadow-2xs",
              isEditing
                ? "border-pink/40 bg-pink/10 text-pink font-semibold"
                : "border-hairline bg-surface text-ink-soft hover:bg-surface-2 hover:text-ink"
            )}
            title={isEditing ? "Switch to formatted preview" : "Edit this code snippet"}
          >
            {isEditing ? (
              <>
                <Eye className="h-3 w-3" />
                <span>Preview</span>
              </>
            ) : (
              <>
                <Pencil className="h-3 w-3" />
                <span>Edit Code</span>
              </>
            )}
          </button>

          {/* Reset button if edited */}
          {isModified && (
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1 rounded-md border border-hairline bg-surface px-2 py-1 text-[11px] font-medium text-ink-mute hover:text-ink hover:bg-surface-2 cursor-pointer shadow-2xs transition-colors"
              title="Reset code to original snippet"
              aria-label="Reset code"
            >
              <RotateCcw className="h-3 w-3" />
              <span>Reset</span>
            </button>
          )}

          {/* Copy button */}
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-1 rounded-md border border-hairline bg-surface px-2 py-1 text-[11px] font-medium text-ink-soft transition-colors hover:bg-surface-2 hover:text-ink cursor-pointer shadow-2xs"
            title="Copy code"
            aria-label="Copy code to clipboard"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-teal" />
                <span className="text-teal font-semibold">Copied</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5 text-ink-mute" />
                <span>Copy</span>
              </>
            )}
          </button>

          {/* Primary In-Place Run Button */}
          {isRunnable && (
            <button
              type="button"
              onClick={handleRun}
              disabled={execState === 'running'}
              className="inline-flex items-center gap-1.5 rounded-md bg-pink text-white px-3 py-1 text-[11px] font-semibold transition-all hover:bg-pink-press active:scale-95 cursor-pointer shadow-xs disabled:opacity-50"
              title="Run code in-place (Ctrl+Enter)"
            >
              {execState === 'running' ? (
                <>
                  <Loader2 className="h-3 w-3 animate-spin" />
                  <span>Running…</span>
                </>
              ) : (
                <>
                  <Play className="h-3 w-3 fill-current" />
                  <span>Run Code</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Code Editor / Viewport */}
      <div className="overflow-hidden rounded-xl border border-hairline bg-surface text-left shadow-2xs">
        {isEditing ? (
          <div className="flex font-mono text-[13px] leading-[1.85] bg-surface relative">
            {/* Line numbers synced to textarea */}
            <div
              ref={lineNumbersRef}
              className="select-none py-3 pl-3 pr-3 text-right text-ink-mute/40 border-r border-hairline bg-surface-2/40 w-11 shrink-0 overflow-hidden font-mono text-[12px]"
              aria-hidden="true"
            >
              {Array.from({ length: lineCount }).map((_, idx) => (
                <div key={idx} className="leading-[1.85]">
                  {idx + 1}
                </div>
              ))}
            </div>

            {/* Editable code textarea */}
            <textarea
              ref={textareaRef}
              value={currentCode}
              onChange={(e) => setCurrentCode(e.target.value)}
              onKeyDown={handleKeyDown}
              onScroll={() => {
                if (lineNumbersRef.current && textareaRef.current) {
                  lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop;
                }
              }}
              spellCheck="false"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              rows={Math.max(5, Math.min(22, lineCount))}
              className="flex-1 w-full p-3 font-mono text-[13px] text-ink leading-[1.85] bg-transparent outline-none resize-y border-none whitespace-pre focus:ring-0"
              placeholder={isSql ? "Enter SQL query..." : "Enter PHP code..."}
            />
          </div>
        ) : (
          <div
            onClick={() => setIsEditing(true)}
            title="Click to edit code"
            className="overflow-x-auto p-4 cursor-text"
          >
            <div className="table min-w-full font-mono">
              {highlightCode(currentCode, isSql ? 'sql' : language)}
            </div>
          </div>
        )}
      </div>

      {/* Output Terminal / SQL Table Panel */}
      {execState !== 'idle' && (
        <div className="mt-3 rounded-xl border border-hairline bg-surface overflow-hidden shadow-2xs animate-in fade-in slide-in-from-top-1 duration-200">
          <div className="flex items-center justify-between px-3 py-2 border-b border-hairline bg-surface-2 text-xs font-mono">
            <div className="flex items-center gap-2">
              {isSql ? (
                <Table className="h-3.5 w-3.5 text-pink" />
              ) : (
                <Terminal className="h-3.5 w-3.5 text-pink" />
              )}
              <span className="font-semibold text-ink">
                {isSql ? 'Query Results' : 'Terminal Output'}
              </span>

              {execState === 'running' && (
                <span className="inline-flex items-center gap-1 text-[11px] text-pink font-sans">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  <span>Executing in sandbox…</span>
                </span>
              )}

              {execState === 'done' && (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.2 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                  <Check className="h-2.5 w-2.5" />
                  {isSql ? `${sqlResult?.rowCount ?? 0} rows returned` : 'Exit 0'}
                </span>
              )}

              {execState === 'error' && (
                <span className="inline-flex items-center gap-1 rounded-full bg-destructive/10 px-2 py-0.2 text-[10px] font-semibold text-destructive">
                  Error
                </span>
              )}

              {execLatency !== null && (
                <span className="text-[10px] text-ink-mute font-mono">
                  ({execLatency}ms)
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={() => setExecState('idle')}
              className="p-1 text-ink-mute hover:text-ink rounded hover:bg-surface cursor-pointer"
              title="Close output"
              aria-label="Close output"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="p-3">
            {isSql && sqlResult ? (
              sqlResult.error ? (
                <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-xs font-mono leading-relaxed">
                  {sqlResult.error}
                </div>
              ) : sqlResult.rows?.length > 0 ? (
                <div className="overflow-x-auto max-h-[300px] rounded-lg border border-hairline bg-surface-2/40">
                  <table className="w-full text-left text-xs font-mono border-collapse">
                    <thead className="bg-surface-2 sticky top-0 border-b border-hairline">
                      <tr>
                        {sqlResult.columns.map((col) => (
                          <th key={col} className="p-2.5 text-ink-mute font-semibold whitespace-nowrap">
                            {col}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-hairline">
                      {sqlResult.rows.map((row, rIdx) => (
                        <tr key={rIdx} className="hover:bg-surface/80 transition-colors">
                          {sqlResult.columns.map((col) => (
                            <td key={col} className="p-2.5 text-ink whitespace-nowrap font-mono text-[11px]">
                              {row[col] === null ? (
                                <span className="text-ink-mute italic">NULL</span>
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
                <div className="p-4 text-center text-xs text-ink-mute font-mono">
                  Empty result set (0 rows matched query).
                </div>
              )
            ) : (
              <pre className="font-mono text-xs leading-relaxed text-ink bg-surface-2/50 p-3 rounded-lg border border-hairline overflow-x-auto whitespace-pre-wrap max-h-[300px]">
                {output || (execState === 'running' ? 'Running in WebAssembly sandbox…' : '(Execution finished with no output)')}
              </pre>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
