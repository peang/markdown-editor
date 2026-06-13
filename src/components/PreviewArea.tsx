import React, { useMemo } from 'react';
import { MarkdownFile } from '../types';
import { compileMarkdown } from '../utils/markdown';
import { FileText, Compass } from 'lucide-react';

interface PreviewAreaProps {
  activeFile: MarkdownFile | null;
}

export default function PreviewArea({ activeFile }: PreviewAreaProps) {
  const compiledHtml = useMemo(() => {
    if (!activeFile) return '';
    return compileMarkdown(activeFile.content);
  }, [activeFile?.content]);

  if (!activeFile) {
    return (
      <div id="preview-empty" className="flex-1 flex flex-col items-center justify-center bg-[var(--bg-main)] border-l border-[var(--border)] text-center p-8 select-none">
        <Compass className="h-10 w-10 text-[var(--text-muted)] mb-4 animate-bounce" />
        <h3 className="text-sm font-display font-medium text-[var(--text-heading)]">Live Preview Empty</h3>
        <p className="text-xs text-[var(--text-muted)] mt-1 max-w-sm">
          A real-time rendered preview of your markdown syntax including tables and code blocks will appear here.
        </p>
      </div>
    );
  }

  return (
    <div 
      id="preview-panel" 
      className="flex-1 flex flex-col overflow-hidden bg-[var(--bg-input)] border-l border-[var(--border)]"
    >
      <div className="flex items-center justify-between px-6 py-2.5 bg-[var(--bg-main)] border-b border-[var(--border)] select-none">
        <div className="flex items-center gap-1.5 text-xs text-[var(--text-muted)] font-mono">
          <FileText className="h-3.5 w-3.5" />
          <span>PREVIEW: <strong className="text-[var(--text-heading)] font-sans">{activeFile.name}</strong></span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-terra"></span>
          <span className="text-[10px] font-mono font-medium text-[var(--text-muted)]">Live Rendered</span>
        </div>
      </div>

      <div 
        id="preview-view-scroller" 
        className="flex-1 overflow-y-auto px-6 md:px-8 py-6 select-text max-w-none"
      >
        <div 
          className="markdown-body text-[var(--text-body)]"
          dangerouslySetInnerHTML={{ __html: compiledHtml }}
        />
      </div>
    </div>
  );
}
