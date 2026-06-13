/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useImperativeHandle, useRef, useEffect } from 'react';
import { MarkdownFile } from '../types';

interface EditorAreaProps {
  activeFile: MarkdownFile | null;
  onContentChange: (content: string) => void;
}

export interface EditorAreaRef {
  insertTextAtCursor: (textToInsert: string) => void;
  focus: () => void;
}

const EditorArea = React.forwardRef<EditorAreaRef, EditorAreaProps>(
  ({ activeFile, onContentChange }, ref) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Scroll sync or line helper placeholders
    const lineNumbers = activeFile 
      ? activeFile.content.split('\n').map((_, i) => i + 1)
      : [1];

    const handleTextareaScroll = () => {
      const textarea = textareaRef.current;
      const gutter = document.getElementById('editor-gutter');
      if (textarea && gutter) {
        gutter.scrollTop = textarea.scrollTop;
      }
    };

    // Expose insertion and focus methods to parent component
    useImperativeHandle(ref, () => ({
      insertTextAtCursor: (textToInsert: string) => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const text = textarea.value;
        const before = text.substring(0, start);
        const after = text.substring(end);
        const newValue = before + textToInsert + after;

        // Perform selection replacement
        onContentChange(newValue);

        // Re-focus and calculate new selections
        setTimeout(() => {
          if (textarea) {
            textarea.focus();
            const newCursorPos = start + textToInsert.length;
            textarea.selectionStart = newCursorPos;
            textarea.selectionEnd = newCursorPos;
          }
        }, 10);
      },
      focus: () => {
        textareaRef.current?.focus();
      }
    }));

    // Auto-focus on active file load
    useEffect(() => {
      if (activeFile && textareaRef.current) {
        textareaRef.current.focus();
      }
    }, [activeFile?.id]);

    if (!activeFile) {
      return (
        <div id="editor-empty" className="flex-1 flex flex-col items-center justify-center bg-gray-50/40 dark:bg-[#0a0b0c] text-center p-8 select-none">
          <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-gray-900 flex items-center justify-center text-gray-400 dark:text-gray-500 mb-4 animate-pulse">
            ✍️
          </div>
          <h3 className="text-sm font-display font-medium text-gray-800 dark:text-gray-300">No Document Selected</h3>
          <p className="text-xs text-gray-400 mt-1 max-w-sm">
            Select an existing file from the sidebar, create a new one, or click "Reset" to reload sample markdown tutorial templates.
          </p>
        </div>
      );
    }

    return (
      <div id="editor-interface" className="flex-1 flex bg-white dark:bg-[#0f1112] overflow-hidden relative">
        
        {/* Visual Line Number Gutter */}
        <div 
          id="editor-gutter" 
          className="w-12 bg-gray-50/50 dark:bg-[#0a0b0c]/40 border-r border-gray-100 dark:border-gray-900/50 flex-shrink-0 pt-4 flex flex-col font-mono text-xs text-gray-300 dark:text-gray-600/70 select-none overflow-hidden text-right pr-2.5 space-y-[4.5px]"
          style={{ height: '100%' }}
        >
          {lineNumbers.map((num) => (
            <div key={num} className="h-5 leading-5 w-full">
              {num}
            </div>
          ))}
        </div>

        {/* Content Input Textarea */}
        <textarea
          id="editor-textarea"
          ref={textareaRef}
          value={activeFile.content}
          onChange={(e) => onContentChange(e.target.value)}
          onScroll={handleTextareaScroll}
          placeholder="Start writing markdown... (supports bold, italic, code-blocks, lists, and tables)"
          className="flex-1 p-4 resize-none font-mono text-sm leading-6 text-gray-950 dark:text-gray-50 bg-transparent border-0 focus:ring-0 overflow-y-auto leading-relaxed outline-none h-full"
          spellCheck={true}
        />
        
        {/* Floating live editor helper tag */}
        <div className="absolute bottom-2 right-4 text-[10px] bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded px-1.5 py-0.5 text-gray-400 dark:text-gray-500 font-mono flex items-center gap-1">
          <span>MD Syntax Active</span>
        </div>
      </div>
    );
  }
);

EditorArea.displayName = 'EditorArea';

export default EditorArea;
