<script lang="ts">
  import { enhance } from '$app/forms';
  import LessonEditor from './LessonEditor.svelte';

  let {
    modules,
    pathSlug,
  }: {
    modules: Array<{
      id: string;
      title: string;
      description: string | null;
      sortOrder: number;
      lessons: Array<{
        id: string;
        title: string;
        slug: string;
        type: string;
        duration: number | null;
        sortOrder: number;
      }>;
    }>;
    pathSlug: string;
  } = $props();

  let newModuleTitle = $state('');
  let editingModuleId = $state<string | null>(null);
  let deleteConfirmId = $state<string | null>(null);
</script>

<div class="module-editor">
  {#each modules as mod (mod.id)}
    <div class="module-item">
      <div class="module-header">
        {#if editingModuleId === mod.id}
          <form method="POST" action="?/updateModule" use:enhance class="inline-edit">
            <input type="hidden" name="moduleId" value={mod.id} />
            <input
              name="title"
              type="text"
              value={mod.title}
              required
              maxlength="255"
              class="inline-input"
            />
            <button type="submit" class="btn btn-small">Save</button>
            <button type="button" class="btn btn-small" onclick={() => (editingModuleId = null)}
              >Cancel</button
            >
          </form>
        {:else}
          <h3 class="module-title">{mod.title}</h3>
          <div class="module-actions">
            <button class="btn btn-small" onclick={() => (editingModuleId = mod.id)}>Edit</button>
            {#if deleteConfirmId === mod.id}
              <form method="POST" action="?/deleteModule" use:enhance class="inline-form">
                <input type="hidden" name="moduleId" value={mod.id} />
                <button type="submit" class="btn btn-small btn-danger">Confirm</button>
                <button type="button" class="btn btn-small" onclick={() => (deleteConfirmId = null)}
                  >Cancel</button
                >
              </form>
            {:else}
              <button
                class="btn btn-small btn-danger-outline"
                onclick={() => (deleteConfirmId = mod.id)}>Delete</button
              >
            {/if}
          </div>
        {/if}
      </div>

      <LessonEditor moduleId={mod.id} lessons={mod.lessons} />
    </div>
  {/each}

  <form method="POST" action="?/addModule" use:enhance class="add-form">
    <input
      name="title"
      type="text"
      placeholder="New module title..."
      bind:value={newModuleTitle}
      required
      maxlength="255"
      class="add-input"
    />
    <button type="submit" class="btn btn-add" disabled={!newModuleTitle.trim()}>Add Module</button>
  </form>
</div>

<style>
  .module-editor {
    display: flex;
    flex-direction: column;
    gap: var(--space-md, 1rem);
  }

  .module-item {
    border: 1px solid var(--color-border, #e5e5e5);
    border-radius: var(--radius-md, 6px);
    overflow: hidden;
  }

  .module-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--space-sm, 0.5rem) var(--space-md, 1rem);
    background: var(--color-surface-secondary, #f5f5f5);
  }

  .module-title {
    font-size: var(--font-size-md, 1rem);
    font-weight: var(--font-weight-medium, 500);
    color: var(--color-text, #1a1a1a);
    margin: 0;
  }

  .module-actions {
    display: flex;
    gap: var(--space-xs, 0.25rem);
  }

  .inline-edit {
    display: flex;
    gap: var(--space-xs, 0.25rem);
    align-items: center;
    flex: 1;
  }

  .inline-input {
    flex: 1;
    padding: var(--space-xs, 0.25rem) var(--space-sm, 0.5rem);
    border: 1px solid var(--color-border, #e5e5e5);
    border-radius: var(--radius-sm, 4px);
    font-size: var(--font-size-sm, 0.875rem);
    background: var(--color-surface, #ffffff);
    color: var(--color-text, #1a1a1a);
  }

  .inline-form {
    display: flex;
    gap: var(--space-xs, 0.25rem);
  }

  .add-form {
    display: flex;
    gap: var(--space-sm, 0.5rem);
  }

  .add-input {
    flex: 1;
    padding: var(--space-sm, 0.5rem);
    border: 1px solid var(--color-border, #e5e5e5);
    border-radius: var(--radius-sm, 4px);
    font-size: var(--font-size-sm, 0.875rem);
    background: var(--color-surface, #ffffff);
    color: var(--color-text, #1a1a1a);
  }

  .btn {
    padding: var(--space-xs, 0.25rem) var(--space-sm, 0.5rem);
    border: none;
    border-radius: var(--radius-sm, 4px);
    font-size: var(--font-size-xs, 0.75rem);
    cursor: pointer;
    background: var(--color-surface-secondary, #f5f5f5);
    color: var(--color-text, #1a1a1a);
    border: 1px solid var(--color-border, #e5e5e5);
  }

  .btn-small {
    padding: var(--space-xs, 0.25rem) var(--space-sm, 0.5rem);
  }

  .btn-add {
    background: var(--color-primary, #2563eb);
    color: var(--color-on-primary, #ffffff);
    border: none;
    padding: var(--space-sm, 0.5rem) var(--space-md, 1rem);
  }

  .btn-add:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .btn-danger {
    background: var(--color-error, #dc2626);
    color: var(--color-on-primary, #ffffff);
    border: none;
  }

  .btn-danger-outline {
    color: var(--color-error, #dc2626);
    border-color: var(--color-error, #dc2626);
    background: transparent;
  }
</style>
