<script lang="ts">
  import { enhance } from '$app/forms';
  import { Button } from '@snaplify/ui';
  import type { ActionData } from './$types';

  let { form }: { form: ActionData & Record<string, unknown> } = $props();

  let submitting = $state(false);
</script>

<svelte:head>
  <title>Create Learning Path — Snaplify</title>
</svelte:head>

<div class="create-page">
  <h1>Create Learning Path</h1>
  <p class="page-desc">Set up the basics, then build your curriculum in the editor.</p>

  {#if form?.error}
    <div class="form-error" role="alert">{form.error}</div>
  {/if}

  <form
    method="POST"
    use:enhance={() => {
      submitting = true;
      return async ({ update }) => {
        submitting = false;
        await update();
      };
    }}
  >
    <div class="form-field">
      <label for="title">Title</label>
      <input
        id="title"
        name="title"
        type="text"
        value={form?.title ?? ''}
        required
        maxlength="255"
        placeholder="e.g., Introduction to Web Development"
      />
    </div>

    <div class="form-field">
      <label for="description">Description</label>
      <textarea
        id="description"
        name="description"
        rows={3}
        maxlength="2000"
        placeholder="What will learners achieve by completing this path?"
      >{form?.description ?? ''}</textarea>
    </div>

    <div class="form-row">
      <div class="form-field">
        <label for="difficulty">Difficulty</label>
        <select id="difficulty" name="difficulty">
          <option value="">Select...</option>
          <option value="beginner" selected={form?.difficulty === 'beginner'}>Beginner</option>
          <option value="intermediate" selected={form?.difficulty === 'intermediate'}>Intermediate</option>
          <option value="advanced" selected={form?.difficulty === 'advanced'}>Advanced</option>
        </select>
      </div>

      <div class="form-field">
        <label for="estimatedHours">Estimated Hours</label>
        <input
          id="estimatedHours"
          name="estimatedHours"
          type="number"
          min="0.5"
          step="0.5"
          placeholder="e.g., 10"
        />
      </div>
    </div>

    <div class="form-actions">
      <Button variant="primary" type="submit" loading={submitting}>Create & Start Editing</Button>
    </div>
  </form>
</div>

<style>
  .create-page {
    max-width: var(--layout-content-width, 640px);
    margin: 0 auto;
    padding: var(--space-6, 2rem) var(--space-4, 1rem);
  }

  .create-page h1 {
    font-size: var(--text-2xl, 1.875rem);
    margin: 0 0 var(--space-1, 0.25rem);
    color: var(--color-text, #d8d5cf);
  }

  .page-desc {
    margin: 0 0 var(--space-6, 2rem);
    font-size: var(--text-sm, 0.875rem);
    color: var(--color-text-secondary, #888884);
  }

  .form-error {
    padding: var(--space-2, 0.5rem) var(--space-4, 1rem);
    margin-bottom: var(--space-4, 1rem);
    background: var(--color-error-bg, #fef2f2);
    color: var(--color-error, #dc2626);
    border-radius: var(--radius-sm, 4px);
    font-size: var(--text-sm, 0.875rem);
  }

  .form-field {
    margin-bottom: var(--space-4, 1rem);
  }

  .form-field label {
    display: block;
    margin-bottom: var(--space-1, 0.25rem);
    font-size: var(--text-sm, 0.875rem);
    font-weight: var(--font-weight-medium, 500);
    color: var(--color-text, #d8d5cf);
  }

  .form-field input,
  .form-field textarea,
  .form-field select {
    width: 100%;
    padding: var(--space-2, 0.5rem);
    border: 1px solid var(--color-border, #272725);
    border-radius: var(--radius-sm, 4px);
    font-size: var(--text-md, 1rem);
    background: var(--color-surface, #0c0c0b);
    color: var(--color-text, #d8d5cf);
    box-sizing: border-box;
    font-family: inherit;
  }

  .form-field textarea {
    resize: vertical;
  }

  .form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--space-4, 1rem);
  }

  .form-actions {
    margin-top: var(--space-6, 2rem);
  }
</style>
