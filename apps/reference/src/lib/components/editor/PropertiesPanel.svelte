<script lang="ts">
  import type { Snippet } from 'svelte';

  export interface BlockInfo {
    type: string;
    attrs: Record<string, unknown>;
    pos: number;
  }

  const LANGUAGES = [
    'javascript', 'typescript', 'python', 'rust', 'go',
    'html', 'css', 'json', 'bash', 'yaml', 'sql', 'markdown', 'plaintext',
  ];

  const CALLOUT_VARIANTS = [
    { value: 'info', label: 'Info', color: 'var(--color-info, #3b82f6)' },
    { value: 'tip', label: 'Tip', color: 'var(--color-success, #22c55e)' },
    { value: 'warning', label: 'Warning', color: 'var(--color-warning, #f59e0b)' },
    { value: 'danger', label: 'Danger', color: 'var(--color-error, #ef4444)' },
  ];

  let {
    selectedBlock = null,
    meta,
    extraFields,
    onblockattr,
    onmetachange,
  }: {
    selectedBlock?: BlockInfo | null;
    meta?: { title?: string; description?: string; tags?: string; coverImageUrl?: string; seoTitle?: string; seoDescription?: string; [key: string]: unknown };
    extraFields?: Snippet;
    onblockattr?: (attr: string, value: unknown) => void;
    onmetachange?: (field: string, value: string) => void;
  } = $props();

  let expandedSections = $state<Record<string, boolean>>({
    block: true,
    meta: true,
    seo: false,
  });

  function toggleSection(key: string) {
    expandedSections = { ...expandedSections, [key]: !expandedSections[key] };
  }

  function blockLabel(type: string): string {
    const map: Record<string, string> = {
      code_block: 'Code Block',
      codeBlock: 'Code Block',
      heading: 'Heading',
      paragraph: 'Paragraph',
      image: 'Image',
      callout: 'Callout',
      blockquote: 'Blockquote',
      bullet_list: 'Bullet List',
      ordered_list: 'Ordered List',
      horizontal_rule: 'Divider',
    };
    return map[type] ?? type;
  }
</script>

