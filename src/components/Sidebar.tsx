import React, { useState } from 'react';
import { 
  Folder, 
  FolderPlus, 
  File, 
  FilePlus, 
  Trash2, 
  Edit3, 
  ChevronDown, 
  ChevronRight, 
  ChevronLeft,
  Move,
  Search, 
  X,
  FileText,
  Check
} from 'lucide-react';
import { MarkdownFile, MarkdownFolder } from '../types';

interface SidebarProps {
  folders: MarkdownFolder[];
  files: MarkdownFile[];
  activeFileId: string | null;
  activeFolderId: string | null;
  onSelectFile: (fileId: string) => void;
  onSelectFolder: (folderId: string) => void;
  onCreateFile: (folderId: string) => void;
  onCreateFolder: (name: string) => void;
  onRenameFolder: (folderId: string, newName: string) => void;
  onDeleteFolder: (folderId: string) => void;
  onRenameFile: (fileId: string, newName: string) => void;
  onDeleteFile: (fileId: string) => void;
  onMoveFile: (fileId: string, folderId: string) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export default function Sidebar({
  folders,
  files,
  activeFileId,
  activeFolderId,
  onSelectFile,
  onSelectFolder,
  onCreateFile,
  onCreateFolder,
  onRenameFolder,
  onDeleteFolder,
  onRenameFile,
  onDeleteFile,
  onMoveFile,
  isOpen,
  setIsOpen,
}: SidebarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [collapsedFolders, setCollapsedFolders] = useState<Record<string, boolean>>({});
  
  const [editingFolderId, setEditingFolderId] = useState<string | null>(null);
  const [editingFolderName, setEditingFolderName] = useState('');
  const [editingFileId, setEditingFileId] = useState<string | null>(null);
  const [editingFileName, setEditingFileName] = useState('');

  const [showNewFolderInput, setShowNewFolderInput] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [movingId, setMovingId] = useState<string | null>(null);

  const toggleFolder = (folderId: string) => {
    setCollapsedFolders(prev => ({
      ...prev,
      [folderId]: !prev[folderId]
    }));
  };

  const handleCreateFolderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newFolderName.trim()) {
      onCreateFolder(newFolderName.trim());
      setNewFolderName('');
      setShowNewFolderInput(false);
    }
  };

  const startRenameFolder = (folder: MarkdownFolder, e: React.MouseEvent) => {
    e.stopPropagation();
    if (folder.isDefault) return;
    setEditingFolderId(folder.id);
    setEditingFolderName(folder.name);
  };

  const handleRenameFolderSubmit = (folderId: string) => {
    if (editingFolderName.trim()) {
      onRenameFolder(folderId, editingFolderName.trim());
    }
    setEditingFolderId(null);
  };

  const startRenameFile = (file: MarkdownFile, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingFileId(file.id);
    setEditingFileName(file.name);
  };

  const handleRenameFileSubmit = (fileId: string) => {
    if (editingFileName.trim()) {
      let finalName = editingFileName.trim();
      if (!finalName.endsWith('.md') && !finalName.includes('.')) {
        finalName += '.md';
      }
      onRenameFile(fileId, finalName);
    }
    setEditingFileId(null);
  };

  const filteredFiles = files.filter(file => {
    const term = searchQuery.toLowerCase();
    return file.name.toLowerCase().includes(term) || file.content.toLowerCase().includes(term);
  });

  const getFileCountInFolder = (folderId: string) => {
    return files.filter(f => f.folderId === folderId).length;
  };

  return (
    <aside id="sidebar-container" className={`relative h-full border-r border-[var(--border)] bg-[var(--bg-main)] flex select-none transition-all duration-300 ${
      isOpen ? 'w-80' : 'w-12'
    }`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="absolute top-1/2 -translate-y-1/2 -right-8 w-8 h-20 bg-[var(--bg-panel)] hover:bg-[var(--bg-btn-hover)] border-y border-r border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text-heading)] flex items-center justify-center rounded-r-lg shadow-md cursor-pointer transition-colors z-30"
      >
        {isOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
      </button>

      <div className={`flex-1 flex flex-col overflow-hidden ${isOpen ? '' : 'invisible'}`}>
      <div className="p-4 border-b border-[var(--border)] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[var(--text-heading)] flex items-center justify-center text-[var(--bg-main)] font-display font-bold text-lg leading-none shadow-sm">
            M
          </div>
          <div>
            <h1 className="font-display font-semibold text-[var(--text-heading)] tracking-tight leading-none text-base">Markdown Editor</h1>
          </div>
        </div>
      </div>

      <div className="px-4 py-3 border-b border-[var(--border)]">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-[var(--text-muted)]" />
          <input
            id="sidebar-search-input"
            type="text"
            placeholder="Search notes / contents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-8 py-2 text-xs text-[var(--text-heading)] bg-[var(--bg-input)] border border-[var(--border)] rounded-md placeholder:text-[var(--text-muted)] focus:border-terra transition-colors"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-2.5 text-[var(--text-muted)] hover:text-[var(--text-heading)]"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      <div className="p-3 flex items-center justify-between">
        <span className="text-[11px] font-mono font-bold tracking-wider text-[var(--text-muted)] uppercase">Documents</span>
        
        <button
          id="btn-new-folder"
          onClick={() => setShowNewFolderInput(prev => !prev)}
          className="flex items-center gap-1.5 px-2 py-1 text-xs font-medium text-[var(--text-muted)] hover:text-[var(--text-heading)] rounded hover:bg-[var(--bg-btn-hover)] transition-colors"
          title="New Folder"
        >
          <FolderPlus className="h-4 w-4" />
          <span className="text-[11px]">Folder</span>
        </button>
      </div>

      {showNewFolderInput && (
        <form onSubmit={handleCreateFolderSubmit} className="mx-3 mb-2 p-2 bg-[var(--bg-btn)] border border-[var(--border)] rounded-md">
          <div className="flex gap-1.5">
            <input
              id="new-folder-name"
              type="text"
              required
              autoFocus
              placeholder="Folder name..."
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              className="flex-1 px-2 py-1 text-xs border border-[var(--border)] rounded bg-[var(--bg-input)] text-[var(--text-heading)] focus:border-terra"
            />
            <button
              id="btn-add-folder-submit"
              type="submit"
              className="px-2 py-1 text-xs bg-terra text-white rounded hover:opacity-90 font-medium whitespace-nowrap"
            >
              Add
            </button>
          </div>
        </form>
      )}

      <div className="flex-1 overflow-y-auto px-2 space-y-1 pb-4">
        {folders.map(folder => {
          const isCollapsed = collapsedFolders[folder.id] || false;
          const folderFiles = filteredFiles.filter(file => file.folderId === folder.id);
          const isSelectedFolder = activeFolderId === folder.id;

          return (
            <div key={folder.id} className="space-y-0.5" id={`folder-item-${folder.id}`}>
              <div 
                className={`group flex items-center justify-between px-2 py-1.5 rounded-md cursor-pointer transition-colors ${
                  isSelectedFolder 
                    ? 'bg-[var(--bg-btn-hover)] text-[var(--text-heading)]' 
                    : 'text-[var(--text-muted)] hover:text-[var(--text-heading)] hover:bg-[var(--bg-btn-hover)]'
                }`}
                onClick={() => {
                  onSelectFolder(folder.id);
                  toggleFolder(folder.id);
                }}
              >
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  {isCollapsed ? (
                    <ChevronRight className="h-3.5 w-3.5 text-[var(--text-muted)] flex-shrink-0" />
                  ) : (
                    <ChevronDown className="h-3.5 w-3.5 text-[var(--text-muted)] flex-shrink-0" />
                  )}
                  <Folder className={`h-4 w-4 flex-shrink-0 ${folder.isDefault ? 'text-[var(--text-heading)]' : 'text-[var(--text-muted)]'}`} />
                  
                  {editingFolderId === folder.id ? (
                    <input
                      id={`edit-folder-input-${folder.id}`}
                      type="text"
                      autoFocus
                      value={editingFolderName}
                      onChange={(e) => setEditingFolderName(e.target.value)}
                      onBlur={() => handleRenameFolderSubmit(folder.id)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleRenameFolderSubmit(folder.id);
                        if (e.key === 'Escape') setEditingFolderId(null);
                      }}
                      onClick={(e) => e.stopPropagation()}
                      className="flex-1 min-w-0 bg-[var(--bg-input)] border border-[var(--border)] rounded px-1 text-xs text-[var(--text-heading)] py-0"
                    />
                  ) : (
                    <span className="text-xs font-semibold tracking-tight truncate">
                      {folder.name}
                    </span>
                  )}

                  <span className="text-[10px] bg-[var(--bg-btn-hover)] text-[var(--text-muted)] px-1 rounded font-mono">
                    {getFileCountInFolder(folder.id)}
                  </span>
                </div>

                <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
                  <button
                    id={`btn-create-file-in-${folder.id}`}
                    onClick={() => {
                      setCollapsedFolders(prev => ({ ...prev, [folder.id]: false }));
                      onCreateFile(folder.id);
                    }}
                    className="p-1 text-[var(--text-muted)] hover:text-[var(--text-heading)] rounded hover:bg-[var(--bg-btn-hover)]"
                    title="Add file inside folder"
                  >
                    <FilePlus className="h-3.5 w-3.5" />
                  </button>
                  
                  {!folder.isDefault && (
                    <>
                      <button
                        id={`btn-rename-folder-${folder.id}`}
                        onClick={(e) => startRenameFolder(folder, e)}
                        className="p-1 text-[var(--text-muted)] hover:text-[var(--text-heading)] rounded hover:bg-[var(--bg-btn-hover)]"
                        title="Rename folder"
                      >
                        <Edit3 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        id={`btn-delete-folder-${folder.id}`}
                        onClick={() => {
                          if (confirm(`Are you sure you want to delete folder "${folder.name}" and all its contents? This cannot be undone.`)) {
                            onDeleteFolder(folder.id);
                          }
                        }}
                        className="p-1 text-[var(--text-muted)] hover:text-rose-500 rounded hover:bg-rose-50/50 dark:hover:bg-rose-950/20"
                        title="Delete folder and contents"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </>
                  )}
                </div>
              </div>

              {!isCollapsed && (
                <div className="pl-4 space-y-0.5 border-l border-[var(--border)] ml-3.5 mt-0.5 mb-1.5">
                  {folderFiles.length === 0 ? (
                    <div className="text-[11px] text-[var(--text-muted)] py-1 pl-1.5 italic">
                      No files
                    </div>
                  ) : (
                    folderFiles.map(file => {
                      const isSelectedFile = activeFileId === file.id;

                      return (
                        <div
                          key={file.id}
                          id={`file-item-${file.id}`}
                          className={`group/file flex items-center justify-between px-2 py-1.5 transition-all duration-150 cursor-pointer ${
                            isSelectedFile 
                              ? 'bg-[var(--bg-btn-hover)] text-[var(--text-heading)] font-medium border-l-2 border-terra pl-2 rounded-r-sm' 
                              : 'text-[var(--text-muted)] hover:text-[var(--text-heading)] hover:bg-[var(--bg-btn-hover)]'
                          }`}
                          onClick={() => onSelectFile(file.id)}
                        >
                          <div className="flex items-center gap-1.5 min-w-0 flex-1">
                            <File className={`h-3.5 w-3.5 flex-shrink-0 ${isSelectedFile ? 'text-terra' : 'text-[var(--text-muted)]'}`} />
                            
                            {editingFileId === file.id ? (
                              <input
                                id={`edit-file-input-${file.id}`}
                                type="text"
                                autoFocus
                                value={editingFileName}
                                onChange={(e) => setEditingFileName(e.target.value)}
                                onBlur={() => handleRenameFileSubmit(file.id)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') handleRenameFileSubmit(file.id);
                                  if (e.key === 'Escape') setEditingFileId(null);
                                }}
                                onClick={(e) => e.stopPropagation()}
                                className="flex-1 min-w-0 bg-[var(--bg-input)] border border-[var(--border)] rounded px-1 text-[11px] text-[var(--text-heading)] py-0"
                              />
                            ) : (
                              <span className="text-xs truncate tracking-tight">{file.name}</span>
                            )}
                          </div>

                          <div className="flex items-center gap-0.5 opacity-0 group-hover/file:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
                            <button
                              id={`btn-move-file-${file.id}`}
                              onClick={() => setMovingId(movingId === file.id ? null : file.id)}
                              className="p-0.5 text-[var(--text-muted)] hover:text-[var(--text-heading)] rounded hover:bg-[var(--bg-btn-hover)]"
                              title="Move to folder"
                            >
                              <Move className="h-3 w-3" />
                            </button>
                            <button
                              id={`btn-rename-file-${file.id}`}
                              onClick={(e) => startRenameFile(file, e)}
                              className="p-0.5 text-[var(--text-muted)] hover:text-[var(--text-heading)] rounded hover:bg-[var(--bg-btn-hover)]"
                              title="Rename file"
                            >
                              <Edit3 className="h-3 w-3" />
                            </button>
                            <button
                              id={`btn-delete-file-${file.id}`}
                              onClick={() => {
                                if (confirm(`Delete markdown file "${file.name}"?`)) {
                                  onDeleteFile(file.id);
                                }
                              }}
                              className="p-0.5 text-[var(--text-muted)] hover:text-rose-500 rounded hover:bg-rose-50/50 dark:hover:bg-rose-950/20"
                              title="Delete file"
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </div>

                          {movingId === file.id && (
                            <div className="mt-2 pt-2 border-t border-[var(--border)] space-y-1" onClick={e => e.stopPropagation()}>
                              <p className="text-[9px] text-[var(--text-muted)] mb-1">Move to folder:</p>
                              {folders.filter(f => f.id !== file.folderId).map(f => (
                                <button
                                  key={f.id}
                                  onClick={() => { onMoveFile(file.id, f.id); setMovingId(null) }}
                                  className="w-full text-left px-2 py-1 text-[10px] text-[var(--text-body)] hover:bg-[var(--bg-btn-hover)] rounded border border-[var(--border)] transition-colors cursor-pointer flex items-center space-x-1.5"
                                >
                                  <Folder size={10} className="text-terra" />
                                  <span>{f.name}</span>
                                </button>
                              ))}
                              {folders.filter(f => f.id !== file.folderId).length === 0 && (
                                <p className="text-[9px] text-[var(--text-muted)] italic">No other folders</p>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              )}
            </div>
          );
        })}

        {folders.length === 0 && (
          <div className="text-center py-8 px-4 text-xs text-[var(--text-muted)]">
            No folders found. Add a new folder above to start.
          </div>
        )}
      </div>
      </div>
    </aside>
  );
}
