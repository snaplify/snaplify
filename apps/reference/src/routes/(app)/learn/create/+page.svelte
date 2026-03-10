<script lang="ts">
  import { enhance } from '$app/forms';
  import type { ActionData } from './$types';

  let { form }: { form: ActionData & Record<string, unknown> } = $props();
</script>

<svelte:head>
  <title>Create Learning Path — Snaplify</title>
</svelte:head>

<div class="create-page">
  <h1>Create Learning Path</h1>

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
        value={form?.title ?? ''}
        required
        maxlength="255"
      />
    </div>

    <div class="form-field">
      <label for="description">Description <span class="optional">(optional)</span></label>
      <textarea
        id="description"
        name="description"
        maxlength="2000"
        rows="3"
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
        <label for="estimatedHours">Estimated Hours <span class="optional">(optional)</span></label>
        <input id="estimatedHours" name="estimatedHours" type="number" min="0.5" step="0.5" />
      </div>
    </div>

    <div class="form-actions">
      <button type="submit" class="btn btn-primary">Create & Edit</button>
    </div>
  </form>
</div>

<style>
  .create-page {
    max-width: var(--layout-content-width, 640px);
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
  .form-field textarea,
  .form-field select {
    width: 100%;
    padding: var(--space-sm, 0.5rem);
    border: 1px solid var(--color-border, #e5e5e5);
    border-radius: var(--radius-sm, 4px);
    font-size: var(--font-size-md, 1rem);
    background: var(--color-surface, #ffffff);
    color: var(--color-text, #1a1a1a);
    box-sizing: border-box;
  }

  .form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--space-md, 1rem);
  }

  .form-actions {
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
</style>
