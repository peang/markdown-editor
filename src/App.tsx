/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import Sidebar from './components/Sidebar';
import Toolbar from './components/Toolbar';
import EditorArea, { EditorAreaRef } from './components/EditorArea';
import PreviewArea from './components/PreviewArea';
import { MarkdownFile, MarkdownFolder, ViewMode } from './types';
import { SAMPLE_MARKDOWN } from './data/sampleMarkdown';
import { Save, Check, Sparkles, BookOpen, Clock } from 'lucide-react';

const STORAGE_KEYS = {
  FOLDERS: 'litemark_folders_v1',
  FILES: 'litemark_files_v1',
  DARK_MODE: 'litemark_dark_v1',
  VIEW_MODE: 'litemark_view_v1',
  ACTIVE_FILE: 'litemark_active_file_v1',
};

// Initial setup nodes
const DEFAULT_FOLDER: MarkdownFolder = {
  id: 'folder-default',
  name: 'My Workspace',
  createdAt: Date.now(),
  isDefault: true,
};

const DEFAULT_FILE: MarkdownFile = {
  id: 'file-welcome',
  name: 'Welcome.md',
  content: SAMPLE_MARKDOWN,
  createdAt: Date.now(),
  updatedAt: Date.now(),
  folderId: 'folder-default',
};

