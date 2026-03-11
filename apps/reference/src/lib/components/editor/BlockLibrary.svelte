<script lang="ts">
  export interface BlockDef {
    type: string;
    label: string;
    icon: string;
    description: string;
  }

  export interface BlockCategory {
    label: string;
    blocks: BlockDef[];
  }

  let {
    categories,
    oninsert,
  }: {
    categories: BlockCategory[];
    oninsert?: (type: string) => void;
  } = $props();

  let filter = $state('');

  let filteredCategories = $derived(
    filter
      ? categories
          .map((cat) => ({
            ...cat,
            blocks: cat.blocks.filter(
              (b) =>
                b.label.toLowerCase().includes(filter.toLowerCase()) ||
                b.type.toLowerCase().includes(filter.toLowerCase()),
            ),
          }))
          .filter((cat) => cat.blocks.length > 0)
      : categories,
  );
</script>

<div class="block-library">
  <div class="bl-header">
    <span class="bl-title">Blocks</span>
  </div>

  <div class="bl-search">
    <input
      class="bl-search-input"
      type="text"
      placeholder="Filter blocks…"
      bind:value={filter}
      aria-label="Filter blocks"
    />
  </div>

  <div class="bl-scroll">
    {#each filteredCategories as category}
      <div class="bl-category">
        <span class="bl-category-label">{category.label}</span>
        <div class="bl-grid">
          {#each category.blocks as block}
            <button
              class="bl-item"
              onclick={() => oninsert?.(block.type)}
              title={block.description}
              aria-label="Insert {block.label}"
            >
              <span class="bl-item-icon">{block.icon}</span>
              <span class="bl-item-label">{block.label}</span>
            </button>
          {/each}
        </div>
      </div>
    {/each}

    {#if filteredCategories.length === 0}
      <p class="bl-empty">No blocks match "{filter}"</p>
    {/if}
  </div>
</div>

<style>
  .block-library {
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  .bl-header {
    padding: var(--space-3, 0.75rem) var(--space-3, 0.75rem) 0;
  }

  .bl-title {
    font-family: var(--font-mono, monospace);
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--color-text-secondary, #888884);
  }

  .bl-search {
    padding: var(--space-2, 0.5rem) var(--space-3, 0.75rem);
  }

  .bl-search-input {
    width: 100%;
    height: 28px;
    padding: 0 var(--space-2, 0.5rem);
    border: 1px solid var(--color-border, #272725);
    border-radius: var(--radius-sm, 4px);
    background: var(--color-surface-alt, #141413);
    color: var(--color-text, #d8d5cf);
    font-family: var(--font-mono, monospace);
    font-size: var(--text-xs, 0.75rem);
    outline: none;
  }

  .bl-search-input:focus {
    border-color: var(--color-primary, #5b9cf6);
  }

  .bl-search-input::placeholder {
    color: var(--color-text-muted, #444440);
  }

  .bl-scroll {
    flex: 1;
    overflow-y: auto;
    padding: 0 var(--space-3, 0.75rem) var(--space-3, 0.75rem);
  }

  .bl-category {
    margin-bottom: var(--space-3, 0.75rem);
  }

  .bl-category-label {
    display: block;
    font-family: var(--font-mono, monospace);
    font-size: 9px;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    color: var(--color-text-muted, #444440);
    margin-bottom: var(--space-2, 0.5rem);
  }

  .bl-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 4px;
  }

  .bl-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    padding: var(--space-2, 0.5rem) var(--space-1, 0.25rem);
    border: 1px solid var(--color-border, #272725);
    border-radius: var(--radius-sm, 4px);
    background: transparent;
    color: var(--color-text-secondary, #888884);
    cursor: pointer;
    font-family: var(--font-body, system-ui, sans-serif);
    text-align: center;
  }

  .bl-item:hover {
    background: var(--color-surface-alt, #141413);
    color: var(--color-text, #d8d5cf);
    border-color: var(--color-primary, #5b9cf6);
  }

  .bl-item-icon {
    font-family: var(--font-mono, monospace);
    font-size: 11px;
    font-weight: 700;
    line-height: 1;
    letter-spacing: 0.04em;
    width: 28px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: var(--radius-sm, 4px);
    background: rgba(91, 156, 246, 0.06);
    border: 1px solid rgba(91, 156, 246, 0.12);
    color: var(--color-primary, #5b9cf6);
  }

  .bl-item-label {
    font-size: 10px;
    line-height: 1.2;
  }

  .bl-empty {
    font-size: var(--text-xs, 0.75rem);
    color: var(--color-text-muted, #444440);
    text-align: center;
    padding: var(--space-4, 1rem) 0;
    margin: 0;
  }
</style>
