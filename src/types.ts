/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface MarkdownFile {
  id: string;
  name: string;
  content: string;
  createdAt: number;
  updatedAt: number;
  folderId: string;
}

export interface MarkdownFolder {
  id: string;
  name: string;
  createdAt: number;
  isDefault?: boolean;
}

export type ViewMode = 'split' | 'edit' | 'preview';
