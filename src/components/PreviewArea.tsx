/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo } from 'react';
import { MarkdownFile } from '../types';
import { compileMarkdown } from '../utils/markdown';
import { FileText, Compass } from 'lucide-react';

interface PreviewAreaProps {
  activeFile: MarkdownFile | null;
}

export default function PreviewArea({ activeFile }: PreviewAreaProps) {
  // Memoize markdown compiler to prevent unnecessary re-computations
  const compiledHtml = useMemo(() => {
    if (!activeFile) return '';
    return compileMarkdown(activeFile.content);
  }, [activeFile?.content]);

  if (!activeFile) {
    return (
      <div id="preview-empty" className="flex-1 flex flex-col items-center justify-center bg-gray-50/20 dark:bg-[#08090a] border-l border-gray-100 dark:border-gray-900/40 text-center p-8 select-none">
        <Compass className="h-10 w-10 text-gray-300 dark:text-gray-600 mb-4 animate-bounce" />
        <h3 className="text-sm font-display font-medium text-gray-800 dark:text-gray-300">Live Preview Empty</h3>
        <p className="text-xs text-gray-400 mt-1 max-w-sm">
          A real-time rendered preview of your markdown syntax including tables and code blocks will appear here.
        </p>
      </div>
    );
  }

  return (
    <div 
      id="preview-panel" 
      className="flex-1 flex flex-col overflow-hidden bg-white dark:bg-[#0a0b0c] border-l border-gray-100 dark:border-gray-900/40"
    >
      {/* Header Tag showing preview state */}
      <div className="flex items-center justify-between px-6 py-2.5 bg-gray-50/40 dark:bg-[#0c0d0e]/60 border-b border-gray-100 dark:border-gray-900/60 select-none">
        <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 font-mono">
          <FileText className="h-3.5 w-3.5" />
          <span>PREVIEW: <strong className="text-gray-700 dark:text-gray-300 font-sans">{activeFile.name}</strong></span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
          <span className="text-[10px] font-mono font-medium text-gray-400">Live Rendered</span>
        </div>
      </div>

      {/* Styled Markdown Output */}
      <div 
        id="preview-view-scroller" 
        className="flex-1 overflow-y-auto px-6 md:px-8 py-6 select-text max-w-none"
      >
        <div 
          className="markdown-body text-gray-800 dark:text-gray-200"
          dangerouslySetInnerHTML={{ __html: compiledHtml }}
        />
      </div>
    </div>
  );
}
