<script lang="ts">
  import { enhance } from '$app/forms';
  import type { ActionData } from './$types';

  let { form }: { form: ActionData } = $props();
</script>

<svelte:head>
  <title>Create Community — Snaplify</title>
</svelte:head>

<div class="create-page">
  <h1>Create Community</h1>

  {#if form?.error}
    <div class="error-banner" role="alert">{form.error}</div>
  {/if}

  <form method="POST" use:enhance class="create-form">
    <div class="form-field">
      <label for="name">Name</label>
      <input
        type="text"
        id="name"
        name="name"
        required
        maxlength="128"
        placeholder="My Awesome Community"
      />
    </div>

    <div class="form-field">
      <label for="description">Description</label>
      <textarea
        id="description"
        name="description"
        maxlength="2000"
        rows="3"
        placeholder="What is this community about?"
      ></textarea>
    </div>

    <div class="form-field">
      <label for="rules">Rules</label>
      <textarea
        id="rules"
        name="rules"
        maxlength="10000"
        rows="5"
        placeholder="Community guidelines and rules..."
      ></textarea>
    </div>

    <div class="form-field">
      <label for="joinPolicy">Join Policy</label>
      <select id="joinPolicy" name="joinPolicy">
        <option value="open">Open — Anyone can join</option>
        <option value="approval">Approval — Invite token required</option>
        <option value="invite">Invite Only — Invite token required</option>
      </select>
    </div>

    <button type="submit" class="btn btn-primary">Create Community</button>
  </form>
</div>

<style>
  .create-page {
    max-width: var(--layout-content-width, 640px);
    margin: 0 auto;
  }

  h1 {
    font-size: var(--font-size-2xl, 1.875rem);
    color: var(--color-text, #1a1a1a);
    margin-bottom: var(--space-lg, 2rem);
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

  .form-field label {
    font-weight: var(--font-weight-medium, 500);
    color: var(--color-text, #1a1a1a);
    font-size: var(--font-size-sm, 0.875rem);
  }

  .form-field input,
  .form-field textarea,
  .form-field select {
    padding: var(--space-sm, 0.5rem) var(--space-md, 1rem);
    border: 1px solid var(--color-border, #e5e5e5);
    border-radius: var(--radius-md, 6px);
    font-size: var(--font-size-md, 1rem);
    background: var(--color-surface, #ffffff);
    color: var(--color-text, #1a1a1a);
  }

  .error-banner {
    padding: var(--space-sm, 0.5rem) var(--space-md, 1rem);
    background: var(--color-error-bg, #fef2f2);
    color: var(--color-error, #dc2626);
    border-radius: var(--radius-md, 6px);
    margin-bottom: var(--space-md, 1rem);
  }

  .btn {
    padding: var(--space-sm, 0.5rem) var(--space-md, 1rem);
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
