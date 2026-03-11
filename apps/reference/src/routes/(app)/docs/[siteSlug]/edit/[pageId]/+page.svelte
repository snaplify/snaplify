<script lang="ts">
  import { enhance } from '$app/forms';
  import { Input, Button } from '@snaplify/ui';
  import CodeMirrorEditor from '$lib/components/docs/CodeMirrorEditor.svelte';
  import DocsViewer from '$lib/components/docs/DocsViewer.svelte';
  import DocsSidebar from '$lib/components/docs/DocsSidebar.svelte';
  import EditorLayout from '$lib/components/editor/EditorLayout.svelte';
  import { renderMarkdown } from '@snaplify/docs';
  import type { TocEntry, PageFrontmatter } from '@snaplify/docs';
  import type { PageData, ActionData } from './$types';

  let { data, form }: { data: PageData; form: ActionData } = $props();

  let content = $state(data.page.content);
  let title = $state(data.page.title);
  let showPreview = $state(true);

  let previewHtml = $state('');
  let previewToc = $state<TocEntry[]>([]);
  let previewFrontmatter = $state<PageFrontmatter>({});

  let renderTimeout: ReturnType<typeof setTimeout> | undefined;

  function scheduleRender(markdown: string) {
    clearTimeout(renderTimeout);
    renderTimeout = setTimeout(async () => {
      try {
        const result = await renderMarkdown(markdown);
        previewHtml = result.html;
        previewToc = result.toc;
        previewFrontmatter = result.frontmatter;
      } catch {
        previewHtml = '<p style="color: var(--color-error, #ef4444)">Failed to render preview.</p>';
        previewToc = [];
        previewFrontmatter = {};
      }
    }, 300);
  }

  $effect(() => {
    scheduleRender(content);
  });
</script>

<svelte:head>
  <title>Edit: {data.page.title} — Snaplify Docs</title>
</svelte:head>

