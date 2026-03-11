<script lang="ts">
  import type { Editor } from '@tiptap/core';

  let { editor }: { editor: Editor | null } = $props();

  let visible = $state(false);
  let position = $state({ top: 0, left: 0 });
  let selectedIndex = $state(0);
  let slashPos = $state(-1);
  let filterText = $state('');

  const allItems = [
    { type: 'paragraph', label: 'Text', description: 'Plain text block', keywords: 'text paragraph' },
    { type: 'heading2', label: 'Heading 2', description: 'Medium heading', keywords: 'heading h2 title' },
    { type: 'heading3', label: 'Heading 3', description: 'Small heading', keywords: 'heading h3 subtitle' },
    { type: 'codeBlock', label: 'Code Block', description: 'Syntax-highlighted code', keywords: 'code pre snippet' },
    { type: 'blockquote', label: 'Quote', description: 'Blockquote with attribution', keywords: 'quote blockquote citation' },
    { type: 'callout', label: 'Callout', description: 'Info, tip, warning, or danger box', keywords: 'callout alert note info tip warning danger' },
    { type: 'image', label: 'Image', description: 'Image with alt text & caption', keywords: 'image picture photo' },
    { type: 'bulletList', label: 'Bullet List', description: 'Unordered list', keywords: 'list bullet unordered ul' },
    { type: 'orderedList', label: 'Numbered List', description: 'Ordered list', keywords: 'list numbered ordered ol' },
    { type: 'horizontalRule', label: 'Divider', description: 'Horizontal rule', keywords: 'divider horizontal rule separator hr' },
  ];

  let filteredItems = $derived(
    filterText
      ? allItems.filter((item) => {
          const q = filterText.toLowerCase();
          return (
            item.label.toLowerCase().includes(q) ||
            item.description.toLowerCase().includes(q) ||
            item.keywords.includes(q)
          );
        })
      : allItems,
  );

  $effect(() => {
    if (!editor) return;

    const handleTransaction = () => {
      if (!editor) return;
      const { state } = editor;
      const resolvedPos = state.selection.$from;

      const textBefore = resolvedPos.parent.textContent.slice(0, resolvedPos.parentOffset);
      if (textBefore.startsWith('/')) {
        slashPos = resolvedPos.pos - textBefore.length;
        filterText = textBefore.slice(1);
        const coords = editor.view.coordsAtPos(resolvedPos.pos);
        position = { top: coords.bottom + 4, left: coords.left - (filterText.length * 7) };
        if (!visible) selectedIndex = 0;
        visible = true;
      } else if (visible) {
        visible = false;
        filterText = '';
      }
    };

    editor.on('transaction', handleTransaction);
    return () => {
      editor!.off('transaction', handleTransaction);
    };
  });

  // Reset selection when filter changes
  $effect(() => {
    // Access filteredItems to track it
    if (filteredItems.length > 0 && selectedIndex >= filteredItems.length) {
      selectedIndex = 0;
    }
  });

  function selectItem(index: number) {
    if (!editor) return;
    const item = filteredItems[index];
    if (!item) return;

    // Delete the slash + any filter text
    const deleteEnd = slashPos + 1 + filterText.length;
    editor.chain().focus().deleteRange({ from: slashPos, to: deleteEnd }).run();

    const cmd = editor.chain().focus() as unknown as Record<string, (...args: unknown[]) => { run: () => void }>;

    switch (item.type) {
      case 'paragraph':
        cmd.setParagraph().run();
        break;
      case 'heading2':
        editor.chain().focus().toggleHeading({ level: 2 }).run();
        break;
      case 'heading3':
        editor.chain().focus().toggleHeading({ level: 3 }).run();
        break;
      case 'codeBlock':
        editor.chain().focus().toggleCodeBlock().run();
        break;
      case 'blockquote':
        editor.chain().focus().toggleBlockquote().run();
        break;
      case 'callout':
        cmd.setCallout({ variant: 'info' }).run();
        break;
      case 'image':
        cmd.setImage({ src: '', alt: '' }).run();
        break;
      case 'bulletList':
        cmd.toggleBulletList().run();
        break;
      case 'orderedList':
        cmd.toggleOrderedList().run();
        break;
      case 'horizontalRule':
        cmd.setHorizontalRule().run();
        break;
    }

    visible = false;
    filterText = '';
  }

  function handleKeydown(e: KeyboardEvent) {
    if (!visible) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      selectedIndex = (selectedIndex + 1) % filteredItems.length;
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      selectedIndex = (selectedIndex - 1 + filteredItems.length) % filteredItems.length;
    } else if (e.key === 'Enter') {
      e.preventDefault();
      selectItem(selectedIndex);
    } else if (e.key === 'Escape') {
      visible = false;
      filterText = '';
    }
  }
</script>

<svelte:window onkeydown={handleKeydown} />

{#if visible && filteredItems.length > 0}
  <div
    class="slash-menu"
    style="top: {position.top}px; left: {position.left}px;"
    role="listbox"
    aria-label="Insert block"
  >
    {#if filterText}
      <div class="slash-menu-filter">
        <span class="filter-prefix">/</span>{filterText}
      </div>
    {/if}
    {#each filteredItems as item, i}
      <button
        class="slash-menu-item"
        class:selected={i === selectedIndex}
        role="option"
        aria-selected={i === selectedIndex}
        onclick={() => selectItem(i)}
        onmouseenter={() => (selectedIndex = i)}
      >
        <span class="item-label">{item.label}</span>
        <span class="item-description">{item.description}</span>
      </button>
    {/each}
  </div>
{/if}

<style>
  .slash-menu {
    position: fixed;
    display: flex;
    flex-direction: column;
    min-width: 240px;
    max-height: 320px;
    overflow-y: auto;
    background: var(--color-surface, #0c0c0b);
    border: 1px solid var(--color-border, #272725);
    border-radius: var(--radius-md, 6px);
    box-shadow: var(--shadow-lg, 0 8px 24px rgba(0, 0, 0, 0.25));
    padding: var(--space-1, 0.25rem);
    z-index: 50;
  }

  .slash-menu-filter {
    padding: var(--space-1, 0.25rem) var(--space-3, 0.75rem);
    font-family: var(--font-mono, monospace);
    font-size: var(--text-xs, 0.75rem);
    color: var(--color-text-muted, #444440);
    border-bottom: 1px solid var(--color-border, #272725);
    margin-bottom: var(--space-1, 0.25rem);
  }

  .filter-prefix {
    color: var(--color-text-secondary, #888884);
  }

  .slash-menu-item {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: var(--space-2, 0.5rem) var(--space-3, 0.75rem);
    border: none;
    border-radius: var(--radius-sm, 4px);
    background: transparent;
    cursor: pointer;
    text-align: left;
    width: 100%;
  }

  .slash-menu-item:hover,
  .slash-menu-item.selected {
    background: var(--color-surface-hover, #1c1c1a);
  }

  .item-label {
    font-weight: var(--font-weight-medium, 500);
    color: var(--color-text, #d8d5cf);
    font-size: var(--text-sm, 0.875rem);
  }

  .item-description {
    font-size: var(--text-xs, 0.75rem);
    color: var(--color-text-secondary, #888884);
  }
</style>
