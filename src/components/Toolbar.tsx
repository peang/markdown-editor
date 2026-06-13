/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef } from 'react';
import { 
  Bold, 
  Italic, 
  Code, 
  Heading1, 
  Link2, 
  Image, 
  List, 
  Table, 
  ArrowLeftRight, 
  Download, 
  Upload, 
  Database, 
  Sparkles,
  Sun,
  Moon,
  Eye,
  Edit2,
  Split,
  RefreshCw
} from 'lucide-react';
import { MarkdownFile, MarkdownFolder, ViewMode } from '../types';

interface ToolbarProps {
  activeFile: MarkdownFile | null;
  folders: MarkdownFolder[];
  viewMode: ViewMode;
  darkMode: boolean;
  onSetViewMode: (mode: ViewMode) => void;
  onToggleDarkMode: () => void;
  onMoveFile: (fileId: string, targetFolderId: string) => void;
  onInsertMarkdown: (syntax: string) => void;
  onExportFile: () => void;
  onImportFile: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onExportWorkspace: () => void;
  onImportWorkspace: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onResetWorkspace: () => void;
}

export default function Toolbar({
  activeFile,
  folders,
  viewMode,
  darkMode,
  onSetViewMode,
  onToggleDarkMode,
  onMoveFile,
  onInsertMarkdown,
  onExportFile,
  onImportFile,
  onExportWorkspace,
  onImportWorkspace,
  onResetWorkspace,
}: ToolbarProps) {
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const workspaceInputRef = useRef<HTMLInputElement>(null);

  // Stats calculation
  const getStats = () => {
    if (!activeFile) return { wCount: 0, cCount: 0 };
    const text = activeFile.content.trim();
    const wCount = text === '' ? 0 : text.split(/\s+/).filter(Boolean).length;
    const cCount = activeFile.content.length;
    return { wCount, cCount };
  };

  const { wCount, cCount } = getStats();

  // Helper trigger buttons for file-inserts
  const handleInsert = (type: string) => {
    if (!activeFile) return;
    
    switch (type) {
      case 'bold':
        onInsertMarkdown('**bold text**');
        break;
      case 'italic':
        onInsertMarkdown('*italic text*');
        break;
      case 'code':
        onInsertMarkdown('```javascript\n// custom code block\nconst code = "example";\n```');
        break;
      case 'h1':
        onInsertMarkdown('\n# Heading 1');
        break;
      case 'h2':
        onInsertMarkdown('\n## Heading 2');
        break;
      case 'link':
        onInsertMarkdown('[Google](https://google.com)');
        break;
      case 'image':
        onInsertMarkdown('![Sleek](https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&w=400&q=80)');
        break;
      case 'list':
        onInsertMarkdown('\n* List Item');
        break;
      case 'table':
        onInsertMarkdown('\n| Header 1 | Header 2 |\n| :--- | ---: |\n| Cell 1 | Cell 2 |');
        break;
      default:
        break;
    }
  };

  return (
    <div id="toolbar-container" className="flex flex-wrap items-center justify-between gap-3 p-3 bg-white dark:bg-[#0c0d0e] border-b border-gray-100 dark:border-gray-800 select-none z-10">
      
      {/* Markdown Insert Helpers */}
      <div className="flex items-center gap-1">
        <button
          id="btn-format-bold"
          disabled={!activeFile}
          onClick={() => handleInsert('bold')}
          className="p-1.5 text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white rounded hover:bg-gray-50 dark:hover:bg-gray-900/50 disabled:opacity-40 disabled:pointer-events-none transition-colors"
          title="Insert Bold (Ctrl+B)"
        >
          <Bold className="h-4 w-4" />
        </button>
        <button
          id="btn-format-italic"
          disabled={!activeFile}
          onClick={() => handleInsert('italic')}
          className="p-1.5 text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white rounded hover:bg-gray-50 dark:hover:bg-gray-900/50 disabled:opacity-40 disabled:pointer-events-none transition-colors"
          title="Insert Italic"
        >
          <Italic className="h-4 w-4" />
        </button>
        <button
          id="btn-format-h1"
          disabled={!activeFile}
          onClick={() => handleInsert('h1')}
          className="p-1.5 text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white rounded hover:bg-gray-50 dark:hover:bg-gray-900/50 disabled:opacity-40 disabled:pointer-events-none transition-colors"
          title="Insert Header 1"
        >
          <Heading1 className="h-4 w-4" />
        </button>
        <button
          id="btn-format-code"
          disabled={!activeFile}
          onClick={() => handleInsert('code')}
          className="p-1.5 text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white rounded hover:bg-gray-50 dark:hover:bg-gray-900/50 disabled:opacity-40 disabled:pointer-events-none transition-colors"
          title="Insert Code Block"
        >
          <Code className="h-4 w-4" />
        </button>
        <button
          id="btn-format-link"
          disabled={!activeFile}
          onClick={() => handleInsert('link')}
          className="p-1.5 text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white rounded hover:bg-gray-50 dark:hover:bg-gray-900/50 disabled:opacity-40 disabled:pointer-events-none transition-colors"
          title="Insert Hyperlink"
        >
          <Link2 className="h-4 w-4" />
        </button>
        <button
          id="btn-format-image"
          disabled={!activeFile}
          onClick={() => handleInsert('image')}
          className="p-1.5 text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white rounded hover:bg-gray-50 dark:hover:bg-gray-900/50 disabled:opacity-40 disabled:pointer-events-none transition-colors"
          title="Insert Image"
        >
          <Image className="h-4 w-4" />
        </button>
        <button
          id="btn-format-list"
          disabled={!activeFile}
          onClick={() => handleInsert('list')}
          className="p-1.5 text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white rounded hover:bg-gray-50 dark:hover:bg-gray-900/50 disabled:opacity-40 disabled:pointer-events-none transition-colors"
          title="Insert List Item"
        >
          <List className="h-4 w-4" />
        </button>
        <button
          id="btn-format-table"
          disabled={!activeFile}
          onClick={() => handleInsert('table')}
          className="p-1.5 text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white rounded hover:bg-gray-50 dark:hover:bg-gray-900/50 disabled:opacity-40 disabled:pointer-events-none transition-colors"
          title="Insert Markdown Table"
        >
          <Table className="h-4 w-4" />
        </button>

        {activeFile && (
          <div className="h-4 w-px bg-gray-200 dark:bg-gray-800 mx-2 self-center hidden sm:block"></div>
        )}

        {/* Move File Folder Switcher Dropdown */}
        {activeFile && (
          <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 pl-1">
            <span className="hidden md:inline font-mono text-[11px] uppercase tracking-wider">Folder:</span>
            <select
              id="select-move-file-folder"
              value={activeFile.folderId}
              onChange={(e) => onMoveFile(activeFile.id, e.target.value)}
              className="px-2 py-1 text-xs border border-gray-200 dark:border-gray-800 rounded bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-gray-400 transition-colors"
              title="Move file to another folder"
            >
              {folders.map(f => (
                <option key={f.id} value={f.id}>
                  {f.name} {f.isDefault ? '(Default)' : ''}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Stats Counter (Hidden on extra small screens) */}
      {activeFile ? (
        <div className="hidden lg:flex items-center gap-4 text-xs font-mono text-gray-400">
          <span>Words: <strong>{wCount}</strong></span>
          <span>Chars: <strong>{cCount}</strong></span>
        </div>
      ) : (
        <div className="hidden lg:flex items-center gap-2 text-xs font-mono text-gray-400 italic">
          Select or create a file to start writing
        </div>
      )}

      {/* General Actions, Backup, Toggle Themes, and View toggles */}
      <div className="flex items-center gap-2">
        {/* Toggle dark/light theme */}
        <button
          id="btn-toggle-dark-mode"
          onClick={onToggleDarkMode}
          className="p-1.5 text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white rounded hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors"
          title={darkMode ? 'Light Theme' : 'Dark Theme'}
        >
          {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>

        <div className="h-4 w-px bg-gray-200 dark:bg-gray-800 self-center"></div>

        {/* Import & Export Active Document */}
        {activeFile && (
          <>
            <button
              id="btn-export-file"
              onClick={onExportFile}
              className="p-1.5 text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white rounded hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors"
              title="Export (.md)"
            >
              <Download className="h-4 w-4" />
            </button>
            <button
              id="btn-import-file"
              onClick={() => fileInputRef.current?.click()}
              className="p-1.5 text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white rounded hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors"
              title="Import (.md, .txt)"
            >
              <Upload className="h-4 w-4" />
            </button>
            <input
              id="file-import-input"
              type="file"
              ref={fileInputRef}
              onChange={onImportFile}
              accept=".md,.txt"
              className="hidden"
            />
          </>
        )}

        <div className="h-4 w-px bg-gray-200 dark:bg-gray-800 self-center"></div>

        {/* Global Workspace Backup (JSON) and Reset */}
        <div className="flex items-center gap-1.5">
          <button
            id="btn-export-workspace"
            onClick={onExportWorkspace}
            className="p-1.5 text-gray-500 hover:text-[#536dfe] dark:text-gray-400 dark:hover:text-[#536dfe] rounded hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors"
            title="Backup workspace (JSON)"
          >
            <Database className="h-4 w-4" />
          </button>
          
          <button
            id="btn-import-workspace"
            onClick={() => workspaceInputRef.current?.click()}
            className="p-1.5 text-gray-500 hover:text-emerald-500 dark:text-gray-400 dark:hover:text-emerald-400 rounded hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors"
            title="Restore workspace backup (.json)"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
          <input
            id="workspace-import-input"
            type="file"
            ref={workspaceInputRef}
            onChange={onImportWorkspace}
            accept=".json"
            className="hidden"
          />

          <button
            id="btn-reset-workspace"
            onClick={() => {
              if (confirm('RESET ALL WORKSPACE DATA?\nThis will permanently delete all your files, custom folders and revert the default template files in local storage. This is irreversible.')) {
                onResetWorkspace();
              }
            }}
            className="px-2 py-1 text-[10px] font-mono leading-tight border border-rose-200 hover:bg-rose-50 dark:border-rose-950 dark:hover:bg-rose-950/20 text-rose-500 rounded transition-colors"
            title="Wipe workspace and load defaults"
          >
            Reset
          </button>
        </div>

        <div className="h-4 w-px bg-gray-200 dark:bg-gray-800 self-center"></div>

        {/* Split/Focus Mode Toggle */}
        <div className="flex bg-gray-100 dark:bg-gray-900 p-0.5 rounded-md">
          <button
            id="btn-view-edit"
            onClick={() => onSetViewMode('edit')}
            className={`p-1.5 rounded-sm transition-all duration-150 ${
              viewMode === 'edit'
                ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-950 shadow-xs font-semibold'
                : 'text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
            }`}
            title="Editor Only"
          >
            <Edit2 className="h-3.5 w-3.5" />
          </button>
          <button
            id="btn-view-split"
            onClick={() => onSetViewMode('split')}
            className={`p-1.5 rounded-sm transition-all duration-150 ${
              viewMode === 'split'
                ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-950 shadow-xs font-semibold'
                : 'text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
            }`}
            title="Split Mode (Ctrl+E)"
          >
            <Split className="h-3.5 w-3.5" />
          </button>
          <button
            id="btn-view-preview"
            onClick={() => onSetViewMode('preview')}
            className={`p-1.5 rounded-sm transition-all duration-150 ${
              viewMode === 'preview'
                ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-950 shadow-xs font-semibold'
                : 'text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
            }`}
            title="Preview Only"
          >
            <Eye className="h-3.5 w-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
}
