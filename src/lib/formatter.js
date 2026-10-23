/**
 * PHP Code Formatter & Indenter
 * Corrects and formats PHP code with 4-space indentation hierarchy.
 */

export function formatPhpCode(source) {
  if (!source || typeof source !== 'string') return '';

  // Replace carriage returns and normalize tabs to 4 spaces
  const cleanSource = source.replace(/\r\n/g, '\n').replace(/\t/g, '    ');
  const lines = cleanSource.split('\n');

  let indentLevel = 0;
  const result = [];

  for (let raw of lines) {
    const trimmed = raw.trim();

    // Preserve empty lines
    if (!trimmed) {
      result.push('');
      continue;
    }

    // Preserve comments as-is with current indent
    if (trimmed.startsWith('//') || trimmed.startsWith('#')) {
      result.push('    '.repeat(indentLevel) + trimmed);
      continue;
    }

    // Count how many closing braces/brackets appear at the start of this line
    // e.g. "}", "} else {", "} elseif", "];", "};"
    let leadingCloses = 0;
    const startCloseMatch = trimmed.match(/^([\}\]\)]+)/);
    if (startCloseMatch) {
      leadingCloses = startCloseMatch[1].length;
    } else if (
      trimmed.startsWith('} else') ||
      trimmed.startsWith('} elseif') ||
      trimmed.startsWith('} catch') ||
      trimmed.startsWith('} finally')
    ) {
      leadingCloses = 1;
    }

    // Current line indent is based on level minus leading closing braces
    const currentIndent = Math.max(0, indentLevel - leadingCloses);
    result.push('    '.repeat(currentIndent) + trimmed);

    // Compute net brace change across the line (excluding strings & comments)
    let opens = 0;
    let closes = 0;
    let inString = false;
    let stringChar = '';

    for (let i = 0; i < trimmed.length; i++) {
      const char = trimmed[i];
      const prev = i > 0 ? trimmed[i - 1] : '';

      // Ignore single line comments
      if (!inString && char === '/' && trimmed[i + 1] === '/') {
        break;
      }

      // Track strings
      if ((char === '"' || char === "'") && prev !== '\\') {
        if (!inString) {
          inString = true;
          stringChar = char;
        } else if (stringChar === char) {
          inString = false;
        }
        continue;
      }

      if (!inString) {
        if (char === '{' || char === '[' || char === '(') {
          // Only increase indent for braces { and multi-line array [
          if (char === '{') opens++;
        } else if (char === '}' || char === ']' || char === ')') {
          if (char === '}') closes++;
        }
      }
    }

    indentLevel = Math.max(0, indentLevel + opens - closes);
  }

  return result.join('\n');
}
