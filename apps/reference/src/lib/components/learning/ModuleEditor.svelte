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
  let newModuleDescription = $state('');
  let editingModuleId = $state<string | null>(null);
  let editingModuleDesc = $state('');
  let deleteConfirmId = $state<string | null>(null);
  let expandedModuleIds = $state<Set<string>>(new Set());

  function toggleExpand(moduleId: string): void {
    const next = new Set(expandedModuleIds);
    if (next.has(moduleId)) {
      next.delete(moduleId);
    } else {
      next.add(moduleId);
    }
    expandedModuleIds = next;
  }

  function isExpanded(moduleId: string): boolean {
    return expandedModuleIds.has(moduleId);
  }

  function startEditing(mod: { id: string; description: string | null }): void {
    editingModuleId = mod.id;
    editingModuleDesc = mod.description ?? '';
  }

  function buildReorderPayload(moduleId: string, direction: 'up' | 'down'): string {
    const ids = modules.map((m) => m.id);
    const idx = ids.indexOf(moduleId);
    if (direction === 'up' && idx > 0) {
      [ids[idx - 1], ids[idx]] = [ids[idx]!, ids[idx - 1]!];
    } else if (direction === 'down' && idx < ids.length - 1) {
      [ids[idx], ids[idx + 1]] = [ids[idx + 1]!, ids[idx]!];
    }
    return JSON.stringify(ids);
  }

  // Expand all modules by default on mount
  $effect(() => {
    if (modules.length > 0 && expandedModuleIds.size === 0) {
      expandedModuleIds = new Set(modules.map((m) => m.id));
    }
  });
</script>

