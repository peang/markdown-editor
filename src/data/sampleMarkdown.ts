/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export const SAMPLE_MARKDOWN = `# Welcome to Markdown Editor & Viewer! 📝

This is a sleek, lightweight, fast, and secure markdown editor. It is fully **offline-first**, storing all your folders and files safely in the browser's \`localStorage\`. 

It has been hand-optimized to consume minimal CPU and RAM, making it perfect for both powerful workstations and **mature hardware**.

---

## ⚡ Key Highlights
* **Folder Organization**: Create custom folders and organize your files seamlessly.
* **No Server Overhead**: 100% Client-side. Your private notes never touch an external server.
* **Instant Export & Import**: Save your markdown files directly, or backup/restore your entire folder catalog in seconds.
* **Optimized Execution**: High-perf custom regex-based parser and sub-millisecond syntax highlighter.

---

## 💻 Code Blocks & Syntax Highlighting

Here is an example of code syntax highlighting. You can write scripts in many languages:

\`\`\`javascript
// High-performance JavaScript highlighter
const computeFibonacci = (n) => {
  if (n <= 1) return n;
  let prev = 0, curr = 1;
  for (let i = 2; i <= n; i++) {
    const next = prev + curr;
    prev = curr;
    curr = next;
  }
  return curr;
};

console.log(\`Fibonacci(10) is: \${computeFibonacci(10)}\`);
\`\`\`

You can also highlight \`python\` scripts:

\`\`\`python
# Simple Python file analyzer
def analyze_headers(filename):
    with open(filename, 'r') as file:
        lines = file.readlines()
        
    headers = [line.strip() for line in lines if line.startswith("#")]
    print(f"Discovered {len(headers)} section headers in {filename}.")
    return headers
\`\`\`

Or structure databases with \`sql\`:

\`\`\`sql
-- Retrieve active files grouped by parent folder
SELECT folder_id, COUNT(id) AS active_files
FROM markdown_files
WHERE updated_at > 1700000000000
GROUP BY folder_id
ORDER BY active_files DESC;
\`\`\`

---

## 📊 Styled Tables
Create beautiful custom tables with alignment support:

| Feature | Browser Support | Storage Engine | Overhead |
| :--- | :---: | :---: | ---: |
| Full Markdown | 100% | In-Memory | Minimal |
| Local Folders | 100% | localStorage | Zero |
| Files Export | 100% | File System | Zero |

---

##  Formatting Reference

### 📣 Blockquotes & Nested Elements
> "Simplicity is the ultimate sophistication." 
> — *Leonardo da Vinci*
> 
> Create beautiful sub-callouts inside any quote block easily.

### 📝 Lists
1. Beautiful ordered items
2. Supports numbers and tracking
* Dynamic bulleted lists
* Smooth hover styling

### 🔗 Hyperlinks & Media
Connect with people and embed content:
* Read [Google's AI Studio Build](https://ai.studio/build)
* Create standard HTML responsive image links using standard markdown formats:

![Sleek Editor](https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&w=800&q=80)

---

## 📁 Getting Started with Folders
Use the sidebar on the left to:
1. **Explore Folders**: Create, rename, or delete foldered notebooks.
2. **Move Files**: Click the dropdown next to any file name to move it into another folder instantly.
3. **Backup All**: Click **Export Workspace** in the toolbar to save your entire layout file as a single JSON file.
`;
