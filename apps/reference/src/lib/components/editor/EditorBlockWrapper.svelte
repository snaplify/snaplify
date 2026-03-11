<script lang="ts">
  import type { Snippet } from 'svelte';

  let {
    blockId,
    blockType = 'Text',
    selected = false,
    children,
    onselect,
    ondelete,
    onmoveup,
    onmovedown,
    onduplicate,
    oninsertafter,
  }: {
    blockId: string;
    blockType?: string;
    selected?: boolean;
    children: Snippet;
    onselect?: () => void;
    ondelete?: () => void;
    onmoveup?: () => void;
    onmovedown?: () => void;
    onduplicate?: () => void;
    oninsertafter?: () => void;
  } = $props();

  let hovered = $state(false);
  let showControls = $derived(hovered || selected);
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
  class="block-wrap"
  class:block-wrap-hover={hovered && !selected}
  class:block-wrap-selected={selected}
  data-block-id={blockId}
  onmouseenter={() => (hovered = true)}
  onmouseleave={() => (hovered = false)}
  onclick={onselect}
>
  <!-- Drag handle (left) -->
  {#if showControls}
    <div class="block-handle" aria-hidden="true">
      <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
        <circle cx="4" cy="2" r="1.2"/><circle cx="8" cy="2" r="1.2"/>
        <circle cx="4" cy="6" r="1.2"/><circle cx="8" cy="6" r="1.2"/>
        <circle cx="4" cy="10" r="1.2"/><circle cx="8" cy="10" r="1.2"/>
      </svg>
    </div>
  {/if}

  <!-- Type badge (top-right) -->
  {#if showControls}
    <span class="block-type-badge">{blockType}</span>
  {/if}

  <!-- Toolbar (top-right, after badge) -->
  {#if showControls}
    <div class="block-toolbar" role="toolbar" aria-label="Block actions">
      <button class="bt-btn" onclick={(e) => { e.stopPropagation(); onmoveup?.(); }} aria-label="Move up" title="Move up">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M6 2v8M6 2L3 5M6 2l3 3" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </button>
      <button class="bt-btn" onclick={(e) => { e.stopPropagation(); onmovedown?.(); }} aria-label="Move down" title="Move down">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M6 10V2M6 10l-3-3M6 10l3-3" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </button>
      <button class="bt-btn" onclick={(e) => { e.stopPropagation(); onduplicate?.(); }} aria-label="Duplicate" title="Duplicate">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><rect x="1" y="3" width="7" height="7" rx="1" stroke="currentColor" stroke-width="1.1"/><path d="M4 3V2a1 1 0 011-1h5a1 1 0 011 1v5a1 1 0 01-1 1H9" stroke="currentColor" stroke-width="1.1"/></svg>
      </button>
      <button class="bt-btn bt-btn-danger" onclick={(e) => { e.stopPropagation(); ondelete?.(); }} aria-label="Delete block" title="Delete">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 3h8M4 3V2h4v1M3 3v7a1 1 0 001 1h4a1 1 0 001-1V3" stroke="currentColor" stroke-width="1.1" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </button>
    </div>
  {/if}

  <!-- Block content -->
  <div class="block-content">
    {@render children()}
  </div>

  <!-- Insert line (below block) -->
  {#if hovered}
    <div class="block-insert-zone">
      <div class="block-insert-line"></div>
      <button class="block-insert-btn" onclick={(e) => { e.stopPropagation(); oninsertafter?.(); }} aria-label="Insert block below">
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M5 1v8M1 5h8" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg>
      </button>
      <div class="block-insert-line"></div>
    </div>
  {/if}
</div>

<style>
  .block-wrap {
    position: relative;
    border: 1.5px solid transparent;
    border-radius: var(--radius-md, 6px);
    padding: var(--space-3, 0.75rem);
    margin-bottom: var(--space-1, 0.25rem);
    transition: border-color 0.12s ease, background 0.12s ease;
  }

  .block-wrap-hover {
    border-color: var(--color-border, #272725);
  }

  .block-wrap-selected {
    border-color: var(--color-primary, #5b9cf6);
    background: rgba(91, 156, 246, 0.03);
  }

  /* Drag handle */
  .block-handle {
    position: absolute;
    left: -28px;
    top: 50%;
    transform: translateY(-50%);
    width: 20px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--color-text-muted, #444440);
    cursor: grab;
    border-radius: var(--radius-sm, 4px);
  }

  .block-handle:hover {
    color: var(--color-text-secondary, #888884);
    background: var(--color-surface-alt, #141413);
  }

  /* Type badge */
  .block-type-badge {
    position: absolute;
    top: -8px;
    right: 48px;
    font-family: var(--font-mono, monospace);
    font-size: 9px;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--color-text-muted, #444440);
    background: var(--color-surface, #0c0c0b);
    padding: 1px 6px;
    border-radius: var(--radius-sm, 4px);
    border: 1px solid var(--color-border, #272725);
  }

  /* Toolbar */
  .block-toolbar {
    position: absolute;
    top: -8px;
    right: 4px;
    display: flex;
    gap: 1px;
    background: var(--color-surface, #0c0c0b);
    border: 1px solid var(--color-border, #272725);
    border-radius: var(--radius-sm, 4px);
    padding: 1px;
  }

  .bt-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 22px;
    height: 18px;
    border: none;
    border-radius: 2px;
    background: transparent;
    color: var(--color-text-muted, #444440);
    cursor: pointer;
  }

  .bt-btn:hover {
    color: var(--color-text, #d8d5cf);
    background: var(--color-surface-alt, #141413);
  }

  .bt-btn-danger:hover {
    color: var(--color-error, #f87171);
    background: rgba(248, 113, 113, 0.08);
  }

  /* Block content */
  .block-content {
    min-height: 1.5em;
  }

  /* Insert zone */
  .block-insert-zone {
    display: flex;
    align-items: center;
    gap: var(--space-2, 0.5rem);
    padding-top: var(--space-2, 0.5rem);
    opacity: 0;
    transition: opacity 0.15s ease;
  }

  .block-wrap:hover .block-insert-zone {
    opacity: 1;
  }

  .block-insert-line {
    flex: 1;
    height: 1px;
    background: var(--color-border, #272725);
  }

  .block-insert-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
    border-radius: var(--radius-full, 50%);
    border: 1px solid var(--color-border, #272725);
    background: var(--color-surface, #0c0c0b);
    color: var(--color-text-muted, #444440);
    cursor: pointer;
    flex-shrink: 0;
  }

  .block-insert-btn:hover {
    color: var(--color-primary, #5b9cf6);
    border-color: var(--color-primary, #5b9cf6);
    background: rgba(91, 156, 246, 0.08);
  }
</style>
