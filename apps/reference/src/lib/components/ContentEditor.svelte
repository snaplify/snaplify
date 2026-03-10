<script lang="ts" module>
  import type { BlockTuple } from '@snaplify/editor';
  export type { BlockTuple };
</script>

<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import type { Editor } from '@tiptap/core';

  let {
    content = null,
    editable = true,
    onupdate = null,
  }: {
    content?: unknown;
    editable?: boolean;
    onupdate?: ((blocks: BlockTuple[]) => void) | null;
  } = $props();

  let element: HTMLDivElement | undefined = $state();
  let editor: Editor | null = $state(null);
  let docToBlockTuplesFn: ((doc: unknown) => BlockTuple[]) | null = null;

  onMount(async () => {
    const editorModule = await import('@snaplify/editor');
    docToBlockTuplesFn = editorModule.docToBlockTuples;

    editor = editorModule.createSnaplifyEditor({
      content: Array.isArray(content) ? (content as BlockTuple[]) : undefined,
      editable,
      placeholder: 'Start writing...',
      onUpdate: onupdate ? (blocks) => onupdate(blocks) : undefined,
      element,
    });
  });

  onDestroy(() => {
    editor?.destroy();
  });

  export function getContent(): BlockTuple[] {
    if (!editor || !docToBlockTuplesFn) return [];
    return docToBlockTuplesFn(editor.state.doc);
  }
</script>

<div class="editor-wrapper" bind:this={element}></div>

<style>
  .editor-wrapper {
    min-height: 300px;
    border: 1px solid var(--color-border, #e5e5e5);
    border-radius: var(--radius-md, 6px);
    padding: var(--space-md, 1rem);
    background: var(--color-surface, #ffffff);
  }

  .editor-wrapper :global(.ProseMirror) {
    outline: none;
    min-height: 280px;
  }

  .editor-wrapper :global(.ProseMirror p.is-editor-empty:first-child::before) {
    content: attr(data-placeholder);
    color: var(--color-text-secondary, #999);
    pointer-events: none;
    float: left;
    height: 0;
  }
</style>