<div class="props-panel">
  <!-- Block Properties -->
  {#if selectedBlock}
    <div class="pp-section">
      <button class="pp-section-header" onclick={() => toggleSection('block')}>
        <span class="pp-section-title">{blockLabel(selectedBlock.type)}</span>
        <span class="pp-chevron" class:pp-chevron-open={expandedSections.block}>▸</span>
      </button>

      {#if expandedSections.block}
        <div class="pp-section-body">
          {#if selectedBlock.type === 'code_block' || selectedBlock.type === 'codeBlock'}
            <div class="pp-row">
              <label class="pp-label" for="pp-lang">Language</label>
              <select
                id="pp-lang"
                class="pp-select"
                value={String(selectedBlock.attrs.language ?? '')}
                onchange={(e) => onblockattr?.('language', (e.target as HTMLSelectElement).value)}
              >
                <option value="">Auto</option>
                {#each LANGUAGES as lang}
                  <option value={lang}>{lang}</option>
                {/each}
              </select>
            </div>

          {:else if selectedBlock.type === 'callout'}
            <div class="pp-row">
              <span class="pp-label">Variant</span>
              <div class="pp-variant-group">
                {#each CALLOUT_VARIANTS as v}
                  <button
                    class="pp-variant-btn"
                    class:pp-variant-active={selectedBlock.attrs.variant === v.value}
                    onclick={() => onblockattr?.('variant', v.value)}
                    title={v.label}
                  >
                    <span class="pp-variant-dot" style="background: {v.color};"></span>
                    {v.label}
                  </button>
                {/each}
              </div>
            </div>

          {:else if selectedBlock.type === 'image'}
            <div class="pp-row pp-row-col">
              <label class="pp-label" for="pp-img-src">URL</label>
              <input
                id="pp-img-src"
                class="pp-input"
                type="url"
                placeholder="Image source URL"
                value={String(selectedBlock.attrs.src ?? '')}
                onblur={(e) => onblockattr?.('src', (e.target as HTMLInputElement).value)}
              />
            </div>
            <div class="pp-row pp-row-col">
              <label class="pp-label" for="pp-img-alt">Alt text</label>
              <input
                id="pp-img-alt"
                class="pp-input"
                type="text"
                placeholder="Describe the image"
                value={String(selectedBlock.attrs.alt ?? '')}
                onblur={(e) => onblockattr?.('alt', (e.target as HTMLInputElement).value)}
              />
            </div>
            <div class="pp-row pp-row-col">
              <label class="pp-label" for="pp-img-cap">Caption</label>
              <input
                id="pp-img-cap"
                class="pp-input"
                type="text"
                placeholder="Caption"
                value={String(selectedBlock.attrs.caption ?? '')}
                onblur={(e) => onblockattr?.('caption', (e.target as HTMLInputElement).value)}
              />
            </div>

          {:else if selectedBlock.type === 'heading'}
            <div class="pp-row">
              <label class="pp-label" for="pp-level">Level</label>
              <select
                id="pp-level"
                class="pp-select"
                value={String(selectedBlock.attrs.level ?? 2)}
                onchange={(e) => onblockattr?.('level', Number((e.target as HTMLSelectElement).value))}
              >
                <option value="2">Heading 2</option>
                <option value="3">Heading 3</option>
              </select>
            </div>

          {:else if selectedBlock.type === 'blockquote'}
            <div class="pp-row pp-row-col">
              <label class="pp-label" for="pp-attr">Attribution</label>
              <input
                id="pp-attr"
                class="pp-input"
                type="text"
                placeholder="Who said it?"
                value={String(selectedBlock.attrs.attribution ?? '')}
                onblur={(e) => onblockattr?.('attribution', (e.target as HTMLInputElement).value)}
              />
            </div>
          {/if}
        </div>
      {/if}
    </div>
  {/if}

  <!-- Document Metadata -->
  {#if meta}
    <div class="pp-section">
      <button class="pp-section-header" onclick={() => toggleSection('meta')}>
        <span class="pp-section-title">Metadata</span>
        <span class="pp-chevron" class:pp-chevron-open={expandedSections.meta}>▸</span>
      </button>

      {#if expandedSections.meta}
        <div class="pp-section-body">
          <div class="pp-row pp-row-col">
            <label class="pp-label" for="pp-desc">Description</label>
            <textarea
              id="pp-desc"
              class="pp-textarea"
              placeholder="Brief description"
              rows={2}
              value={meta.description ?? ''}
              onblur={(e) => onmetachange?.('description', (e.target as HTMLTextAreaElement).value)}
            ></textarea>
          </div>
          <div class="pp-row pp-row-col">
            <label class="pp-label" for="pp-tags">Tags</label>
            <input
              id="pp-tags"
              class="pp-input"
              type="text"
              placeholder="Comma-separated tags"
              value={meta.tags ?? ''}
              onblur={(e) => onmetachange?.('tags', (e.target as HTMLInputElement).value)}
            />
          </div>
          <div class="pp-row pp-row-col">
            <label class="pp-label" for="pp-cover">Cover Image</label>
            <input
              id="pp-cover"
              class="pp-input"
              type="url"
              placeholder="Cover image URL"
              value={meta.coverImageUrl ?? ''}
              onblur={(e) => onmetachange?.('coverImageUrl', (e.target as HTMLInputElement).value)}
            />
          </div>

          {#if extraFields}
            {@render extraFields()}
          {/if}
        </div>
      {/if}
    </div>

    <!-- SEO Section -->
    <div class="pp-section">
      <button class="pp-section-header" onclick={() => toggleSection('seo')}>
        <span class="pp-section-title">SEO</span>
        <span class="pp-chevron" class:pp-chevron-open={expandedSections.seo}>▸</span>
      </button>

      {#if expandedSections.seo}
        <div class="pp-section-body">
          <div class="pp-row pp-row-col">
            <label class="pp-label" for="pp-seo-title">SEO Title</label>
            <input
              id="pp-seo-title"
              class="pp-input"
              type="text"
              placeholder="Override page title"
              value={meta.seoTitle ?? ''}
              onblur={(e) => onmetachange?.('seoTitle', (e.target as HTMLInputElement).value)}
            />
          </div>
          <div class="pp-row pp-row-col">
            <label class="pp-label" for="pp-seo-desc">SEO Description</label>
            <textarea
              id="pp-seo-desc"
              class="pp-textarea"
              placeholder="Search engine description"
              rows={2}
              value={meta.seoDescription ?? ''}
              onblur={(e) => onmetachange?.('seoDescription', (e.target as HTMLTextAreaElement).value)}
            ></textarea>
          </div>
        </div>
      {/if}
    </div>
  {/if}
</div>

<style>
  .props-panel {
    display: flex;
    flex-direction: column;
  }

  /* Section */
  .pp-section {
    border-bottom: 1px solid var(--color-border, #272725);
  }

  .pp-section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding: var(--space-2, 0.5rem) var(--space-3, 0.75rem);
    border: none;
    background: transparent;
    cursor: pointer;
    color: var(--color-text, #d8d5cf);
  }

  .pp-section-header:hover {
    background: var(--color-surface-alt, #141413);
  }

  .pp-section-title {
    font-family: var(--font-mono, monospace);
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--color-text-secondary, #888884);
  }

  .pp-chevron {
    font-size: 10px;
    color: var(--color-text-muted, #444440);
    transition: transform 0.12s ease;
  }

  .pp-chevron-open {
    transform: rotate(90deg);
  }

  .pp-section-body {
    padding: 0 var(--space-3, 0.75rem) var(--space-3, 0.75rem);
    display: flex;
    flex-direction: column;
    gap: var(--space-2, 0.5rem);
  }

  /* Rows */
  .pp-row {
    display: flex;
    align-items: center;
    gap: var(--space-2, 0.5rem);
  }

  .pp-row-col {
    flex-direction: column;
    align-items: stretch;
  }

  .pp-label {
    font-size: var(--text-xs, 0.75rem);
    color: var(--color-text-secondary, #888884);
    white-space: nowrap;
    min-width: 56px;
  }

  /* Inputs */
  .pp-input,
  .pp-select,
  .pp-textarea {
    width: 100%;
    padding: 4px var(--space-2, 0.5rem);
    border: 1px solid var(--color-border, #272725);
    border-radius: var(--radius-sm, 4px);
    background: var(--color-surface-alt, #141413);
    color: var(--color-text, #d8d5cf);
    font-size: var(--text-xs, 0.75rem);
    font-family: var(--font-body, system-ui, sans-serif);
    outline: none;
  }

  .pp-input:focus,
  .pp-select:focus,
  .pp-textarea:focus {
    border-color: var(--color-primary, #5b9cf6);
  }

  .pp-input::placeholder,
  .pp-textarea::placeholder {
    color: var(--color-text-muted, #444440);
  }

  .pp-textarea {
    resize: vertical;
    min-height: 48px;
  }

  .pp-select {
    cursor: pointer;
    font-family: var(--font-mono, monospace);
  }

  /* Variant buttons */
  .pp-variant-group {
    display: flex;
    gap: 2px;
    flex-wrap: wrap;
  }

  .pp-variant-btn {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 2px 8px;
    border: 1px solid transparent;
    border-radius: var(--radius-sm, 4px);
    background: transparent;
    color: var(--color-text-secondary, #888884);
    cursor: pointer;
    font-size: 11px;
    height: 24px;
  }

  .pp-variant-btn:hover {
    background: var(--color-surface-alt, #141413);
  }

  .pp-variant-active {
    border-color: var(--color-border, #272725);
    background: var(--color-surface-alt, #141413);
    color: var(--color-text, #d8d5cf);
  }

  .pp-variant-dot {
    width: 8px;
    height: 8px;
    border-radius: var(--radius-full, 50%);
    flex-shrink: 0;
  }
</style>
