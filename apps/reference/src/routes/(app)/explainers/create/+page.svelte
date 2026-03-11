<script lang="ts">
  import { enhance } from '$app/forms';
  import ExplainerEditor from '$lib/components/explainer/ExplainerEditor.svelte';
  import SectionList from '$lib/components/explainer/SectionList.svelte';
  import EditorLayout from '$lib/components/editor/EditorLayout.svelte';
  import type { ExplainerSection } from '@snaplify/explainer';
  import type { ActionData } from './$types';

  let { form }: { form: ActionData } = $props();

  type FormWithData = ActionData & { title?: string; description?: string };
  const formData = form as FormWithData | null;

  let title = $state(formData?.title ?? '');
  let description = $state(formData?.description ?? '');
  let tags = $state('');
  let sections = $state<ExplainerSection[]>([]);
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
  <title>Create Explainer — Snaplify</title>
</svelte:head>

<form method="POST" use:enhance bind:this={formEl} style="display:contents;">
  <input type="hidden" name="title" value={title} />
  <input type="hidden" name="description" value={description} />
  <input type="hidden" name="tags" value={tags} />
  <input type="hidden" name="sections" value={JSON.stringify(sections)} />
  <input type="hidden" name="action" value="draft" />

  <EditorLayout
    bind:title
    type="explainer"
    backHref="/create"
    ondraft={() => submitAs('draft')}
    onpublish={() => submitAs('publish')}
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
          <textarea
            class="ep-textarea"
            placeholder="Brief description"
            rows={2}
            bind:value={description}
          ></textarea>
        </div>
        <div class="ep-section">
          <span class="ep-label">Tags</span>
          <input
            class="ep-input"
            type="text"
            placeholder="Comma-separated"
            bind:value={tags}
          />
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

  /* Right panel: properties */
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
  }

  .ep-input:focus,
  .ep-textarea:focus {
    border-color: var(--color-primary, #5b9cf6);
  }

  .ep-textarea {
    resize: vertical;
    min-height: 48px;
  }

  .ep-stat {
    font-size: var(--text-xs, 0.75rem);
    color: var(--color-text-muted, #444440);
    font-family: var(--font-mono, monospace);
  }
</style>
