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

  let addType = $state<string>('text');
</script>

<div class="section-list">
  <h3 class="section-list__title">Sections</h3>

  <ol class="section-list__items">
    {#each sections as section, i}
      <li class="section-list__item" class:section-list__item--active={i === activeIndex}>
        <button
          class="section-list__select"
          onclick={() => onselect?.(i)}
          aria-label="Edit section: {section.title}"
          aria-current={i === activeIndex ? 'step' : undefined}
        >
          <span class="section-list__type">{section.type}</span>
          <span class="section-list__name">{section.title || 'Untitled'}</span>
        </button>
        <div class="section-list__actions">
          <button
            class="section-list__action"
            onclick={() => onmoveup?.(i)}
            disabled={i === 0}
            aria-label="Move section up">&uarr;</button
          >
          <button
            class="section-list__action"
            onclick={() => onmovedown?.(i)}
            disabled={i === sections.length - 1}
            aria-label="Move section down">&darr;</button
          >
          <button
            class="section-list__action section-list__action--delete"
            onclick={() => onremove?.(i)}
            aria-label="Remove section">&times;</button
          >
        </div>
      </li>
    {/each}
  </ol>

  <div class="section-list__add">
    <select bind:value={addType} aria-label="Section type to add">
      <option value="text">Text</option>
      <option value="quiz">Quiz</option>
      <option value="checkpoint">Checkpoint</option>
    </select>
    <button class="section-list__add-btn" onclick={() => onadd?.(addType)}> + Add Section </button>
  </div>
</div>

<style>
  .section-list {
    padding: var(--space-md, 1rem);
  }

  .section-list__title {
    font-size: var(--font-size-sm, 0.875rem);
    font-weight: var(--font-weight-semibold, 600);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--color-text-secondary, #666);
    margin-bottom: var(--space-md, 1rem);
  }

  .section-list__items {
    list-style: none;
    padding: 0;
    margin: 0 0 var(--space-md, 1rem);
  }

  .section-list__item {
    display: flex;
    align-items: center;
    gap: var(--space-xs, 0.25rem);
    margin-bottom: var(--space-xs, 0.25rem);
    border-radius: var(--radius-sm, 4px);
  }

  .section-list__item--active {
    background: var(--color-primary-light, #eff6ff);
  }

  .section-list__select {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: var(--space-xs, 0.25rem) var(--space-sm, 0.5rem);
    border: none;
    background: none;
    cursor: pointer;
    text-align: left;
    color: var(--color-text, #1a1a1a);
  }

  .section-list__type {
    font-size: var(--font-size-xs, 0.75rem);
    color: var(--color-text-secondary, #666);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .section-list__name {
    font-size: var(--font-size-sm, 0.875rem);
  }

  .section-list__actions {
    display: flex;
    gap: 2px;
  }

  .section-list__action {
    width: 24px;
    height: 24px;
    border: none;
    background: var(--color-surface-secondary, #f5f5f5);
    border-radius: var(--radius-sm, 4px);
    cursor: pointer;
    font-size: var(--font-size-sm, 0.875rem);
    color: var(--color-text, #1a1a1a);
  }

  .section-list__action:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }

  .section-list__action--delete {
    color: var(--color-error, #dc2626);
  }

  .section-list__add {
    display: flex;
    gap: var(--space-xs, 0.25rem);
  }

  .section-list__add select {
    flex: 1;
    padding: var(--space-xs, 0.25rem);
    border: 1px solid var(--color-border, #e5e5e5);
    border-radius: var(--radius-sm, 4px);
    font-size: var(--font-size-sm, 0.875rem);
    background: var(--color-surface, #ffffff);
    color: var(--color-text, #1a1a1a);
  }

  .section-list__add-btn {
    padding: var(--space-xs, 0.25rem) var(--space-sm, 0.5rem);
    background: var(--color-primary, #2563eb);
    color: var(--color-on-primary, #ffffff);
    border: none;
    border-radius: var(--radius-sm, 4px);
    font-size: var(--font-size-sm, 0.875rem);
    cursor: pointer;
    white-space: nowrap;
  }
</style>
