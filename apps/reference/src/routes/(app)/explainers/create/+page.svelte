<script lang="ts">
  import { enhance } from '$app/forms';
  import ExplainerEditor from '$lib/components/explainer/ExplainerEditor.svelte';
  import type { ExplainerSection } from '@snaplify/explainer';
  import type { ActionData } from './$types';

  let { form }: { form: ActionData } = $props();

  let title = $state(form?.title ?? '');
  let description = $state(form?.description ?? '');
  let tags = $state('');
  let sections = $state<ExplainerSection[]>([]);

  function handleSectionsChange(updated: ExplainerSection[]) {
    sections = updated;
  }
</script>

<svelte:head>
  <title>Create Explainer — Snaplify</title>
</svelte:head>

<div class="create-page">
  <h1>Create Explainer</h1>

  {#if form?.error}
    <div class="form-error" role="alert">{form.error}</div>
  {/if}

  <form method="POST" use:enhance>
    <div class="form-field">
      <label for="title">Title</label>
      <input
        id="title"
        name="title"
        type="text"
        bind:value={title}
        required
        maxlength="255"
        placeholder="Give your explainer a title"
      />
    </div>

    <div class="form-field">
      <label for="description">Description <span class="optional">(optional)</span></label>
      <textarea
        id="description"
        name="description"
        bind:value={description}
        maxlength="2000"
        rows="2"
        placeholder="A brief summary of what this explainer teaches"
      ></textarea>
    </div>

    <div class="form-field">
      <label>Sections</label>
      <ExplainerEditor {sections} onsectionschange={handleSectionsChange} />
      <input type="hidden" name="sections" value={JSON.stringify(sections)} />
    </div>

    <div class="form-field">
      <label for="tags">Tags <span class="optional">(comma-separated)</span></label>
      <input
        id="tags"
        name="tags"
        type="text"
        bind:value={tags}
        placeholder="javascript, beginner, tutorial"
      />
    </div>

    <div class="form-actions">
      <button type="submit" name="action" value="draft" class="btn btn-secondary">
        Save Draft
      </button>
      <button type="submit" name="action" value="publish" class="btn btn-primary">
        Publish
      </button>
    </div>
  </form>
</div>

<style>
  .create-page {
    max-width: var(--layout-content-width, 768px);
    margin: 0 auto;
  }

  .create-page h1 {
    font-size: var(--font-size-2xl, 1.875rem);
    margin-bottom: var(--space-lg, 2rem);
    color: var(--color-text, #1a1a1a);
  }

  .form-error {
    padding: var(--space-sm, 0.5rem);
    margin-bottom: var(--space-md, 1rem);
    background: var(--color-error-bg, #fef2f2);
    color: var(--color-error, #dc2626);
    border-radius: var(--radius-sm, 4px);
  }

  .form-field {
    margin-bottom: var(--space-md, 1rem);
  }

  .form-field label {
    display: block;
    margin-bottom: var(--space-xs, 0.25rem);
    font-size: var(--font-size-sm, 0.875rem);
    font-weight: var(--font-weight-medium, 500);
    color: var(--color-text, #1a1a1a);
  }

  .optional {
    font-weight: var(--font-weight-normal, 400);
    color: var(--color-text-secondary, #666);
  }

  .form-field input,
  .form-field textarea {
    width: 100%;
    padding: var(--space-sm, 0.5rem);
    border: 1px solid var(--color-border, #e5e5e5);
    border-radius: var(--radius-sm, 4px);
    font-size: var(--font-size-md, 1rem);
    background: var(--color-surface, #ffffff);
    color: var(--color-text, #1a1a1a);
    box-sizing: border-box;
  }

  .form-actions {
    display: flex;
    gap: var(--space-sm, 0.5rem);
    justify-content: flex-end;
    margin-top: var(--space-lg, 2rem);
  }

  .btn {
    padding: var(--space-sm, 0.5rem) var(--space-lg, 2rem);
    border: none;
    border-radius: var(--radius-md, 6px);
    font-size: var(--font-size-md, 1rem);
    cursor: pointer;
  }

  .btn-primary {
    background: var(--color-primary, #2563eb);
    color: var(--color-on-primary, #ffffff);
  }

  .btn-secondary {
    background: var(--color-surface-secondary, #f5f5f5);
    color: var(--color-text, #1a1a1a);
    border: 1px solid var(--color-border, #e5e5e5);
  }
</style>
