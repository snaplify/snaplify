<script lang="ts">
  import type { Editor } from '@tiptap/core';

  let { editor }: { editor: Editor | null } = $props();

  type ActiveBlock = 'code_block' | 'callout' | 'image' | 'blockquote' | null;

  let visible = $state(false);
  let activeBlock: ActiveBlock = $state(null);
  let position = $state({ top: 0, left: 0 });
  let menuEl: HTMLDivElement | undefined = $state();

  // Code block state
  let codeLanguage = $state('');

  // Callout state
  let calloutVariant = $state<'info' | 'tip' | 'warning' | 'danger'>('info');

  // Image state
  let imageSrc = $state('');
  let imageAlt = $state('');
  let imageCaption = $state('');

  // Blockquote state
  let attribution = $state('');

  const LANGUAGES = [
    'javascript', 'typescript', 'python', 'rust', 'go',
    'html', 'css', 'json', 'bash', 'yaml', 'sql', 'markdown', 'plaintext',
  ];

  const CALLOUT_VARIANTS = [
    { value: 'info' as const, label: 'Info', color: 'var(--color-primary, #2563eb)' },
    { value: 'tip' as const, label: 'Tip', color: 'var(--color-success, #16a34a)' },
    { value: 'warning' as const, label: 'Warning', color: 'var(--color-warning, #f59e0b)' },
    { value: 'danger' as const, label: 'Danger', color: 'var(--color-danger, #dc2626)' },
  ];

  function detectActiveBlock(): ActiveBlock {
    if (!editor) return null;
    if (editor.isActive('code_block')) return 'code_block';
    if (editor.isActive('callout')) return 'callout';
    if (editor.isActive('image')) return 'image';
    if (editor.isActive('blockquote')) return 'blockquote';
    return null;
  }

  function readAttributes() {
    if (!editor) return;
    const { state } = editor;
    const resolvedPos = state.selection.$from;

    if (activeBlock === 'code_block') {
      // Walk up to find code_block node
      for (let d = resolvedPos.depth; d >= 0; d--) {
        const node = resolvedPos.node(d);
        if (node.type.name === 'code_block') {
          codeLanguage = (node.attrs.language as string) || '';
          break;
        }
      }
    } else if (activeBlock === 'callout') {
      for (let d = resolvedPos.depth; d >= 0; d--) {
        const node = resolvedPos.node(d);
        if (node.type.name === 'callout') {
          calloutVariant = (node.attrs.variant as typeof calloutVariant) || 'info';
          break;
        }
      }
    } else if (activeBlock === 'image') {
      // Image is an atom node, check the node at selection
      const node = state.selection instanceof Object && 'node' in state.selection
        ? (state.selection as unknown as { node: { attrs: Record<string, string> } }).node
        : null;
      if (node) {
        imageSrc = node.attrs.src || '';
        imageAlt = node.attrs.alt || '';
        imageCaption = node.attrs.caption || '';
      }
    } else if (activeBlock === 'blockquote') {
      for (let d = resolvedPos.depth; d >= 0; d--) {
        const node = resolvedPos.node(d);
        if (node.type.name === 'blockquote') {
          attribution = (node.attrs.attribution as string) || '';
          break;
        }
      }
    }
  }

  function updatePosition() {
    if (!editor) return;
    const { view, state } = editor;
    const { from } = state.selection;

    try {
      const coords = view.coordsAtPos(from);
      // Find the DOM node for the block to get its bottom edge
      const resolved = state.doc.resolve(from);
      let blockPos = from;
      for (let d = resolved.depth; d >= 0; d--) {
        const node = resolved.node(d);
        if (node.type.name === activeBlock) {
          blockPos = resolved.before(d);
          break;
        }
      }

      const domNode = view.nodeDOM(blockPos);
      if (domNode && domNode instanceof HTMLElement) {
        const rect = domNode.getBoundingClientRect();
        position = {
          top: rect.bottom + 4,
          left: rect.left + rect.width / 2,
        };
      } else {
        position = {
          top: coords.bottom + 8,
          left: coords.left,
        };
      }
    } catch {
      visible = false;
    }
  }

  $effect(() => {
    if (!editor) return;

    const update = () => {
      const block = detectActiveBlock();
      if (block) {
        activeBlock = block;
        visible = true;
        readAttributes();
        updatePosition();
      } else {
        visible = false;
        activeBlock = null;
      }
    };

    editor.on('selectionUpdate', update);
    editor.on('transaction', update);

    return () => {
      editor!.off('selectionUpdate', update);
      editor!.off('transaction', update);
    };
  });

  // Click outside to dismiss
  $effect(() => {
    if (!visible) return;

    function handleClickOutside(e: MouseEvent) {
      if (menuEl && !menuEl.contains(e.target as Node)) {
        visible = false;
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  });

  // --- Command helpers ---

  function cmd(): Record<string, (...args: unknown[]) => { run: () => void }> {
    return editor?.chain().focus() as unknown as Record<string, (...args: unknown[]) => { run: () => void }>;
  }

  function setLanguage(lang: string) {
    codeLanguage = lang;
    cmd().updateAttributes('code_block', { language: lang }).run();
  }

  function setCalloutVariant(variant: 'info' | 'tip' | 'warning' | 'danger') {
    calloutVariant = variant;
    cmd().updateAttributes('callout', { variant }).run();
  }

  function updateImage() {
    cmd().updateAttributes('image', {
      src: imageSrc,
      alt: imageAlt,
      caption: imageCaption,
    }).run();
  }

  function updateAttribution() {
    cmd().updateAttributes('blockquote', { attribution }).run();
  }
</script>

{#if visible && editor && activeBlock}
  <div
    class="node-menu"
    style="top: {position.top}px; left: {position.left}px;"
    role="toolbar"
    aria-label="Block controls"
    bind:this={menuEl}
  >
    {#if activeBlock === 'code_block'}
      <div class="menu-row">
        <label class="menu-label" for="code-lang">Language</label>
        <select
          id="code-lang"
          class="menu-select"
          value={codeLanguage}
          onchange={(e) => setLanguage((e.target as HTMLSelectElement).value)}
          aria-label="Code language"
        >
          <option value="">Auto</option>
          {#each LANGUAGES as lang}
            <option value={lang}>{lang}</option>
          {/each}
        </select>
      </div>

    {:else if activeBlock === 'callout'}
      <div class="menu-row">
        <span class="menu-label">Variant</span>
        <div class="variant-group" role="radiogroup" aria-label="Callout variant">
          {#each CALLOUT_VARIANTS as v}
            <button
              class="variant-btn"
              class:active={calloutVariant === v.value}
              onclick={() => setCalloutVariant(v.value)}
              aria-label="{v.label} callout"
              aria-pressed={calloutVariant === v.value}
              title={v.label}
            >
              <span class="variant-dot" style="background: {v.color};"></span>
              <span class="variant-text">{v.label}</span>
            </button>
          {/each}
        </div>
      </div>

    {:else if activeBlock === 'image'}
      <div class="menu-col">
        <div class="menu-row">
          <label class="menu-label" for="img-src">URL</label>
          <input
            id="img-src"
            class="menu-input"
            type="url"
            placeholder="Image source URL"
            bind:value={imageSrc}
            onblur={updateImage}
            onkeydown={(e) => { if (e.key === 'Enter') { e.preventDefault(); updateImage(); } }}
          />
        </div>
        <div class="menu-row">
          <label class="menu-label" for="img-alt">Alt</label>
          <input
            id="img-alt"
            class="menu-input"
            type="text"
            placeholder="Alt text"
            bind:value={imageAlt}
            onblur={updateImage}
            onkeydown={(e) => { if (e.key === 'Enter') { e.preventDefault(); updateImage(); } }}
          />
        </div>
        <div class="menu-row">
          <label class="menu-label" for="img-caption">Caption</label>
          <input
            id="img-caption"
            class="menu-input"
            type="text"
            placeholder="Caption"
            bind:value={imageCaption}
            onblur={updateImage}
            onkeydown={(e) => { if (e.key === 'Enter') { e.preventDefault(); updateImage(); } }}
          />
        </div>
      </div>

    {:else if activeBlock === 'blockquote'}
      <div class="menu-row">
        <label class="menu-label" for="quote-attr">Attribution</label>
        <input
          id="quote-attr"
          class="menu-input"
          type="text"
          placeholder="Who said it?"
          bind:value={attribution}
          onblur={updateAttribution}
          onkeydown={(e) => { if (e.key === 'Enter') { e.preventDefault(); updateAttribution(); } }}
        />
      </div>
    {/if}
  </div>
{/if}

<style>
  .node-menu {
    position: fixed;
    display: flex;
    flex-direction: column;
    gap: var(--space-1, 0.25rem);
    padding: var(--space-2, 0.5rem);
    background: var(--color-surface, #0c0c0b);
    border: 1px solid var(--color-border, #272725);
    border-radius: var(--radius-md, 6px);
    box-shadow: var(--shadow-md, 0 4px 12px rgba(0, 0, 0, 0.1));
    transform: translateX(-50%);
    z-index: 49;
    max-width: 320px;
    min-width: 200px;
  }

  .menu-row {
    display: flex;
    align-items: center;
    gap: var(--space-2, 0.5rem);
  }

  .menu-col {
    display: flex;
    flex-direction: column;
    gap: var(--space-1, 0.25rem);
  }

  .menu-label {
    font-size: var(--text-xs, 0.75rem);
    color: var(--color-text-secondary, #888884);
    white-space: nowrap;
    min-width: 52px;
    font-family: var(--font-sans, sans-serif);
  }

  .menu-select {
    flex: 1;
    height: 26px;
    padding: 0 var(--space-1, 0.25rem);
    border: 1px solid var(--color-border, #272725);
    border-radius: var(--radius-sm, 4px);
    background: var(--color-surface-alt, #141413);
    color: var(--color-text, #d8d5cf);
    font-size: var(--text-xs, 0.75rem);
    font-family: var(--font-mono, monospace);
    cursor: pointer;
  }

  .menu-select:focus {
    outline: 2px solid var(--color-primary, #2563eb);
    outline-offset: -1px;
  }

  .menu-input {
    flex: 1;
    height: 26px;
    padding: 0 var(--space-1, 0.25rem);
    border: 1px solid var(--color-border, #272725);
    border-radius: var(--radius-sm, 4px);
    background: var(--color-surface-alt, #141413);
    color: var(--color-text, #d8d5cf);
    font-size: var(--text-xs, 0.75rem);
    font-family: var(--font-sans, sans-serif);
  }

  .menu-input::placeholder {
    color: var(--color-text-muted, #444440);
  }

  .menu-input:focus {
    outline: 2px solid var(--color-primary, #2563eb);
    outline-offset: -1px;
  }

  .variant-group {
    display: flex;
    gap: 2px;
  }

  .variant-btn {
    display: inline-flex;
    align-items: center;
    gap: var(--space-1, 0.25rem);
    padding: 2px var(--space-2, 0.5rem);
    border: 1px solid transparent;
    border-radius: var(--radius-sm, 4px);
    background: transparent;
    color: var(--color-text, #d8d5cf);
    cursor: pointer;
    font-size: var(--text-xs, 0.75rem);
    font-family: var(--font-sans, sans-serif);
    height: 26px;
  }

  .variant-btn:hover {
    background: var(--color-surface-hover, #1c1c1a);
  }

  .variant-btn.active {
    border-color: var(--color-border, #272725);
    background: var(--color-surface-alt, #141413);
  }

  .variant-dot {
    display: inline-block;
    width: 8px;
    height: 8px;
    border-radius: var(--radius-full, 9999px);
    flex-shrink: 0;
  }

  .variant-text {
    line-height: 1;
  }
</style>
