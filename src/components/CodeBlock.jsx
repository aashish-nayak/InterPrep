import React, { useState } from 'react';
import { Check, Copy, Play, Terminal } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatPhpCode } from '../lib/formatter';

/**
 * Tokenizes simple PHP code for syntax highlighting matching CodeWithAnimation
 */
function highlightCode(code, language = 'php') {
  if (!code) return '';

  const lines = code.split('\n');
  return lines.map((line, lineIdx) => {
    // Basic regex-based tokenizer for PHP/JS/SQL
    const tokenRegex = /(\/\/[^\n]*|\/\*[\s\S]*?\*\/|# [^\n]*)|(<\?php|\?>|\b(?:class|function|public|private|protected|static|return|new|if|else|elseif|foreach|for|while|switch|case|break|continue|extends|implements|namespace|use|trait|interface|abstract|final|throw|try|catch|finally|match|yield|enum|readonly|void|int|string|bool|float|array|object|mixed|true|false|null|SELECT|FROM|WHERE|JOIN|GROUP BY|ORDER BY|INSERT|UPDATE|DELETE)\b)|(\$[a-zA-Z_\x7f-\xff][a-zA-Z0-9_\x7f-\xff]*)|("[^"\\]*(?:\\.[^"\\]*)*"|'[^'\\]*(?:\\.[^'\\]*)*')|(\b\d+\b)|(->|::|=>|\+|-|\*|\/|=|==|===|!=|!==|<|>|<=|>=|&&|\|\||!|\?)/g;

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
          <span key={`${lineIdx}-${match.index}`} className="syntax-keyword">
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
  code,
  language = 'php',
  filename,
  questionId,
  showRunButton = false,
  className = '',
}) {
  const [copied, setCopied] = useState(false);
  const displayCode = language === 'php' ? formatPhpCode(code) : code;

  function handleCopy() {
    if (!displayCode) return;
    navigator.clipboard.writeText(displayCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const defaultFilename = filename || (language === 'php' ? 'example.php' : `${language}.code`);

  return (
    <div className={`rounded-2xl border border-hairline bg-surface-2 p-2.5 sm:p-3 shadow-raised ${className}`}>
      {/* Code window chrome: 3 colored dots & actions */}
      <div className="flex items-center justify-between px-2 pb-2.5 pt-0.5 text-xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5" aria-hidden="true">
            <span className="h-2.5 w-2.5 rounded-full bg-pink/70 transition-transform hover:scale-110" />
            <span className="h-2.5 w-2.5 rounded-full bg-sun transition-transform hover:scale-110" />
            <span className="h-2.5 w-2.5 rounded-full bg-teal/70 transition-transform hover:scale-110" />
          </div>

          <div className="inline-flex items-center gap-1.5 rounded-md border border-hairline bg-surface px-2.5 py-0.5 font-mono text-[11px] font-medium text-ink-mute shadow-2xs">
            <Terminal className="h-3 w-3 text-pink" />
            <span>{defaultFilename}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {showRunButton && questionId && (
            <Link
              to={`/code/${questionId}`}
              className="inline-flex items-center gap-1.5 rounded-md bg-pink/10 px-2.5 py-1 text-[11px] font-semibold text-pink transition-all hover:bg-pink hover:text-white active:scale-95 cursor-pointer"
            >
              <Play className="h-3 w-3 fill-current" />
              <span>Run in WASM</span>
            </Link>
          )}

          <button
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
        </div>
      </div>

      {/* Code viewport */}
      <div className="overflow-x-auto rounded-xl border border-hairline bg-surface p-4 text-left shadow-2xs">
        <div className="table min-w-full font-mono">{highlightCode(displayCode, language)}</div>
      </div>
    </div>
  );
}
