/**
 * Shared editor state store (Svelte 5 runes).
 * Coordinates state between EditorLayout, BlockLibrary, PropertiesPanel, and ContentEditor.
 */

export interface ContentBlock {
  id: string;
  type: string;
  label: string;
  attrs: Record<string, unknown>;
  pos: number;
}

export interface EditorMeta {
  title: string;
  description: string;
  tags: string;
  coverImageUrl: string;
  seoTitle: string;
  seoDescription: string;
  [key: string]: unknown;
}

let blocks = $state<ContentBlock[]>([]);
let selectedBlockId = $state<string | null>(null);
let isDirty = $state(false);
let isSaving = $state(false);
let lastSaved = $state<Date | null>(null);
let meta = $state<EditorMeta>({
  title: '',
  description: '',
  tags: '',
  coverImageUrl: '',
  seoTitle: '',
  seoDescription: '',
});

export function getBlocks(): ContentBlock[] {
  return blocks;
}

export function setBlocks(newBlocks: ContentBlock[]): void {
  blocks = newBlocks;
}

export function getSelectedBlockId(): string | null {
  return selectedBlockId;
}

export function getSelectedBlock(): ContentBlock | null {
  if (!selectedBlockId) return null;
  return blocks.find((b) => b.id === selectedBlockId) ?? null;
}

export function selectBlock(id: string | null): void {
  selectedBlockId = id;
}

export function addBlock(block: ContentBlock, afterId?: string): void {
  if (afterId) {
    const idx = blocks.findIndex((b) => b.id === afterId);
    if (idx >= 0) {
      blocks = [...blocks.slice(0, idx + 1), block, ...blocks.slice(idx + 1)];
    } else {
      blocks = [...blocks, block];
    }
  } else {
    blocks = [...blocks, block];
  }
  isDirty = true;
}

export function updateBlock(id: string, updates: Partial<ContentBlock>): void {
  blocks = blocks.map((b) => (b.id === id ? { ...b, ...updates } : b));
  isDirty = true;
}

export function removeBlock(id: string): void {
  blocks = blocks.filter((b) => b.id !== id);
  if (selectedBlockId === id) selectedBlockId = null;
  isDirty = true;
}

export function moveBlock(id: string, direction: 'up' | 'down'): void {
  const idx = blocks.findIndex((b) => b.id === id);
  if (idx < 0) return;
  const newIdx = direction === 'up' ? idx - 1 : idx + 1;
  if (newIdx < 0 || newIdx >= blocks.length) return;
  const copy = [...blocks];
  [copy[idx], copy[newIdx]] = [copy[newIdx], copy[idx]];
  blocks = copy;
  isDirty = true;
}

export function duplicateBlock(id: string): void {
  const block = blocks.find((b) => b.id === id);
  if (!block) return;
  const clone: ContentBlock = {
    ...block,
    id: crypto.randomUUID(),
    label: block.label,
  };
  addBlock(clone, id);
}

export function getMeta(): EditorMeta {
  return meta;
}

export function updateMeta(updates: Partial<EditorMeta>): void {
  meta = { ...meta, ...updates };
  isDirty = true;
}

export function getIsDirty(): boolean {
  return isDirty;
}

export function setIsDirty(dirty: boolean): void {
  isDirty = dirty;
}

export function getIsSaving(): boolean {
  return isSaving;
}

export function setIsSaving(saving: boolean): void {
  isSaving = saving;
  if (!saving) {
    lastSaved = new Date();
    isDirty = false;
  }
}

export function getLastSaved(): Date | null {
  return lastSaved;
}

export function resetEditor(): void {
  blocks = [];
  selectedBlockId = null;
  isDirty = false;
  isSaving = false;
  lastSaved = null;
  meta = {
    title: '',
    description: '',
    tags: '',
    coverImageUrl: '',
    seoTitle: '',
    seoDescription: '',
  };
}