<div class="module-editor">
  {#if modules.length === 0}
    <div class="empty-state">
      <p>No modules yet. Add your first module to start building this learning path.</p>
    </div>
  {/if}

  {#each modules as mod, idx (mod.id)}
    <div class="module-item" class:module-expanded={isExpanded(mod.id)}>
      <div class="module-header">
        {#if editingModuleId === mod.id}
          <form
            method="POST"
            action="?/updateModule"
            use:enhance={() => {
              return async ({ update }) => {
                editingModuleId = null;
                await update();
              };
            }}
            class="inline-edit"
          >
            <input type="hidden" name="moduleId" value={mod.id} />
            <div class="edit-fields">
              <input
                name="title"
                type="text"
                value={mod.title}
                required
                maxlength="255"
                class="inline-input"
                placeholder="Module title"
              />
              <input
                name="description"
                type="text"
                value={editingModuleDesc}
                maxlength="500"
                class="inline-input inline-input-desc"
                placeholder="Brief description (optional)"
              />
            </div>
            <div class="edit-actions">
              <button type="submit" class="btn btn-small btn-save">Save</button>
              <button type="button" class="btn btn-small" onclick={() => (editingModuleId = null)}>Cancel</button>
            </div>
          </form>
        {:else}
          <button
            type="button"
            class="module-toggle"
            onclick={() => toggleExpand(mod.id)}
            aria-expanded={isExpanded(mod.id)}
            aria-label={isExpanded(mod.id) ? `Collapse ${mod.title}` : `Expand ${mod.title}`}
          >
            <span class="toggle-icon" class:rotated={isExpanded(mod.id)}>&#9654;</span>
          </button>
          <div class="module-info" role="button" tabindex="0" onclick={() => toggleExpand(mod.id)} onkeydown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleExpand(mod.id); } }}>
            <h3 class="module-title">
              <span class="module-number">{idx + 1}.</span>
              {mod.title}
            </h3>
            {#if mod.description}
              <p class="module-desc">{mod.description}</p>
            {/if}
            <span class="module-meta">{mod.lessons.length} lesson{mod.lessons.length !== 1 ? 's' : ''}</span>
          </div>
          <div class="module-actions">
            <!-- Reorder buttons -->
            {#if idx > 0}
              <form method="POST" action="?/reorderModules" use:enhance class="inline-form">
                <input type="hidden" name="order" value={buildReorderPayload(mod.id, 'up')} />
                <button type="submit" class="btn btn-small btn-icon" aria-label="Move module up" title="Move up">&#9650;</button>
              </form>
            {/if}
            {#if idx < modules.length - 1}
              <form method="POST" action="?/reorderModules" use:enhance class="inline-form">
                <input type="hidden" name="order" value={buildReorderPayload(mod.id, 'down')} />
                <button type="submit" class="btn btn-small btn-icon" aria-label="Move module down" title="Move down">&#9660;</button>
              </form>
            {/if}
            <button class="btn btn-small" onclick={() => startEditing(mod)}>Edit</button>
            {#if deleteConfirmId === mod.id}
              <form method="POST" action="?/deleteModule" use:enhance class="inline-form">
                <input type="hidden" name="moduleId" value={mod.id} />
                <button type="submit" class="btn btn-small btn-danger">Confirm</button>
                <button type="button" class="btn btn-small" onclick={() => (deleteConfirmId = null)}>Cancel</button>
              </form>
            {:else}
              <button class="btn btn-small btn-danger-outline" onclick={() => (deleteConfirmId = mod.id)}>Delete</button>
            {/if}
          </div>
        {/if}
      </div>

      {#if isExpanded(mod.id) && editingModuleId !== mod.id}
        <div class="module-body">
          <LessonEditor moduleId={mod.id} lessons={mod.lessons} />
        </div>
      {/if}
    </div>
  {/each}

  <form
    method="POST"
    action="?/addModule"
    use:enhance={() => {
      return async ({ update, result }) => {
        if (result.type === 'success') {
          newModuleTitle = '';
          newModuleDescription = '';
        }
        await update();
      };
    }}
    class="add-form"
  >
    <div class="add-fields">
      <input
        name="title"
        type="text"
        placeholder="New module title..."
        bind:value={newModuleTitle}
        required
        maxlength="255"
        class="add-input"
      />
      <input
        name="description"
        type="text"
        placeholder="Description (optional)"
        bind:value={newModuleDescription}
        maxlength="500"
        class="add-input add-input-desc"
      />
    </div>
    <button type="submit" class="btn btn-add" disabled={!newModuleTitle.trim()}>Add Module</button>
  </form>
</div>

<style>
  .module-editor {
    display: flex;
    flex-direction: column;
    gap: var(--space-4, 1rem);
  }

  .empty-state {
    padding: var(--space-8, 2.5rem) var(--space-4, 1rem);
    text-align: center;
    color: var(--color-text-secondary, #888884);
    font-size: var(--text-sm, 0.875rem);
    border: 1px dashed var(--color-border, #272725);
    border-radius: var(--radius-md, 6px);
  }

  .module-item {
    border: 1px solid var(--color-border, #272725);
    border-radius: var(--radius-md, 6px);
    overflow: hidden;
  }

  .module-expanded {
    border-color: var(--color-border-focus, #3c3c38);
  }

  .module-header {
    display: flex;
    align-items: center;
    gap: var(--space-2, 0.5rem);
    padding: var(--space-3, 0.75rem) var(--space-4, 1rem);
    background: var(--color-surface-alt, #1c1c1a);
  }

  .module-toggle {
    background: none;
    border: none;
    cursor: pointer;
    padding: var(--space-1, 0.25rem);
    color: var(--color-text-secondary, #888884);
    font-size: var(--text-xs, 0.75rem);
    line-height: 1;
    flex-shrink: 0;
  }

  .toggle-icon {
    display: inline-block;
    transition: transform 150ms ease;
  }

  .toggle-icon.rotated {
    transform: rotate(90deg);
  }

  .module-info {
    flex: 1;
    min-width: 0;
    cursor: pointer;
  }

  .module-title {
    font-size: var(--text-md, 1rem);
    font-weight: var(--font-weight-medium, 500);
    color: var(--color-text, #d8d5cf);
    margin: 0;
    display: flex;
    align-items: center;
    gap: var(--space-1, 0.25rem);
  }

  .module-number {
    color: var(--color-text-secondary, #888884);
    font-size: var(--text-sm, 0.875rem);
    font-weight: var(--font-weight-normal, 400);
  }

  .module-desc {
    margin: var(--space-1, 0.25rem) 0 0;
    font-size: var(--text-sm, 0.875rem);
    color: var(--color-text-secondary, #888884);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .module-meta {
    font-size: var(--text-xs, 0.75rem);
    color: var(--color-text-secondary, #888884);
  }

  .module-actions {
    display: flex;
    gap: var(--space-1, 0.25rem);
    align-items: center;
    flex-shrink: 0;
  }

  .module-body {
    border-top: 1px solid var(--color-border, #272725);
  }

  .inline-edit {
    display: flex;
    gap: var(--space-2, 0.5rem);
    align-items: flex-start;
    flex: 1;
  }

  .edit-fields {
    display: flex;
    flex-direction: column;
    gap: var(--space-1, 0.25rem);
    flex: 1;
  }

  .edit-actions {
    display: flex;
    gap: var(--space-1, 0.25rem);
    align-items: center;
    flex-shrink: 0;
    padding-top: var(--space-1, 0.25rem);
  }

  .inline-input {
    width: 100%;
    padding: var(--space-1, 0.25rem) var(--space-2, 0.5rem);
    border: 1px solid var(--color-border, #272725);
    border-radius: var(--radius-sm, 4px);
    font-size: var(--text-sm, 0.875rem);
    background: var(--color-surface, #0c0c0b);
    color: var(--color-text, #d8d5cf);
    box-sizing: border-box;
  }

  .inline-input-desc {
    font-size: var(--text-xs, 0.75rem);
  }

  .inline-form {
    display: flex;
    gap: var(--space-1, 0.25rem);
  }

  .add-form {
    display: flex;
    gap: var(--space-2, 0.5rem);
    align-items: flex-start;
  }

  .add-fields {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: var(--space-1, 0.25rem);
  }

  .add-input {
    width: 100%;
    padding: var(--space-2, 0.5rem);
    border: 1px solid var(--color-border, #272725);
    border-radius: var(--radius-sm, 4px);
    font-size: var(--text-sm, 0.875rem);
    background: var(--color-surface, #0c0c0b);
    color: var(--color-text, #d8d5cf);
    box-sizing: border-box;
  }

  .add-input-desc {
    font-size: var(--text-xs, 0.75rem);
  }

  .btn {
    padding: var(--space-1, 0.25rem) var(--space-2, 0.5rem);
    border: 1px solid var(--color-border, #272725);
    border-radius: var(--radius-sm, 4px);
    font-size: var(--text-xs, 0.75rem);
    cursor: pointer;
    background: var(--color-surface-alt, #1c1c1a);
    color: var(--color-text, #d8d5cf);
  }

  .btn-small {
    padding: var(--space-1, 0.25rem) var(--space-2, 0.5rem);
  }

  .btn-icon {
    padding: var(--space-1, 0.25rem);
    line-height: 1;
    font-size: var(--text-xs, 0.75rem);
  }

  .btn-save {
    background: var(--color-primary, #2563eb);
    color: var(--color-on-primary, #ffffff);
    border-color: var(--color-primary, #2563eb);
  }

  .btn-add {
    background: var(--color-primary, #2563eb);
    color: var(--color-on-primary, #ffffff);
    border: none;
    padding: var(--space-2, 0.5rem) var(--space-4, 1rem);
    flex-shrink: 0;
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
