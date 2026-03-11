<script lang="ts">
  import { enhance } from '$app/forms';
  import ExplainerEditor from '$lib/components/explainer/ExplainerEditor.svelte';
  import SectionList from '$lib/components/explainer/SectionList.svelte';
  import EditorLayout from '$lib/components/editor/EditorLayout.svelte';
  import type { ExplainerSection } from '@snaplify/explainer';
  import type { PageData, ActionData } from './$types';

  let { data, form }: { data: PageData; form: ActionData } = $props();

  let title = $state(data.item.title);
  let description = $state(data.item.description ?? '');
  let seoDescription = $state(data.item.seoDescription ?? '');
  let tags = $state(data.item.tags.map((t: { name: string }) => t.name).join(', '));
  let sections = $state<ExplainerSection[]>((data.item.sections ?? []) as ExplainerSection[]);
  let activeIndex = $state(0);
  let editorRef: ExplainerEditor | undefined = $state();
  let formEl: HTMLFormElement | undefined = $state();

  function handleSectionsChange(updated: ExplainerSection[]) {
    sections = updated;
  }

  function submitAs(action: string) {
    if (!formEl) return;
    const input = formEl.querySelector<HTMLInputElement>('input[name="action"]');
    if (input) input.value = action;
    formEl.requestSubmit();
  }
</script>

<svelte:head>
  <title>Edit: {data.item.title} — Snaplify</title>
</svelte:head>

<form method="POST" use:enhance bind:this={formEl} style="display:contents;">
  <input type="hidden" name="title" value={title} />
  <input type="hidden" name="description" value={description} />
  <input type="hidden" name="tags" value={tags} />
  <input type="hidden" name="seoDescription" value={seoDescription} />
  <input type="hidden" name="sections" value={JSON.stringify(sections)} />
  <input type="hidden" name="action" value="save" />

  <EditorLayout
    bind:title
    type="explainer"
    status={data.item.status === 'published' ? 'published' : 'draft'}
    backHref="/explainers/{data.item.slug}"
    onsave={() => submitAs('save')}
    onpublish={data.item.status !== 'published' ? () => submitAs('publish') : undefined}
  >
    {#snippet leftPanel()}
      <SectionList
        {sections}
        {activeIndex}
        onselect={(i) => { activeIndex = i; editorRef?.selectSection(i); }}
        onadd={(type) => editorRef?.addSection(type)}
        onremove={(i) => editorRef?.removeSection(i)}
        onmoveup={(i) => editorRef?.moveSectionUp(i)}
        onmovedown={(i) => editorRef?.moveSectionDown(i)}
      />
    {/snippet}

    <div class="explainer-canvas">
      {#if form?.error}
        <div class="form-error" role="alert">{form.error}</div>
      {/if}

      <input
        class="desc-input"
        type="text"
        bind:value={description}
        placeholder="What does this explainer teach?"
        maxlength="2000"
      />

      <ExplainerEditor bind:this={editorRef} {sections} onsectionschange={handleSectionsChange} />
    </div>

    {#snippet rightPanel()}
      <div class="explainer-props">
        <div class="ep-section">
          <span class="ep-label">Description</span>
          <textarea class="ep-textarea" rows={2} bind:value={description} placeholder="Brief description"></textarea>
        </div>
        <div class="ep-section">
          <span class="ep-label">Tags</span>
          <input class="ep-input" type="text" bind:value={tags} placeholder="Comma-separated" />
        </div>
        <div class="ep-section">
          <span class="ep-label">SEO Description</span>
          <textarea class="ep-textarea" rows={2} bind:value={seoDescription} placeholder="Search engine description" maxlength="320"></textarea>
          <span class="ep-char-count">{seoDescription.length}/320</span>
        </div>
        <div class="ep-section">
          <span class="ep-label">Stats</span>
          <div class="ep-stat">{sections.length} section{sections.length !== 1 ? 's' : ''}</div>
          <div class="ep-stat">{sections.filter(s => s.type === 'quiz').length} quizzes</div>
        </div>
      </div>
    {/snippet}
  </EditorLayout>
</form>

<style>
  /* Center canvas */
  .explainer-canvas {
    min-height: 100%;
  }

  .desc-input {
    width: 100%;
    font-size: var(--text-md, 1rem);
    color: var(--color-text-secondary, #888884);
    background: transparent;
    border: none;
    outline: none;
    padding: 0;
    margin-bottom: var(--space-4, 1rem);
  }

  .desc-input::placeholder {
    color: var(--color-text-muted, #444440);
  }

  .form-error {
    padding: var(--space-2, 0.5rem) var(--space-3, 0.75rem);
    background: rgba(248, 113, 113, 0.08);
    border: 1px solid var(--color-error, #f87171);
    color: var(--color-error, #f87171);
    border-radius: var(--radius-sm, 4px);
    font-size: var(--text-xs, 0.75rem);
    margin-bottom: var(--space-4, 1rem);
  }

  /* Right panel */
  .explainer-props {
    padding: var(--space-3, 0.75rem);
    display: flex;
    flex-direction: column;
    gap: var(--space-3, 0.75rem);
  }

  .ep-section {
    display: flex;
    flex-direction: column;
    gap: var(--space-1, 0.25rem);
  }

  .ep-label {
    font-family: var(--font-mono, monospace);
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--color-text-secondary, #888884);
  }

  .ep-input,
  .ep-textarea {
    width: 100%;
    padding: 4px var(--space-2, 0.5rem);
    border: 1px solid var(--color-border, #272725);
    border-radius: var(--radius-sm, 4px);
    background: var(--color-surface-alt, #141413);
    color: var(--color-text, #d8d5cf);
    font-size: var(--text-xs, 0.75rem);
    font-family: var(--font-body, system-ui, sans-serif);
    outline: none;
    box-sizing: border-box;
  }

  .ep-input:focus,
  .ep-textarea:focus {
    border-color: var(--color-primary, #5b9cf6);
  }

  .ep-textarea {
    resize: vertical;
    min-height: 48px;
  }

  .ep-char-count {
    font-family: var(--font-mono, monospace);
    font-size: 9px;
    color: var(--color-text-muted, #444440);
    align-self: flex-end;
  }

  .ep-stat {
    font-size: var(--text-xs, 0.75rem);
    color: var(--color-text-muted, #444440);
    font-family: var(--font-mono, monospace);
  }
</style>