<form method="POST" action="?/save" style="display:contents;" use:enhance>
  <input type="hidden" name="content" value={content} />
  <input type="hidden" name="title" value={title} />
  <input type="hidden" name="slug" value={data.page.slug} />

  <EditorLayout
    bind:title
    type="docs"
    status="published"
    backHref="/docs/{data.site.slug}"
  >
    {#snippet leftPanel()}
      <div class="docs-nav">
        <div class="dn-header">
          <span class="dn-title">Pages</span>
        </div>
        <div class="dn-scroll">
          <a
            href="/docs/{data.site.slug}/edit"
            class="dn-item"
          >
            All Pages
          </a>
          <a
            href="/docs/{data.site.slug}/edit/{data.page.id}"
            class="dn-item dn-item-active"
          >
            {data.page.title}
          </a>
        </div>
        <div class="dn-actions">
          <a href="/docs/{data.site.slug}/edit/nav" class="dn-link">Edit Navigation</a>
          <a href="/docs/{data.site.slug}/edit/versions" class="dn-link">Versions</a>
        </div>
      </div>
    {/snippet}

    <div class="docs-canvas">
      {#if form?.error}
        <div class="msg msg-error" role="alert">{form.error}</div>
      {/if}
      {#if form?.success}
        <div class="msg msg-success" role="status">Page saved.</div>
      {/if}

      <div class="split-view" class:preview-hidden={!showPreview}>
        <div class="editor-pane">
          <div class="pane-bar">
            <span class="pane-label">Markdown</span>
          </div>
          <CodeMirrorEditor bind:content class="editor" />
        </div>

        {#if showPreview}
          <div class="preview-pane">
            <div class="pane-bar">
              <span class="pane-label">Preview</span>
            </div>
            <div class="preview-scroll">
              <DocsViewer html={previewHtml} toc={previewToc} frontmatter={previewFrontmatter} />
            </div>
          </div>
        {/if}
      </div>
    </div>

    {#snippet rightPanel()}
      <div class="docs-props">
        <div class="dp-section">
          <span class="dp-label">Page Slug</span>
          <input
            class="dp-input"
            type="text"
            value={data.page.slug}
            disabled
          />
        </div>
        <div class="dp-section">
          <button
            type="button"
            class="dp-toggle"
            onclick={() => (showPreview = !showPreview)}
            aria-pressed={showPreview}
          >
            {showPreview ? 'Hide' : 'Show'} Preview
          </button>
        </div>
        <div class="dp-section">
          <Button variant="primary" size="sm" type="submit">Save</Button>
        </div>
        <div class="dp-section dp-danger">
          <form method="POST" action="?/delete" use:enhance>
            <Button
              variant="danger"
              size="sm"
              type="submit"
              onclick={(e) => { if (!confirm('Delete this page?')) e.preventDefault(); }}
            >Delete Page</Button>
          </form>
        </div>
      </div>
    {/snippet}

    {#snippet topbarExtra()}
      <button
        type="button"
        class="el-btn el-btn-ghost"
        onclick={() => (showPreview = !showPreview)}
      >
        {showPreview ? 'Code Only' : 'Split View'}
      </button>
    {/snippet}
  </EditorLayout>
</form>

<style>
  /* Left panel: page tree */
  .docs-nav {
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .dn-header {
    padding: var(--space-3, 0.75rem);
    border-bottom: 1px solid var(--color-border, #272725);
  }

  .dn-title {
    font-family: var(--font-mono, monospace);
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--color-text-secondary, #888884);
  }

  .dn-scroll {
    flex: 1;
    overflow-y: auto;
    padding: var(--space-2, 0.5rem);
  }

  .dn-item {
    display: block;
    padding: var(--space-2, 0.5rem) var(--space-2, 0.5rem);
    border-radius: var(--radius-sm, 4px);
    font-size: var(--text-xs, 0.75rem);
    color: var(--color-text-secondary, #888884);
    text-decoration: none;
    border-left: 2px solid transparent;
  }

  .dn-item:hover {
    background: var(--color-surface-alt, #141413);
    color: var(--color-text, #d8d5cf);
  }

  .dn-item-active {
    background: var(--color-surface-alt, #141413);
    color: var(--color-text, #d8d5cf);
    border-left-color: var(--color-primary, #5b9cf6);
  }

  .dn-actions {
    padding: var(--space-2, 0.5rem);
    border-top: 1px solid var(--color-border, #272725);
    display: flex;
    flex-direction: column;
    gap: var(--space-1, 0.25rem);
  }

  .dn-link {
    font-size: var(--text-xs, 0.75rem);
    color: var(--color-primary, #5b9cf6);
    text-decoration: none;
    padding: var(--space-1, 0.25rem) var(--space-2, 0.5rem);
  }

  .dn-link:hover {
    text-decoration: underline;
  }

  /* Center canvas */
  .docs-canvas {
    min-height: 100%;
    display: flex;
    flex-direction: column;
  }

  .msg {
    padding: var(--space-2, 0.5rem) var(--space-3, 0.75rem);
    margin-bottom: var(--space-3, 0.75rem);
    border-radius: var(--radius-sm, 4px);
    font-size: var(--text-xs, 0.75rem);
  }

  .msg-error {
    background: rgba(248, 113, 113, 0.08);
    border: 1px solid var(--color-error, #f87171);
    color: var(--color-error, #f87171);
  }

  .msg-success {
    background: rgba(74, 222, 128, 0.08);
    border: 1px solid var(--color-success, #4ade80);
    color: var(--color-success, #4ade80);
  }

  .split-view {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--space-3, 0.75rem);
    flex: 1;
    min-height: 500px;
  }

  .split-view.preview-hidden {
    grid-template-columns: 1fr;
  }

  .editor-pane,
  .preview-pane {
    display: flex;
    flex-direction: column;
    min-height: 0;
  }

  .pane-bar {
    display: flex;
    align-items: center;
    padding: var(--space-1, 0.25rem) 0;
    margin-bottom: var(--space-1, 0.25rem);
  }

  .pane-label {
    font-family: var(--font-mono, monospace);
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--color-text-muted, #444440);
  }

  .preview-scroll {
    flex: 1;
    overflow-y: auto;
    border: 1px solid var(--color-border, #272725);
    border-radius: var(--radius-md, 6px);
    padding: var(--space-4, 1rem);
    background: var(--color-surface-alt, #141413);
  }

  /* Right panel */
  .docs-props {
    padding: var(--space-3, 0.75rem);
    display: flex;
    flex-direction: column;
    gap: var(--space-3, 0.75rem);
  }

  .dp-section {
    display: flex;
    flex-direction: column;
    gap: var(--space-1, 0.25rem);
  }

  .dp-label {
    font-family: var(--font-mono, monospace);
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--color-text-secondary, #888884);
  }

  .dp-input {
    width: 100%;
    padding: 4px var(--space-2, 0.5rem);
    border: 1px solid var(--color-border, #272725);
    border-radius: var(--radius-sm, 4px);
    background: var(--color-surface-alt, #141413);
    color: var(--color-text-muted, #444440);
    font-size: var(--text-xs, 0.75rem);
    font-family: var(--font-mono, monospace);
  }

  .dp-toggle {
    padding: 4px var(--space-2, 0.5rem);
    border: 1px solid var(--color-border, #272725);
    border-radius: var(--radius-sm, 4px);
    background: transparent;
    color: var(--color-text-secondary, #888884);
    font-size: var(--text-xs, 0.75rem);
    cursor: pointer;
  }

  .dp-toggle:hover {
    background: var(--color-surface-alt, #141413);
  }

  .dp-danger {
    margin-top: auto;
    padding-top: var(--space-3, 0.75rem);
    border-top: 1px solid var(--color-border, #272725);
  }
</style>