export default function App() {
  // --- STATE LISTS ---
  const [folders, setFolders] = useState<MarkdownFolder[]>([]);
  const [files, setFiles] = useState<MarkdownFile[]>([]);
  const [activeFileId, setActiveFileId] = useState<string | null>(null);
  const [activeFolderId, setActiveFolderId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('split');
  const [darkMode, setDarkMode] = useState<boolean>(false);
  
  // Custom toast notification state
  const [toast, setToast] = useState<{ message: string; show: boolean; type?: 'info' | 'success' }>({
    message: '',
    show: false,
  });

  const editorRef = useRef<EditorAreaRef>(null);

  // --- INITIALIZATION ---
  useEffect(() => {
    // 1. Folders Initializer
    const storedFolders = localStorage.getItem(STORAGE_KEYS.FOLDERS);
    let finalFolders: MarkdownFolder[] = [];
    if (storedFolders) {
      try {
        finalFolders = JSON.parse(storedFolders);
      } catch (e) {
        finalFolders = [DEFAULT_FOLDER];
      }
    } else {
      finalFolders = [DEFAULT_FOLDER];
    }
    setFolders(finalFolders);

    // 2. Files Initializer
    const storedFiles = localStorage.getItem(STORAGE_KEYS.FILES);
    let finalFiles: MarkdownFile[] = [];
    if (storedFiles) {
      try {
        finalFiles = JSON.parse(storedFiles);
      } catch (e) {
        finalFiles = [DEFAULT_FILE];
      }
    } else {
      finalFiles = [DEFAULT_FILE];
    }
    setFiles(finalFiles);

    // 3. Active File Selection
    const storedActiveFileId = localStorage.getItem(STORAGE_KEYS.ACTIVE_FILE);
    if (storedActiveFileId && finalFiles.some(f => f.id === storedActiveFileId)) {
      setActiveFileId(storedActiveFileId);
      const activeFile = finalFiles.find(f => f.id === storedActiveFileId);
      if (activeFile) {
        setActiveFolderId(activeFile.folderId);
      }
    } else if (finalFiles.length > 0) {
      setActiveFileId(finalFiles[0].id);
      setActiveFolderId(finalFiles[0].folderId);
    }

    // 4. Dark Mode Settings
    const storedDarkMode = localStorage.getItem(STORAGE_KEYS.DARK_MODE);
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialDarkMode = storedDarkMode ? storedDarkMode === 'true' : prefersDark;
    setDarkMode(initialDarkMode);

    // 5. View Mode
    const storedViewMode = localStorage.getItem(STORAGE_KEYS.VIEW_MODE);
    if (storedViewMode) {
      setViewMode(storedViewMode as ViewMode);
    } else {
      setViewMode('split');
    }
  }, []);

  // --- PERSISTENCE MUTATORS ---
  useEffect(() => {
    if (folders.length > 0) {
      localStorage.setItem(STORAGE_KEYS.FOLDERS, JSON.stringify(folders));
    }
  }, [folders]);

  useEffect(() => {
    if (files.length > 0) {
      localStorage.setItem(STORAGE_KEYS.FILES, JSON.stringify(files));
    }
  }, [files]);

  useEffect(() => {
    if (activeFileId) {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_FILE, activeFileId);
    } else {
      localStorage.removeItem(STORAGE_KEYS.ACTIVE_FILE);
    }
  }, [activeFileId]);

  useEffect(() => {
    // Add dark class to document root for seamless styling
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem(STORAGE_KEYS.DARK_MODE, String(darkMode));
  }, [darkMode]);

  // --- TOAST NOTIFIER HELPER ---
  const triggerToast = (message: string, type: 'info' | 'success' = 'info') => {
    setToast({ message, show: true, type });
    setTimeout(() => {
      setToast(prev => ({ ...prev, show: false }));
    }, 3000);
  };

  // --- ACTIONS & HANDLERS ---
  const handleSelectFile = (fileId: string) => {
    setActiveFileId(fileId);
    const selected = files.find(f => f.id === fileId);
    if (selected) {
      setActiveFolderId(selected.folderId);
    }
  };

  const handleSelectFolder = (folderId: string) => {
    setActiveFolderId(folderId);
  };

  const handleCreateFile = (folderId: string) => {
    const parentFolder = folders.find(f => f.id === folderId) || folders[0];
    const baseNewName = 'Untitled.md';
    
    // De-duplicate untitled file names in that folder
    let finalName = baseNewName;
    let counter = 1;
    while (files.some(f => f.folderId === folderId && f.name === finalName)) {
      finalName = `Untitled (${counter++}).md`;
    }

    const newFile: MarkdownFile = {
      id: `file-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      name: finalName,
      content: `# ${finalName.replace('.md', '')}\n\nStart writing here...`,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      folderId: folderId,
    };

    setFiles(prev => [newFile, ...prev]);
    setActiveFileId(newFile.id);
    setActiveFolderId(folderId);
    triggerToast(`Created file "${finalName}"`, 'success');
  };

  const handleCreateFolder = (name: string) => {
    // De-duplicate folder names
    let finalName = name.trim();
    let counter = 1;
    while (folders.some(f => f.name.toLowerCase() === finalName.toLowerCase())) {
      finalName = `${name.trim()} (${counter++})`;
    }

    const newFolder: MarkdownFolder = {
      id: `folder-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      name: finalName,
      createdAt: Date.now(),
    };

    setFolders(prev => [...prev, newFolder]);
    setActiveFolderId(newFolder.id);
    triggerToast(`Folder "${finalName}" created`, 'success');
  };

  const handleRenameFolder = (folderId: string, newName: string) => {
    setFolders(prev => prev.map(f => {
      if (f.id === folderId) {
        return { ...f, name: newName };
      }
      return f;
    }));
    triggerToast(`Folder renamed to "${newName}"`);
  };

  const handleDeleteFolder = (folderId: string) => {
    const folderToDelete = folders.find(f => f.id === folderId);
    if (!folderToDelete || folderToDelete.isDefault) return;

    // Delete folder and recursively delete all its documents
    setFolders(prev => prev.filter(f => f.id !== folderId));
    setFiles(prev => {
      const remainingFiles = prev.filter(f => f.folderId !== folderId);
      // If active file is deleted, pick another
      if (prev.some(f => f.id === activeFileId && f.folderId === folderId)) {
        if (remainingFiles.length > 0) {
          setActiveFileId(remainingFiles[0].id);
          setActiveFolderId(remainingFiles[0].folderId);
        } else {
          setActiveFileId(null);
          setActiveFolderId(folders[0]?.id || null);
        }
      }
      return remainingFiles;
    });

    triggerToast(`Deleted folder "${folderToDelete.name}" and contents`);
  };

  const handleRenameFile = (fileId: string, newName: string) => {
    setFiles(prev => prev.map(f => {
      if (f.id === fileId) {
        return { ...f, name: newName, updatedAt: Date.now() };
      }
      return f;
    }));
    triggerToast(`Document renamed to "${newName}"`);
  };

  const handleDeleteFile = (fileId: string) => {
    setFiles(prev => {
      const filtered = prev.filter(f => f.id !== fileId);
      if (activeFileId === fileId) {
        if (filtered.length > 0) {
          setActiveFileId(filtered[0].id);
          setActiveFolderId(filtered[0].folderId);
        } else {
          setActiveFileId(null);
        }
      }
      return filtered;
    });
    triggerToast(`Document deleted`);
  };

  const handleContentChange = (newContent: string) => {
    if (!activeFileId) return;
    setFiles(prev => prev.map(f => {
      if (f.id === activeFileId) {
        return { ...f, content: newContent, updatedAt: Date.now() };
      }
      return f;
    }));
  };

  // --- REORGANIZATION (MOVE FILE TO ANOTHER FOLDER) ---
  const handleMoveFile = (fileId: string, targetFolderId: string) => {
    setFiles(prev => prev.map(f => {
      if (f.id === fileId) {
        return { ...f, folderId: targetFolderId, updatedAt: Date.now() };
      }
      return f;
    }));
    setActiveFolderId(targetFolderId);
    const folderName = folders.find(f => f.id === targetFolderId)?.name || 'target folder';
    triggerToast(`Moved file to "${folderName}"`, 'success');
  };

  // --- INSERT FORMATTING HELPER ---
  const handleInsertMarkdownInEditor = (syntax: string) => {
    if (editorRef.current) {
      editorRef.current.insertTextAtCursor(syntax);
    }
  };

  // --- SINGLE FILE EXPORT ---
  const handleExportFile = () => {
    const activeFile = files.find(f => f.id === activeFileId);
    if (!activeFile) return;

    const blob = new Blob([activeFile.content], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = activeFile.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    triggerToast(`Exported "${activeFile.name}"`, 'success');
  };

  // --- SINGLE FILE IMPORT ---
  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList || fileList.length === 0) return;

    const importedFile = fileList[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      
      // Clean up Name to append md
      let name = importedFile.name;
      if (!name.endsWith('.md') && !name.endsWith('.txt')) {
        name += '.md';
      } else if (name.endsWith('.txt')) {
        name = name.replace('.txt', '.md');
      }

      const activeFolder = activeFolderId || folders[0]?.id || 'folder-default';

      const newFile: MarkdownFile = {
        id: `file-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        name: name,
        content: content,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        folderId: activeFolder,
      };

      setFiles(prev => [newFile, ...prev]);
      setActiveFileId(newFile.id);
      triggerToast(`Imported file "${name}"`, 'success');
    };
    reader.readAsText(importedFile);
    // Reset file input value so same file can be uploaded again
    e.target.value = '';
  };

  // --- WORKSPACE BACKUP (EXPORT GENERAL JSON) ---
  const handleExportWorkspace = () => {
    const backupData = {
      version: '1.0',
      exportedAt: Date.now(),
      folders,
      files,
    };

    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `litemark-workspace-backup-${new Date().toISOString().slice(0,10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    triggerToast(`Workspace backup exported!`, 'success');
  };

  // --- WORKSPACE RESTORE (IMPORT GENERAL JSON) ---
  const handleImportWorkspace = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList || fileList.length === 0) return;

    const backupFile = fileList[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const rawJson = event.target?.result as string;
        const parsed = JSON.parse(rawJson);

        // Verification Checks
        if (!parsed.folders || !Array.isArray(parsed.folders) || !parsed.files || !Array.isArray(parsed.files)) {
          alert('Invalid backup file. Missing critical folders or files datasets.');
          return;
        }

        // Validate individual folder structures
        const validatedFolders: MarkdownFolder[] = parsed.folders.filter((f: any) => f.id && f.name);
        // Validate individual file structures
        const validatedFiles: MarkdownFile[] = parsed.files.filter((file: any) => file.id && file.name && file.content && file.folderId);

        if (validatedFolders.length === 0) {
          alert('No valid folders found in backup.');
          return;
        }

        // Apply backup states
        setFolders(validatedFolders);
        setFiles(validatedFiles);

        // Set active selections safely
        if (validatedFiles.length > 0) {
          setActiveFileId(validatedFiles[0].id);
          setActiveFolderId(validatedFiles[0].folderId);
        } else {
          setActiveFileId(null);
          setActiveFolderId(validatedFolders[0].id);
        }

        // Flush directly to local storage to sync
        localStorage.setItem(STORAGE_KEYS.FOLDERS, JSON.stringify(validatedFolders));
        localStorage.setItem(STORAGE_KEYS.FILES, JSON.stringify(validatedFiles));

        triggerToast(`Backup successfully restored!`, 'success');
      } catch (err) {
        console.error(err);
        alert('Failed to parse backup JSON. Please ensure the file was not altered.');
      }
    };
    reader.readAsText(backupFile);
    e.target.value = '';
  };

  // --- HARD WORKSPACE RESET ---
  const handleResetWorkspace = () => {
    localStorage.removeItem(STORAGE_KEYS.FOLDERS);
    localStorage.removeItem(STORAGE_KEYS.FILES);
    localStorage.removeItem(STORAGE_KEYS.ACTIVE_FILE);

    setFolders([DEFAULT_FOLDER]);
    setFiles([DEFAULT_FILE]);
    setActiveFileId(DEFAULT_FILE.id);
    setActiveFolderId(DEFAULT_FOLDER.id);
    triggerToast('Workspace restored to factory settings', 'info');
  };

  // --- KEYBOARD SHORTCUTS CONTROLLER ---
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeFile = files.find(f => f.id === activeFileId);
      
      // Ctrl+S / Cmd+S: Save placeholder trigger
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        triggerToast('All changes saved instantly and offline!', 'success');
      }

      // Ctrl+B / Cmd+B: Bold text helper
      if (activeFile && (e.ctrlKey || e.metaKey) && e.key === 'b') {
        e.preventDefault();
        handleInsertMarkdownInEditor('**bold text**');
      }

      // Ctrl+E / Cmd+E: Cycle Focus/Split Views
      if ((e.ctrlKey || e.metaKey) && e.key === 'e') {
        e.preventDefault();
        setViewMode(prev => {
          if (prev === 'split') return 'edit';
          if (prev === 'edit') return 'preview';
          return 'split';
        });
        triggerToast('View-mode cycled via hotkey');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeFileId, files]);

  const activeFile = files.find(f => f.id === activeFileId) || null;

  return (
    <div className={`h-screen w-screen flex flex-col overflow-hidden bg-gray-50 dark:bg-[#0c0d0e] transition-colors duration-200`}>
      {/* Top Banner indicating offline reliability */}
      <header className="px-4 py-2 bg-gray-950 text-white flex items-center justify-between text-xs select-none">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="font-mono text-[11px] font-medium text-gray-300">LiteMark Core: Ready & Persistent</span>
        </div>
        <div className="flex items-center gap-4 text-[11px] font-mono text-gray-400">
          <span className="hidden md:inline">Ctrl+B: Bold</span>
          <span className="hidden md:inline">Ctrl+E: Cycle View</span>
          <span className="hidden md:inline">Ctrl+S: Save Alert</span>
          <span>100% Client-Side Engine</span>
        </div>
      </header>

      {/* Main Container Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar Panel */}
        <Sidebar
          folders={folders}
          files={files}
          activeFileId={activeFileId}
          activeFolderId={activeFolderId}
          onSelectFile={handleSelectFile}
          onSelectFolder={handleSelectFolder}
          onCreateFile={handleCreateFile}
          onCreateFolder={handleCreateFolder}
          onRenameFolder={handleRenameFolder}
          onDeleteFolder={handleDeleteFolder}
          onRenameFile={handleRenameFile}
          onDeleteFile={handleDeleteFile}
        />

        {/* Content Panel */}
        <div className="flex-1 flex flex-col overflow-hidden bg-white dark:bg-[#111314]">
          {/* Main Actions Control Toolbar */}
          <Toolbar
            activeFile={activeFile}
            folders={folders}
            viewMode={viewMode}
            darkMode={darkMode}
            onSetViewMode={(mode) => setViewMode(mode)}
            onToggleDarkMode={() => setDarkMode(prev => !prev)}
            onMoveFile={handleMoveFile}
            onInsertMarkdown={handleInsertMarkdownInEditor}
            onExportFile={handleExportFile}
            onImportFile={handleImportFile}
            onExportWorkspace={handleExportWorkspace}
            onImportWorkspace={handleImportWorkspace}
            onResetWorkspace={handleResetWorkspace}
          />

          {/* Interactive Editing Splat Box Grid */}
          <div className="flex-1 flex overflow-hidden">
            {/* Plain Editor Container */}
            {(viewMode === 'edit' || viewMode === 'split') && (
              <EditorArea
                ref={editorRef}
                activeFile={activeFile}
                onContentChange={handleContentChange}
              />
            )}

            {/* Custom live parser container */}
            {(viewMode === 'preview' || viewMode === 'split') && (
              <PreviewArea activeFile={activeFile} />
            )}
          </div>
        </div>
      </div>

      {/* Aesthetic floating toast notifications */}
      {toast.show && (
        <div className="fixed bottom-6 right-6 flex items-center gap-2 p-3 rounded-lg shadow-lg bg-gray-900 border border-gray-800 text-white text-xs font-mono transition-opacity duration-300 z-50 animate-fade-in animate-bounce">
          {toast.type === 'success' ? (
            <Check className="h-4 w-4 text-emerald-400" />
          ) : (
            <Sparkles className="h-4 w-4 text-indigo-400" />
          )}
          <span>{toast.message}</span>
        </div>
      )}
    </div>
  );
}
