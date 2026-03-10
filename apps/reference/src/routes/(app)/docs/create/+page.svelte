<script lang="ts">
  import type { ActionData } from './$types';

  let { form }: { form: ActionData } = $props();
</script>

<svelte:head>
  <title>Create Documentation Site — Snaplify</title>
</svelte:head>

<section class="create-docs-page">
  <h1 class="page-title">Create Documentation Site</h1>

  {#if form?.error}
    <div class="error-message" role="alert">{form.error}</div>
  {/if}

  <form method="POST" class="create-form">
    <div class="form-field">
      <label for="name" class="form-label">Name</label>
      <input
        id="name"
        name="name"
        type="text"
        required
        maxlength="128"
        class="form-input"
        aria-required="true"
      />
    </div>

    <div class="form-field">
      <label for="description" class="form-label">Description (optional)</label>
      <textarea
        id="description"
        name="description"
        maxlength="2000"
        class="form-textarea"
        rows="3"
      ></textarea>
    </div>

    <button type="submit" class="form-submit">Create Site</button>
  </form>
</section>

<style>
  .create-docs-page {
    max-width: var(--layout-narrow-width, 640px);
    margin: 0 auto;
    padding: var(--space-md, 1rem);
  }

  .page-title {
    font-size: var(--font-size-2xl, 1.875rem);
    margin-bottom: var(--space-lg, 2rem);
    color: var(--color-text, inherit);
  }

  .error-message {
    padding: var(--space-sm, 0.5rem);
    margin-bottom: var(--space-md, 1rem);
    border: 1px solid var(--color-danger, #ef4444);
    border-radius: var(--radius-sm, 0.25rem);
    color: var(--color-danger, #ef4444);
    font-size: var(--font-size-sm, 0.875rem);
  }

  .create-form {
    display: flex;
    flex-direction: column;
    gap: var(--space-md, 1rem);
  }

  .form-field {
    display: flex;
    flex-direction: column;
    gap: var(--space-xs, 0.25rem);
  }

  .form-label {
    font-size: var(--font-size-sm, 0.875rem);
    font-weight: var(--font-weight-medium, 500);
    color: var(--color-text, inherit);
  }

  .form-input,
  .form-textarea {
    padding: var(--space-sm, 0.5rem);
    border: 1px solid var(--color-border, #e5e7eb);
    border-radius: var(--radius-sm, 0.25rem);
    font-size: var(--font-size-sm, 0.875rem);
    color: var(--color-text, inherit);
    background: var(--color-bg-surface, #fff);
  }

  .form-submit {
    padding: var(--space-sm, 0.5rem) var(--space-md, 1rem);
    background: var(--color-primary, #3b82f6);
    color: var(--color-on-primary, #fff);
    border: none;
    border-radius: var(--radius-sm, 0.25rem);
    font-size: var(--font-size-sm, 0.875rem);
    font-weight: var(--font-weight-medium, 500);
    cursor: pointer;
    align-self: flex-start;
  }

  .form-submit:hover {
    opacity: 0.9;
  }
</style>
