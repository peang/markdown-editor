/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Escapes HTML characters to prevent XSS and rendering issues
 */
export function escapeHtml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Simple, ultra-fast language keyword-based syntax highlighter.
 * No heavy external libraries, fully offline, highly optimized for performance on old hardware.
 */
export function highlightCode(code: string, language: string): string {
  const lang = (language || '').toLowerCase().trim();
  const escaped = escapeHtml(code);

  if (!lang || lang === 'text' || lang === 'plain') {
    return escaped;
  }

  // Helper for wrapping matched text in visual tokens
  const wrap = (className: string, text: string) => `<span class="${className}">${text}</span>`;

  try {
    if (lang === 'javascript' || lang === 'typescript' || lang === 'js' || lang === 'ts' || lang === 'jsx' || lang === 'tsx') {
      let html = escaped;

      // Group 1: Comments (single line and multi line)
      // Since we escaped HTML, we need to match carefully.
      // We will tokenize or use simple regex replacements.
      // However, regex replacement on HTML can be tricky. A token-based scanner or phased regex replacement is cleaner:
      
      const tokens: { placeholder: string; value: string }[] = [];
      let tokenIdx = 0;
      const pushToken = (className: string, text: string) => {
        const id = `___HL_TOKEN_${tokenIdx++}___`;
        tokens.push({ placeholder: id, value: wrap(className, text) });
        return id;
      };

      // 1. Hide string literals to avoid highlighting keywords inside them
      html = html.replace(/(&quot;[\s\S]*?&quot;|&#039;[\s\S]*?&#039;|`[\s\S]*?`)/g, (match) => {
        return pushToken('hl-string', match);
      });

      // 2. Hide comments (multi-line and single-line)
      html = html.replace(/(\/\*[\s\S]*?\*\/|\/\/.*)/g, (match) => {
        return pushToken('hl-comment', match);
      });

      // 3. Highlight numbers
      html = html.replace(/\b(\d+(?:\.\d+)?)\b/g, (match) => {
        return pushToken('hl-number', match);
      });

      // 4. Highlight functions
      html = html.replace(/\b([a-zA-Z_]\w*)(?=\s*\()/g, (match) => {
        return pushToken('hl-function', match);
      });

      // 5. Highlight keywords
      const keywords = /\b(const|let|var|function|return|import|export|from|class|extends|new|if|else|for|while|do|switch|case|break|default|async|await|yield|try|catch|finally|throw|error|true|false|null|undefined|this|typeof|instanceof|interface|type|public|private|protected|readonly|any|string|number|boolean|void|unknown|never)\b/g;
      html = html.replace(keywords, (match) => {
        return wrap('hl-keyword', match);
      });

      // 6. Highlight operators and structural elements
      html = html.replace(/(=&gt;|&lt;=|&gt;=|===|!==|==|!=|\+|-|\*|\/|%|&amp;&amp;|\|\||!|\?|:)/g, (match) => {
        return wrap('hl-operator', match);
      });

      // Restore hidden tokens in reverse order
      for (let i = tokens.length - 1; i >= 0; i--) {
        html = html.replace(tokens[i].placeholder, tokens[i].value);
      }

      return html;
    }

    if (lang === 'html' || lang === 'xml' || lang === 'svg') {
      let html = escaped;
      const tokens: { placeholder: string; value: string }[] = [];
      let tokenIdx = 0;
      const pushToken = (className: string, text: string) => {
        const id = `___HL_TOKEN_${tokenIdx++}___`;
        tokens.push({ placeholder: id, value: wrap(className, text) });
        return id;
      };

      // Hide comments
      html = html.replace(/(&lt;!--[\s\S]*?--&gt;)/g, (match) => {
        return pushToken('hl-comment', match);
      });

      // Hide strings within attributes
      html = html.replace(/(&quot;[\s\S]*?&quot;|&#039;[\s\S]*?&#039;)/g, (match) => {
        return pushToken('hl-string', match);
      });

      // Tags and Tag Names
      // Match &lt;tag or &lt;/tag or tag&gt; or /&gt;
      html = html.replace(/(&lt;\/?[a-zA-Z0-9:-]+|&gt;|\/&gt;)/g, (match) => {
        if (match.startsWith('&lt;')) {
          const tagName = match.substring(4);
          return wrap('hl-operator', '&lt;') + wrap('hl-keyword', tagName);
        }
        return wrap('hl-operator', match);
      });

      // Attributes
      html = html.replace(/\b([a-zA-Z0-9:-]+)(?=\s*=)/g, (match) => {
        return wrap('hl-key', match);
      });

      // Restore tokens
      for (let i = tokens.length - 1; i >= 0; i--) {
        html = html.replace(tokens[i].placeholder, tokens[i].value);
      }

      return html;
    }

    if (lang === 'css') {
      let html = escaped;
      const tokens: { placeholder: string; value: string }[] = [];
      let tokenIdx = 0;
      const pushToken = (className: string, text: string) => {
        const id = `___HL_TOKEN_${tokenIdx++}___`;
        tokens.push({ placeholder: id, value: wrap(className, text) });
        return id;
      };

      // Hide comments
      html = html.replace(/(\/\*[\s\S]*?\*\/)/g, (match) => {
        return pushToken('hl-comment', match);
      });

      // Hide string values
      html = html.replace(/(&quot;[\s\S]*?&quot;|&#039;[\s\S]*?&#039;)/g, (match) => {
        return pushToken('hl-string', match);
      });

      // CSS properties
      html = html.replace(/\b([a-zA-Z-]+)(?=\s*:)/g, (match) => {
        return wrap('hl-key', match);
      });

      // CSS numbers and units
      html = html.replace(/\b(\d+(?:px|em|rem|%|vh|vw|s|ms|deg)?)\b/g, (match) => {
        return wrap('hl-number', match);
      });

      // CSS selectors and structures
      html = html.replace(/([{}():;,])/g, (match) => {
        return wrap('hl-operator', match);
      });

      // Restore tokens
      for (let i = tokens.length - 1; i >= 0; i--) {
        html = html.replace(tokens[i].placeholder, tokens[i].value);
      }

      return html;
    }

    if (lang === 'python' || lang === 'py') {
      let html = escaped;
      const tokens: { placeholder: string; value: string }[] = [];
      let tokenIdx = 0;
      const pushToken = (className: string, text: string) => {
        const id = `___HL_TOKEN_${tokenIdx++}___`;
        tokens.push({ placeholder: id, value: wrap(className, text) });
        return id;
      };

      // Strings (triple quotes first, then double, then single)
      html = html.replace(/(&quot;&quot;&quot;[\s\S]*?&quot;&quot;&quot;|&#039;&#039;&#039;[\s\S]*?&#039;&#039;&#039;|&quot;[\s\S]*?&quot;|&#039;[\s\S]*?&#039;)/g, (match) => {
        return pushToken('hl-string', match);
      });

      // Comments
      html = html.replace(/(#.*)/g, (match) => {
        return pushToken('hl-comment', match);
      });

      // Numbers
      html = html.replace(/\b(\d+(?:\.\d+)?)\b/g, (match) => {
        return pushToken('hl-number', match);
      });

      // Decorators
      html = html.replace(/(@[a-zA-Z_]\w*)/g, (match) => {
        return pushToken('hl-key', match);
      });

      // Functions definition or calls
      html = html.replace(/\b([a-zA-Z_]\w*)(?=\s*\()/g, (match) => {
        return pushToken('hl-function', match);
      });

      // Keywords
      const pyKeywords = /\b(def|class|return|if|elif|else|for|while|import|from|as|in|is|and|or|not|lambda|try|except|finally|with|assert|pass|break|continue|global|nonlocal|self|yield|del|None|True|False)\b/g;
      html = html.replace(pyKeywords, (match) => {
        return wrap('hl-keyword', match);
      });

      // Restore tokens
      for (let i = tokens.length - 1; i >= 0; i--) {
        html = html.replace(tokens[i].placeholder, tokens[i].value);
      }

      return html;
    }

    if (lang === 'json') {
      let html = escaped;
      const tokens: { placeholder: string; value: string }[] = [];
      let tokenIdx = 0;
      const pushToken = (className: string, text: string) => {
        const id = `___HL_TOKEN_${tokenIdx++}___`;
        tokens.push({ placeholder: id, value: wrap(className, text) });
        return id;
      };

      // JSON Keys
      html = html.replace(/(&quot;[^&]+&quot;)(?=\s*:)/g, (match) => {
        return pushToken('hl-key', match);
      });

      // JSON String values
      html = html.replace(/(&quot;[^&]*&quot;)/g, (match) => {
        return pushToken('hl-string', match);
      });

      // JSON Numbers
      html = html.replace(/\b(-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)\b/g, (match) => {
        return wrap('hl-number', match);
      });

      // JSON constants
      html = html.replace(/\b(true|false|null)\b/g, (match) => {
        return wrap('hl-keyword', match);
      });

      // Restore tokens
      for (let i = tokens.length - 1; i >= 0; i--) {
        html = html.replace(tokens[i].placeholder, tokens[i].value);
      }

      return html;
    }

    if (lang === 'sql') {
      let html = escaped;
      const tokens: { placeholder: string; value: string }[] = [];
      let tokenIdx = 0;
      const pushToken = (className: string, text: string) => {
        const id = `___HL_TOKEN_${tokenIdx++}___`;
        tokens.push({ placeholder: id, value: wrap(className, text) });
        return id;
      };

      // Comments
      html = html.replace(/(--.*|\/\*[\s\S]*?\*\/)/g, (match) => {
        return pushToken('hl-comment', match);
      });

      // Strings
      html = html.replace(/(&#039;[\s\S]*?&#039;)/g, (match) => {
        return pushToken('hl-string', match);
      });

      // Numbers
      html = html.replace(/\b(\d+(?:\.\d+)?)\b/g, (match) => {
        return wrap('hl-number', match);
      });

      // SQL Keywords
      const sqlKeywords = /\b(SELECT|INSERT|UPDATE|DELETE|FROM|WHERE|JOIN|LEFT|RIGHT|INNER|OUTER|ON|GROUP\s+BY|ORDER\s+BY|HAVING|LIMIT|AND|OR|NOT|IN|LIKE|IS|NULL|CREATE|TABLE|ALTER|DROP|PRIMARY|KEY|FOREIGN|REFERENCES|INDEX|INTO|VALUES|SET|AS|WITH|DISTINCT|COUNT|SUM|AVG|MIN|MAX|DATABASE|INTEGER|VARCHAR|TEXT|DATE|TIMESTAMP|BOOLEAN|CHAR|FLOAT|DOUBLE)\b/gi;
      html = html.replace(sqlKeywords, (match) => {
        return wrap('hl-keyword', match.toUpperCase());
      });

      // Restore tokens
      for (let i = tokens.length - 1; i >= 0; i--) {
        html = html.replace(tokens[i].placeholder, tokens[i].value);
      }

      return html;
    }

    if (lang === 'bash' || lang === 'sh' || lang === 'shell' || lang === 'cmd') {
      let html = escaped;
      const tokens: { placeholder: string; value: string }[] = [];
      let tokenIdx = 0;
      const pushToken = (className: string, text: string) => {
        const id = `___HL_TOKEN_${tokenIdx++}___`;
        tokens.push({ placeholder: id, value: wrap(className, text) });
        return id;
      };

      // Comments
      html = html.replace(/(#.*)/g, (match) => {
        return pushToken('hl-comment', match);
      });

      // Strings
      html = html.replace(/(&quot;[\s\S]*?&quot;|&#039;[\s\S]*?&#039;)/g, (match) => {
        return pushToken('hl-string', match);
      });

      // Variables
      html = html.replace(/(\$[a-zA-Z0-9_{}-]+)/g, (match) => {
        return wrap('hl-key', match);
      });

      // Common Commands
      const cmdKeywords = /\b(npm|npx|node|git|cd|ls|mkdir|rm|cp|mv|echo|cat|grep|chmod|sudo|docker|yarn|pnpm|ssh|tar|zip|unzip|curl|wget|make|gcc|python|pip|export|env)\b/g;
      html = html.replace(cmdKeywords, (match) => {
        return wrap('hl-keyword', match);
      });

      // Command options like -la or --verbose
      html = html.replace(/(-\w+|\b--\w+\b)/g, (match) => {
        return wrap('hl-operator', match);
      });

      // Restore tokens
      for (let i = tokens.length - 1; i >= 0; i--) {
        html = html.replace(tokens[i].placeholder, tokens[i].value);
      }

      return html;
    }
  } catch (err) {
    console.error('Syntax highlighting error:', err);
  }

  return escaped;
}

/**
 * Super lightweight, performant, and robust Markdown parser.
 * Perfectly styled with Tailwind CSS, supporting clean formatting.
 * Compiles markdown into fully-styled HTML.
 */
export function compileMarkdown(markdown: string): string {
  if (!markdown) return '';

  const lines = markdown.split(/\r?\n/);
  let html = '';
  let inCodeBlock = false;
  let codeBlockLanguage = '';
  let codeBlockLines: string[] = [];
  
  let inList = false;
  let listType: 'ol' | 'ul' | null = null;
  
  let inBlockquote = false;
  let blockquoteLines: string[] = [];

  let inTable = false;
  let tableHeaders: string[] = [];
  let tableRows: string[][] = [];
  let tableAlignments: ('left' | 'center' | 'right')[] = [];

  const flushList = () => {
    if (inList && listType) {
      html += `</${listType}>\n`;
      inList = false;
      listType = null;
    }
  };

  const flushBlockquote = () => {
    if (inBlockquote) {
      const quoteContent = compileMarkdown(blockquoteLines.join('\n'));
      html += `<blockquote class="border-l-4 border-[var(--border)] pl-4 py-1 my-4 italic text-[var(--text-muted)]">\n${quoteContent}\n</blockquote>\n`;
      blockquoteLines = [];
      inBlockquote = false;
    }
  };

  const flushTable = () => {
    if (inTable) {
      let tableHtml = '<div class="overflow-x-auto my-6 border border-[var(--border)] rounded-lg shadow-sm"><table class="min-w-full divide-y divide-[var(--border)] text-sm">\n';
      
      // Render Header
      tableHtml += '<thead><tr class="bg-[var(--bg-btn-hover)]">\n';
      tableHeaders.forEach((header, index) => {
        const align = tableAlignments[index] || 'left';
        const alignClass = align === 'center' ? 'text-center' : align === 'right' ? 'text-right' : 'text-left';
        tableHtml += `<th class="px-4 py-3 font-semibold text-[var(--text-heading)] ${alignClass}">${parseInlineMarkdown(header)}</th>\n`;
      });
      tableHtml += '</tr></thead>\n';

      // Render Body
      tableHtml += '<tbody class="divide-y divide-[var(--border)] bg-[var(--bg-panel)]">\n';
      tableRows.forEach((row) => {
        tableHtml += '<tr class="hover:bg-[var(--bg-btn-hover)] transition-colors">\n';
        for (let i = 0; i < tableHeaders.length; i++) {
          const colValue = row[i] || '';
          const align = tableAlignments[i] || 'left';
          const alignClass = align === 'center' ? 'text-center' : align === 'right' ? 'text-right' : 'text-left';
          tableHtml += `<td class="px-4 py-3 text-[var(--text-body)] ${alignClass}">${parseInlineMarkdown(colValue)}</td>\n`;
        }
        tableHtml += '</tr>\n';
      });
      tableHtml += '</tbody></table></div>\n';

      html += tableHtml;
      inTable = false;
      tableHeaders = [];
      tableRows = [];
      tableAlignments = [];
    }
  };

  const flushAll = () => {
    flushList();
    flushBlockquote();
    flushTable();
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // --- CODE BLOCK STATE ---
    if (inCodeBlock) {
      if (line.trim().startsWith('```')) {
        // End of code block
        const codeText = codeBlockLines.join('\n');
        const highlighted = highlightCode(codeText, codeBlockLanguage);
        const displayLang = codeBlockLanguage ? escapeHtml(codeBlockLanguage) : 'text';
        
        html += `<div class="group relative my-6 rounded-lg overflow-hidden border border-[var(--border)] bg-[var(--bg-input)] text-[var(--text-body)]">
          <div class="flex items-center justify-between px-4 py-1.5 bg-[var(--bg-main)] border-b border-[var(--border)] text-xs font-mono text-[var(--text-muted)] select-none">
            <span>${displayLang}</span>
            <button onclick="navigator.clipboard.writeText(decodeURIComponent('${encodeURIComponent(codeText)}'))" class="hover:text-[var(--text-heading)] px-2 py-0.5 rounded transition-colors" title="Copy code">Copy</button>
          </div>
          <pre class="p-4 overflow-x-auto font-mono text-xs md:text-sm leading-relaxed"><code class="language-${codeBlockLanguage}">${highlighted}</code></pre>
        </div>\n`;

        inCodeBlock = false;
        codeBlockLanguage = '';
        codeBlockLines = [];
      } else {
        codeBlockLines.push(line);
      }
      continue;
    }

    // --- NON-CODE BLOCK STATE ---
    
    // Check for Code Block Start
    if (line.trim().startsWith('```')) {
      flushAll();
      inCodeBlock = true;
      codeBlockLanguage = line.trim().substring(3).trim();
      continue;
    }

    // Horizontal Rule
    if (/^(?:-{3,}|\*{3,}|_{3,})$/.test(line.trim())) {
      flushAll();
      html += `<hr class="my-8 border-t border-[var(--border)]" />\n`;
      continue;
    }

    // Headings
    const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);
    if (headingMatch) {
      flushAll();
      const level = headingMatch[1].length;
      const text = headingMatch[2];
      const parsedText = parseInlineMarkdown(text);
      
      let headingClass = '';
      if (level === 1) headingClass = 'text-3xl font-bold tracking-tight text-[var(--text-heading)] mt-8 mb-4 border-b border-[var(--border)] pb-2';
      else if (level === 2) headingClass = 'text-2xl font-semibold tracking-tight text-[var(--text-heading)] mt-6 mb-3 border-b border-[var(--border)] pb-1';
      else if (level === 3) headingClass = 'text-xl font-medium tracking-tight text-[var(--text-heading)] mt-5 mb-2';
      else if (level === 4) headingClass = 'text-lg font-medium text-[var(--text-heading)] mt-4 mb-2';
      else if (level === 5) headingClass = 'text-base font-medium text-[var(--text-muted)] mt-4 mb-1';
      else headingClass = 'text-sm font-semibold uppercase tracking-wider text-[var(--text-muted)] mt-4 mb-1';

      html += `<h${level} class="${headingClass}">${parsedText}</h${level}>\n`;
      continue;
    }

    // Blockquotes
    if (line.startsWith('>')) {
      flushList();
      flushTable();
      inBlockquote = true;
      // strip standard leading blockquote symbol, keeping space structure
      const content = line.substring(1).replace(/^\s/, '');
      blockquoteLines.push(content);
      continue;
    } else {
      flushBlockquote();
    }

    // Lists (Unordered and Ordered)
    const ulMatch = line.match(/^(\s*)([-*+])\s+(.+)$/);
    const olMatch = line.match(/^(\s*)(\d+)\.\s+(.+)$/);

    if (ulMatch || olMatch) {
      flushTable();
      
      const currentListType = ulMatch ? 'ul' : 'ol';
      const content = ulMatch ? ulMatch[3] : olMatch![3];

      if (!inList || listType !== currentListType) {
        flushList();
        inList = true;
        listType = currentListType;
        const listClass = listType === 'ul' ? 'list-disc pl-6 my-4 space-y-1.5 text-[var(--text-body)]' : 'list-decimal pl-6 my-4 space-y-1.5 text-[var(--text-body)]';
        html += `<${listType} class="${listClass}">\n`;
      }

      html += `<li class="leading-relaxed hover:text-[var(--text-heading)] transition-colors">${parseInlineMarkdown(content)}</li>\n`;
      continue;
    } else {
      flushList();
    }

    // Tables
    // Minimal check: Line contains | and is not inside any blocks
    if (line.trim().startsWith('|') && line.trim().endsWith('|')) {
      const parts = line.trim().split('|').map(s => s.trim()).filter((_, idx, arr) => idx > 0 && idx < arr.length - 1);
      
      if (!inTable) {
        // This is potentially the header
        // Peek at next line to verify it's a delimiter: | --- | :---: |
        const nextLine = lines[i + 1];
        if (nextLine && nextLine.trim().startsWith('|') && nextLine.includes('-')) {
          inTable = true;
          tableHeaders = parts;
          
          // Parse alignments
          const delimiterParts = nextLine.trim().split('|').map(s => s.trim()).filter((_, idx, arr) => idx > 0 && idx < arr.length - 1);
          tableAlignments = delimiterParts.map(part => {
            const left = part.startsWith(':');
            const right = part.endsWith(':');
            if (left && right) return 'center';
            if (right) return 'right';
            return 'left';
          });

          // Skip delimiter line
          i++;
          continue;
        }
      } else {
        // Row entry
        tableRows.push(parts);
        continue;
      }
    } else {
      flushTable();
    }

    // Empty Lines
    if (line.trim() === '') {
      continue;
    }

    // Plain Paragraph
    html += `<p class="my-4 leading-relaxed text-[var(--text-body)]">${parseInlineMarkdown(line)}</p>\n`;
  }

  // Final flush of any running states
  flushAll();

  return html;
}

/**
 * Parses inline markdown: Bold, Italic, Strikethrough, inline code, links, images
 */
export function parseInlineMarkdown(text: string): string {
  let res = escapeHtml(text);

  // Images: ![alt](url)
  res = res.replace(/!\[(.*?)\]\((.*?)\)/g, '<img src="$2" alt="$1" class="rounded max-h-96 my-4 leading-none inline break-inside-avoid border border-[var(--border)]" referrerPolicy="no-referrer" />');

  // Links: [text](url)
  res = res.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-terra hover:text-terra/80 underline font-medium transition-colors">$1</a>');

  // Strong / Bold: **text** or __text__
  res = res.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-[var(--text-heading)]">$1</strong>');
  res = res.replace(/__(.*?)__/g, '<strong class="font-bold text-[var(--text-heading)]">$1</strong>');

  // Italic: *text* or _text_
  res = res.replace(/\*(.*?)\*/g, '<em class="italic">$1</em>');
  res = res.replace(/_(.*?)_/g, '<em class="italic">$1</em>');

  // Strikethrough: ~~text~~
  res = res.replace(/~~(.*?)~~/g, '<del class="line-through text-[var(--text-muted)]">$1</del>');

  // Inline Code: `code`
  res = res.replace(/`(.*?)`/g, '<code class="px-1.5 py-0.5 rounded text-sm bg-[var(--bg-btn-hover)] text-rose-600 font-mono font-medium border border-[var(--border)]">$1</code>');

  return res;
}
