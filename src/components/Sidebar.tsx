/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

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
}: SidebarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [collapsedFolders, setCollapsedFolders] = useState<Record<string, boolean>>({});
  
  // Folder/File renaming inline states
  const [editingFolderId, setEditingFolderId] = useState<string | null>(null);
  const [editingFolderName, setEditingFolderName] = useState('');
  const [editingFileId, setEditingFileId] = useState<string | null>(null);
  const [editingFileName, setEditingFileName] = useState('');

  // New folder input modal or toggle state
  const [showNewFolderInput, setShowNewFolderInput] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');

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
    if (folder.isDefault) return; // Prevent renaming default folder
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
      // Append .md if not present
      let finalName = editingFileName.trim();
      if (!finalName.endsWith('.md') && !finalName.includes('.')) {
        finalName += '.md';
      }
      onRenameFile(fileId, finalName);
    }
    setEditingFileId(null);
  };

  // Filter files by search query (checks filename & markdown content)
  const filteredFiles = files.filter(file => {
    const term = searchQuery.toLowerCase();
    return file.name.toLowerCase().includes(term) || file.content.toLowerCase().includes(term);
  });

  // Calculate file counts for each folder
  const getFileCountInFolder = (folderId: string) => {
    return files.filter(f => f.folderId === folderId).length;
  };

  return (
    <aside id="sidebar-container" className="w-80 flex-shrink-0 border-r border-gray-100 dark:border-gray-800 bg-white dark:bg-[#0c0d0e] flex flex-col h-full overflow-hidden select-none">
      {/* Sidebar Header & Brand Name */}
      <div className="p-4 border-b border-gray-50 dark:border-gray-900/60 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gray-950 dark:bg-white flex items-center justify-center text-white dark:text-black font-display font-bold text-lg leading-none shadow-sm">
            M
          </div>
          <div>
            <h1 className="font-display font-semibold text-gray-900 dark:text-white tracking-tight leading-none text-base">LiteMark</h1>
            <span className="text-[10px] font-mono font-medium text-gray-400">FAST & OFFLINE-FIRST</span>
          </div>
        </div>
      </div>

      {/* Live Search and Filters */}
      <div className="px-4 py-3 border-b border-gray-50 dark:border-gray-900/30">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
          <input
            id="sidebar-search-input"
            type="text"
            placeholder="Search notes / contents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-8 py-2 text-xs text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-900/60 border border-gray-200/50 dark:border-gray-800 rounded-md placeholder-gray-400 focus:border-gray-400 dark:focus:border-gray-700 transition-colors"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-2.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Directory & Actions Container */}
      <div className="p-3 flex items-center justify-between">
        <span className="text-[11px] font-mono font-bold tracking-wider text-gray-400 uppercase">Documents</span>
        
        {/* Toggle Folder Creator */}
        <button
          id="btn-new-folder"
          onClick={() => setShowNewFolderInput(prev => !prev)}
          className="flex items-center gap-1.5 px-2 py-1 text-xs font-medium text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-white rounded hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors"
          title="New Folder"
        >
          <FolderPlus className="h-4 w-4" />
          <span className="text-[11px]">Folder</span>
        </button>
      </div>

      {/* Inline New Folder Creator Input */}
      {showNewFolderInput && (
        <form onSubmit={handleCreateFolderSubmit} className="mx-3 mb-2 p-2 bg-gray-50 dark:bg-gray-900/20 border border-gray-100 dark:border-gray-900 rounded-md">
          <div className="flex gap-1.5">
            <input
              id="new-folder-name"
              type="text"
              required
              autoFocus
              placeholder="Folder name..."
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              className="flex-1 px-2 py-1 text-xs border border-gray-200 dark:border-gray-800 rounded bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 focus:border-gray-400 dark:focus:border-gray-700"
            />
            <button
              id="btn-add-folder-submit"
              type="submit"
              className="px-2 py-1 text-xs bg-gray-900 dark:bg-white text-white dark:text-black rounded hover:opacity-90 font-medium whitespace-nowrap"
            >
              Add
            </button>
          </div>
        </form>
      )}

      {/* Folders and Files Hierarchy */}
      <div className="flex-1 overflow-y-auto px-2 space-y-1 pb-4">
        {folders.map(folder => {
          const isCollapsed = collapsedFolders[folder.id] || false;
          const folderFiles = filteredFiles.filter(file => file.folderId === folder.id);
          const isSelectedFolder = activeFolderId === folder.id;

          return (
            <div key={folder.id} className="space-y-0.5" id={`folder-item-${folder.id}`}>
              {/* Folder Row Header */}
              <div 
                className={`group flex items-center justify-between px-2 py-1.5 rounded-md cursor-pointer transition-colors ${
                  isSelectedFolder 
                    ? 'bg-gray-100/50 dark:bg-gray-950/40 text-gray-950 dark:text-white' 
                    : 'text-gray-500 hover:text-gray-950 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-50/50 dark:hover:bg-gray-900/10'
                }`}
                onClick={() => {
                  onSelectFolder(folder.id);
                  toggleFolder(folder.id);
                }}
              >
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  {isCollapsed ? (
                    <ChevronRight className="h-3.5 w-3.5 text-gray-400 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="h-3.5 w-3.5 text-gray-400 flex-shrink-0" />
                  )}
                  <Folder className={`h-4 w-4 flex-shrink-0 ${folder.isDefault ? 'text-gray-900 dark:text-white' : 'text-gray-400'}`} />
                  
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
                      className="flex-1 min-w-0 bg-white dark:bg-gray-950 border border-gray-300 dark:border-gray-800 rounded px-1 text-xs text-gray-900 dark:text-gray-100 py-0"
                    />
                  ) : (
                    <span className="text-xs font-semibold tracking-tight truncate">
                      {folder.name}
                    </span>
                  )}

                  <span className="text-[10px] bg-gray-100 dark:bg-gray-800 text-gray-400 px-1 rounded font-mono">
                    {getFileCountInFolder(folder.id)}
                  </span>
                </div>

                {/* Folder Row Actions */}
                <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
                  <button
                    id={`btn-create-file-in-${folder.id}`}
                    onClick={() => {
                      // Expand folder when adding file to make sure it is shown!
                      setCollapsedFolders(prev => ({ ...prev, [folder.id]: false }));
                      onCreateFile(folder.id);
                    }}
                    className="p-1 text-gray-400 hover:text-black dark:hover:text-white rounded hover:bg-gray-100 dark:hover:bg-gray-800"
                    title="Add file inside folder"
                  >
                    <FilePlus className="h-3.5 w-3.5" />
                  </button>
                  
                  {!folder.isDefault && (
                    <>
                      <button
                        id={`btn-rename-folder-${folder.id}`}
                        onClick={(e) => startRenameFolder(folder, e)}
                        className="p-1 text-gray-400 hover:text-black dark:hover:text-white rounded hover:bg-gray-100 dark:hover:bg-gray-800"
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
                        className="p-1 text-gray-400 hover:text-rose-500 rounded hover:bg-rose-50/50 dark:hover:bg-rose-950/20"
                        title="Delete folder and contents"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Children Files */}
              {!isCollapsed && (
                <div className="pl-4 space-y-0.5 border-l border-gray-200 dark:border-gray-800 ml-3.5 mt-0.5 mb-1.5">
                  {folderFiles.length === 0 ? (
                    <div className="text-[11px] text-gray-400 py-1 pl-1.5 italic">
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
                              ? 'bg-gray-100/70 dark:bg-gray-800/40 text-gray-950 dark:text-white font-medium border-l-2 border-gray-900 dark:border-white pl-2 rounded-r-sm' 
                              : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-50/50 dark:hover:bg-gray-900/10'
                          }`}
                          onClick={() => onSelectFile(file.id)}
                        >
                          <div className="flex items-center gap-1.5 min-w-0 flex-1">
                            <File className={`h-3.5 w-3.5 flex-shrink-0 ${isSelectedFile ? 'text-gray-900 dark:text-gray-100' : 'text-gray-400'}`} />
                            
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
                                className="flex-1 min-w-0 bg-white dark:bg-gray-950 border border-gray-300 dark:border-gray-800 rounded px-1 text-[11px] text-gray-900 dark:text-gray-100 py-0"
                              />
                            ) : (
                              <span className="text-xs truncate tracking-tight">{file.name}</span>
                            )}
                          </div>

                          {/* File Actions */}
                          <div className="flex items-center gap-0.5 opacity-0 group-hover/file:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
                            <button
                              id={`btn-rename-file-${file.id}`}
                              onClick={(e) => startRenameFile(file, e)}
                              className="p-0.5 text-gray-400 hover:text-black dark:hover:text-white rounded hover:bg-gray-200 dark:hover:bg-gray-800"
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
                              className="p-0.5 text-gray-400 hover:text-rose-500 rounded hover:bg-rose-50/50 dark:hover:bg-rose-950/20"
                              title="Delete file"
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              )}
            </div>
          );
        })}

        {/* Workspace empty state */}
        {folders.length === 0 && (
          <div className="text-center py-8 px-4 text-xs text-gray-400">
            No folders found. Add a new folder above to start.
          </div>
        )}
      </div>

      {/* Dynamic Local Storage footprint indicator */}
      <div className="p-4 border-t border-gray-100 dark:border-gray-900 bg-gray-50/60 dark:bg-gray-950/20">
        <div className="flex items-center justify-between text-[10px] text-gray-400 font-semibold uppercase tracking-wider">
          <span>Storage Status</span>
          <span className="font-mono text-gray-500">
            {(() => {
              const strLength = JSON.stringify(folders).length + JSON.stringify(files).length;
              const usedKB = Math.round((strLength * 2) / 10.24) / 100;
              return `${usedKB.toFixed(2)} KB / 5.0 MB`;
            })()}
          </span>
        </div>
        <div className="w-full h-1 bg-gray-200 dark:bg-gray-800 rounded-full mt-2 overflow-hidden">
          <div 
            className="bg-gray-800 dark:bg-gray-400 h-full rounded-full transition-all duration-300" 
            style={{ 
              width: `${Math.min(100, Math.max(2, ( (JSON.stringify(folders).length + JSON.stringify(files).length) / (5 * 1024 * 1024) ) * 100))}%` 
            }}
          ></div>
        </div>
        <div className="text-[10px] text-gray-400 dark:text-gray-500 mt-1.5 font-mono flex items-center justify-between">
          <span>Active Persistence</span>
          <span>100% Offline SAFE</span>
        </div>
      </div>
    </aside>
  );
}
