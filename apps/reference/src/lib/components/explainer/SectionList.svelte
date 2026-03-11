<script lang="ts">
  import type { ExplainerSection } from '@snaplify/explainer';

  let {
    sections = [],
    activeIndex = 0,
    onselect,
    onadd,
    onremove,
    onmoveup,
    onmovedown,
  }: {
    sections: ExplainerSection[];
    activeIndex: number;
    onselect?: (index: number) => void;
    onadd?: (type: string) => void;
    onremove?: (index: number) => void;
    onmoveup?: (index: number) => void;
    onmovedown?: (index: number) => void;
  } = $props();
</script>

<div class="sl">
  <div class="sl-header">
    <span class="sl-title">Structure</span>
    <span class="sl-count">{sections.length}</span>
  </div>

  <div class="sl-scroll">
    {#each sections as section, i}
      <button
        class="sl-item"
        class:sl-item-active={i === activeIndex}
        onclick={() => onselect?.(i)}
        aria-label="Edit section: {section.title}"
        aria-current={i === activeIndex ? 'step' : undefined}
      >
        <span class="sl-item-num">{String(i + 1).padStart(2, '0')}</span>
        <div class="sl-item-info">
          <span class="sl-item-type">{section.type}</span>
          <span class="sl-item-name">{section.title || 'Untitled'}</span>
        </div>

        {#if i === activeIndex}
          <div class="sl-item-actions">
            <button
              class="sl-act"
              onclick={(e) => { e.stopPropagation(); onmoveup?.(i); }}
              disabled={i === 0}
              aria-label="Move up"
              title="Move up"
            >
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M5 1v8M5 1L2 4M5 1l3 3" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </button>
            <button
              class="sl-act"
              onclick={(e) => { e.stopPropagation(); onmovedown?.(i); }}
              disabled={i === sections.length - 1}
              aria-label="Move down"
              title="Move down"
            >
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M5 9V1M5 9L2 6M5 9l3-3" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </button>
            <button
              class="sl-act sl-act-danger"
              onclick={(e) => { e.stopPropagation(); onremove?.(i); }}
              aria-label="Remove section"
              title="Remove"
            >
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 3h6M3.5 3V2h3v1M3 3v5.5a.5.5 0 00.5.5h3a.5.5 0 00.5-.5V3" stroke="currentColor" stroke-width="1.1" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </button>
          </div>
        {/if}
      </button>
    {/each}

    {#if sections.length === 0}
      <p class="sl-empty">No sections yet.</p>
    {/if}
  </div>

  <div class="sl-add">
    <span class="sl-add-label">Add Section</span>
    <div class="sl-add-btns">
      <button class="sl-add-btn" onclick={() => onadd?.('text')}>
        <span class="sl-add-icon">TXT</span>
        <span class="sl-add-text">Text</span>
      </button>
      <button class="sl-add-btn" onclick={() => onadd?.('quiz')}>
        <span class="sl-add-icon">QIZ</span>
        <span class="sl-add-text">Quiz</span>
      </button>
      <button class="sl-add-btn" onclick={() => onadd?.('checkpoint')}>
        <span class="sl-add-icon">CKP</span>
        <span class="sl-add-text">Gate</span>
      </button>
    </div>
  </div>
</div>

<style>
  .sl {
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  .sl-header {
    display: flex;
    align-items: center;
    gap: var(--space-2, 0.5rem);
    padding: var(--space-3, 0.75rem);
    border-bottom: 1px solid var(--color-border, #272725);
  }

  .sl-title {
    font-family: var(--font-mono, monospace);
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--color-text-secondary, #888884);
  }

  .sl-count {
    font-family: var(--font-mono, monospace);
    font-size: 9px;
    color: var(--color-text-muted, #444440);
    background: var(--color-surface-alt, #141413);
    padding: 1px 5px;
    border-radius: var(--radius-sm, 4px);
    border: 1px solid var(--color-border, #272725);
  }

  .sl-scroll {
    flex: 1;
    overflow-y: auto;
    padding: var(--space-2, 0.5rem);
  }

  /* Section items */
  .sl-item {
    display: flex;
    align-items: center;
    gap: var(--space-2, 0.5rem);
    width: 100%;
    padding: var(--space-2, 0.5rem);
    border: none;
    border-left: 2px solid transparent;
    border-radius: var(--radius-sm, 4px);
    background: transparent;
    color: var(--color-text-secondary, #888884);
    cursor: pointer;
    text-align: left;
    margin-bottom: 1px;
  }

  .sl-item:hover:not(.sl-item-active) {
    background: var(--color-surface-alt, #141413);
    color: var(--color-text, #d8d5cf);
  }

  .sl-item-active {
    background: var(--color-surface-alt, #141413);
    color: var(--color-text, #d8d5cf);
    border-left-color: var(--color-primary, #5b9cf6);
  }

  .sl-item-num {
    font-family: var(--font-mono, monospace);
    font-size: 9px;
    color: var(--color-text-muted, #444440);
    flex-shrink: 0;
    width: 16px;
  }

  .sl-item-info {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 1px;
  }

  .sl-item-type {
    font-family: var(--font-mono, monospace);
    font-size: 9px;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--color-primary, #5b9cf6);
  }

  .sl-item-name {
    font-size: var(--text-xs, 0.75rem);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  /* Action buttons on active item */
  .sl-item-actions {
    display: flex;
    gap: 1px;
    flex-shrink: 0;
  }

  .sl-act {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 18px;
    border: none;
    border-radius: 2px;
    background: transparent;
    color: var(--color-text-muted, #444440);
    cursor: pointer;
    padding: 0;
  }

  .sl-act:hover {
    color: var(--color-text, #d8d5cf);
    background: var(--color-surface, #0c0c0b);
  }

  .sl-act:disabled {
    opacity: 0.25;
    cursor: not-allowed;
  }

  .sl-act-danger:hover {
    color: var(--color-error, #f87171);
    background: rgba(248, 113, 113, 0.08);
  }

  .sl-empty {
    font-size: var(--text-xs, 0.75rem);
    color: var(--color-text-muted, #444440);
    text-align: center;
    padding: var(--space-4, 1rem) 0;
    margin: 0;
  }

  /* Add section controls */
  .sl-add {
    padding: var(--space-2, 0.5rem);
    border-top: 1px solid var(--color-border, #272725);
  }

  .sl-add-label {
    display: block;
    font-family: var(--font-mono, monospace);
    font-size: 9px;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--color-text-muted, #444440);
    margin-bottom: var(--space-2, 0.5rem);
  }

  .sl-add-btns {
    display: flex;
    gap: 4px;
  }

  .sl-add-btn {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 3px;
    padding: var(--space-2, 0.5rem) var(--space-1, 0.25rem);
    border: 1px solid var(--color-border, #272725);
    border-radius: var(--radius-sm, 4px);
    background: transparent;
    color: var(--color-text-secondary, #888884);
    cursor: pointer;
  }

  .sl-add-btn:hover {
    color: var(--color-primary, #5b9cf6);
    border-color: var(--color-primary, #5b9cf6);
    background: rgba(91, 156, 246, 0.06);
  }

  .sl-add-icon {
    font-family: var(--font-mono, monospace);
    font-size: 9px;
    font-weight: 700;
    letter-spacing: 0.04em;
    color: var(--color-primary, #5b9cf6);
  }

  .sl-add-text {
    font-size: 9px;
  }
</style>
