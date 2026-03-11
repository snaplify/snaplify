<script lang="ts" module>
  import type { BlockTuple } from '@snaplify/editor';
  export type { BlockTuple };
</script>

<script lang="ts">
  import type { Editor } from '@tiptap/core';
  import { onMount, onDestroy } from 'svelte';
  import FloatingToolbar from './editor/FloatingToolbar.svelte';
  import SlashMenu from './editor/SlashMenu.svelte';
  import NodeMenu from './editor/NodeMenu.svelte';

  export interface BlockSelectInfo {
    type: string;
    attrs: Record<string, unknown>;
    pos: number;
  }

  let {
    content = null,
    editable = true,
    onupdate = null,
    onblockselect = null,
    class: className = '',
  }: {
    content?: unknown;
    editable?: boolean;
    onupdate?: ((blocks: BlockTuple[]) => void) | null;
    onblockselect?: ((info: BlockSelectInfo | null) => void) | null;
    class?: string;
  } = $props();

  let element: HTMLDivElement | undefined = $state();
  let editor: Editor | null = $state(null);
  let docToBlockTuplesFn: ((doc: unknown) => BlockTuple[]) | null = null;

  onMount(() => {
    import('@snaplify/editor').then((editorModule) => {
      docToBlockTuplesFn = editorModule.docToBlockTuples as (doc: unknown) => BlockTuple[];

      editor = editorModule.createSnaplifyEditor({
        content: Array.isArray(content) ? (content as BlockTuple[]) : undefined,
        editable,
        placeholder: 'Start writing... (type / for commands)',
        onUpdate: onupdate ? (blocks: BlockTuple[]) => onupdate(blocks) : undefined,
        element,
      });

      // Track block selection for PropertiesPanel
      if (onblockselect && editor) {
        editor.on('selectionUpdate', () => {
          if (!editor) return;
          const { state } = editor;
          const resolvedPos = state.selection.$from;

          // Walk up to find the nearest block-level node
          for (let d = resolvedPos.depth; d >= 0; d--) {
            const node = resolvedPos.node(d);
            const name = node.type.name;
            if (name !== 'doc' && name !== 'text') {
              onblockselect({
                type: name,
                attrs: { ...node.attrs },
                pos: resolvedPos.before(d),
              });
              return;
            }
          }
          onblockselect(null);
        });
      }
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

<div class={['content-editor', className].filter(Boolean).join(' ')}>
  <div class="editor-wrapper" bind:this={element}></div>
  {#if editable}
    <FloatingToolbar {editor} />
    <SlashMenu {editor} />
    <NodeMenu {editor} />
  {/if}
</div>

<style>
  .content-editor {
    position: relative;
  }

  .editor-wrapper {
    min-height: 300px;
  }

  .editor-wrapper :global(.ProseMirror) {
    outline: none;
    min-height: 280px;
    padding: var(--space-4, 1rem);
  }

  .editor-wrapper :global(.ProseMirror p.is-editor-empty:first-child::before) {
    content: attr(data-placeholder);
    color: var(--color-text-muted, #444440);
    pointer-events: none;
    float: left;
    height: 0;
    font-style: italic;
  }

  .editor-wrapper :global(.ProseMirror h2) {
    font-size: var(--text-xl, 1.25rem);
    font-weight: var(--font-weight-bold, 700);
    color: var(--color-text, #d8d5cf);
    margin: var(--space-6, 2rem) 0 var(--space-2, 0.5rem);
  }

  .editor-wrapper :global(.ProseMirror h3) {
    font-size: var(--text-lg, 1.125rem);
    font-weight: var(--font-weight-semibold, 600);
    color: var(--color-text, #d8d5cf);
    margin: var(--space-4, 1rem) 0 var(--space-2, 0.5rem);
  }

  .editor-wrapper :global(.ProseMirror p) {
    color: var(--color-text, #d8d5cf);
    line-height: 1.7;
    margin: 0 0 var(--space-2, 0.5rem);
  }

  .editor-wrapper :global(.ProseMirror ul),
  .editor-wrapper :global(.ProseMirror ol) {
    padding-left: var(--space-6, 2rem);
    margin: 0 0 var(--space-2, 0.5rem);
    color: var(--color-text, #d8d5cf);
  }

  .editor-wrapper :global(.ProseMirror li) {
    margin-bottom: var(--space-1, 0.25rem);
  }

  .editor-wrapper :global(.ProseMirror blockquote) {
    border-left: 3px solid var(--color-border, #272725);
    padding-left: var(--space-4, 1rem);
    margin: var(--space-3, 0.75rem) 0;
    color: var(--color-text-secondary, #888884);
    font-style: italic;
  }

  .editor-wrapper :global(.ProseMirror pre) {
    background: var(--color-surface-alt, #141413);
    border: 1px solid var(--color-border, #272725);
    border-radius: var(--radius-md, 6px);
    padding: var(--space-3, 0.75rem) var(--space-4, 1rem);
    overflow-x: auto;
    margin: var(--space-3, 0.75rem) 0;
  }

  .editor-wrapper :global(.ProseMirror pre code) {
    font-family: var(--font-mono, monospace);
    font-size: var(--text-sm, 0.875rem);
    color: var(--color-text, #d8d5cf);
    background: none;
    padding: 0;
  }

  .editor-wrapper :global(.ProseMirror code) {
    font-family: var(--font-mono, monospace);
    font-size: 0.9em;
    background: var(--color-surface-alt, #141413);
    padding: 0.15em 0.3em;
    border-radius: var(--radius-sm, 4px);
    color: var(--color-accent, #f59e0b);
  }

  .editor-wrapper :global(.ProseMirror hr) {
    border: none;
    border-top: 1px solid var(--color-border, #272725);
    margin: var(--space-6, 2rem) 0;
  }

  .editor-wrapper :global(.ProseMirror a) {
    color: var(--color-primary, #5b9cf6);
    text-decoration: underline;
    text-underline-offset: 2px;
  }

  .editor-wrapper :global(.ProseMirror s) {
    text-decoration: line-through;
    color: var(--color-text-secondary, #888884);
  }

  .editor-wrapper :global(.ProseMirror strong) {
    font-weight: var(--font-weight-bold, 700);
  }

  .editor-wrapper :global(.ProseMirror img) {
    max-width: 100%;
    border-radius: var(--radius-md, 6px);
    margin: var(--space-3, 0.75rem) 0;
  }

  /* Callout blocks */
  .editor-wrapper :global(.ProseMirror .callout) {
    border-left: 4px solid var(--color-primary, #5b9cf6);
    background: var(--color-surface-alt, #141413);
    border-radius: var(--radius-md, 6px);
    padding: var(--space-3, 0.75rem) var(--space-4, 1rem);
    margin: var(--space-3, 0.75rem) 0;
  }

  .editor-wrapper :global(.ProseMirror .callout-info) {
    border-left-color: var(--color-info, #3b82f6);
  }

  .editor-wrapper :global(.ProseMirror .callout-tip) {
    border-left-color: var(--color-success, #22c55e);
  }

  .editor-wrapper :global(.ProseMirror .callout-warning) {
    border-left-color: var(--color-warning, #f59e0b);
  }

  .editor-wrapper :global(.ProseMirror .callout-danger) {
    border-left-color: var(--color-error, #ef4444);
  }

  .editor-wrapper :global(.ProseMirror .callout p) {
    margin: 0;
  }

  /* Image placeholder (empty src) */
  .editor-wrapper :global(.ProseMirror img[src=""]) {
    display: block;
    width: 100%;
    height: 120px;
    background: var(--color-surface-alt, #141413);
    border: 2px dashed var(--color-border, #272725);
    border-radius: var(--radius-md, 6px);
  }
</style>
