<script lang="ts">
  import type { PageData, ActionData } from './$types';

  let { data, form }: { data: PageData; form: ActionData } = $props();
</script>

<svelte:head>
  <title>Manage Versions — {data.site.name} Docs</title>
</svelte:head>

<section class="versions-page">
  <h1 class="page-title">Version Management</h1>

  {#if form?.error}
    <div class="error-message" role="alert">{form.error}</div>
  {/if}
  {#if form?.success}
    <div class="success-message" role="status">Version updated.</div>
  {/if}

  <div class="version-list">
    {#each data.versions as version (version.id)}
      <div class="version-card">
        <div class="version-info">
          <span class="version-name">{version.version}</span>
          {#if version.isDefault}
            <span class="version-badge">Default</span>
          {/if}
          <span class="version-pages">{version.pageCount} pages</span>
        </div>
        <div class="version-actions">
          {#if !version.isDefault}
            <form method="POST" action="?/setDefault" class="inline-form">
              <input type="hidden" name="versionId" value={version.id} />
              <button type="submit" class="btn-secondary">Set Default</button>
            </form>
            <form method="POST" action="?/delete" class="inline-form">
              <input type="hidden" name="versionId" value={version.id} />
              <button type="submit" class="btn-danger" onclick={(e) => { if (!confirm('Delete this version and all its pages?')) e.preventDefault(); }}>Delete</button>
            </form>
          {/if}
        </div>
      </div>
    {/each}
  </div>

  <hr class="divider" />

  <h2 class="section-title">Create New Version</h2>
  <form method="POST" action="?/create" class="create-form">
    <div class="form-field">
      <label for="version" class="form-label">Version Name</label>
      <input id="version" name="version" type="text" required maxlength="32" placeholder="v2.0" class="form-input" />
    </div>
    <div class="form-field">
      <label for="sourceVersionId" class="form-label">Copy pages from</label>
      <select id="sourceVersionId" name="sourceVersionId" class="form-input">
        <option value="">Start empty</option>
        {#each data.versions as version}
          <option value={version.id}>{version.version} ({version.pageCount} pages)</option>
        {/each}
      </select>
    </div>
    <label class="checkbox-field">
      <input type="checkbox" name="isDefault" value="true" />
      <span>Set as default version</span>
    </label>
    <button type="submit" class="form-submit">Create Version</button>
  </form>
</section>

<style>
  .versions-page {
    max-width: var(--layout-narrow-width, 640px);
    margin: 0 auto;
    padding: var(--space-md, 1rem);
  }

  .page-title { font-size: var(--font-size-xl, 1.5rem); margin-bottom: var(--space-lg, 2rem); color: var(--color-text, inherit); }
  .section-title { font-size: var(--font-size-lg, 1.125rem); margin-bottom: var(--space-sm, 0.5rem); color: var(--color-text, inherit); }

  .error-message, .success-message { padding: var(--space-sm, 0.5rem); margin-bottom: var(--space-md, 1rem); border-radius: var(--radius-sm, 0.25rem); font-size: var(--font-size-sm, 0.875rem); }
  .error-message { border: 1px solid var(--color-danger, #ef4444); color: var(--color-danger, #ef4444); }
  .success-message { border: 1px solid var(--color-success, #22c55e); color: var(--color-success, #22c55e); }

  .version-list { display: flex; flex-direction: column; gap: var(--space-sm, 0.5rem); }
  .version-card { display: flex; justify-content: space-between; align-items: center; padding: var(--space-sm, 0.5rem); border: 1px solid var(--color-border, #e5e7eb); border-radius: var(--radius-sm, 0.25rem); }
  .version-info { display: flex; align-items: center; gap: var(--space-sm, 0.5rem); }
  .version-name { font-weight: var(--font-weight-semibold, 600); }
  .version-badge { font-size: var(--font-size-xs, 0.75rem); padding: 0 var(--space-xs, 0.25rem); background: var(--color-primary, #3b82f6); color: var(--color-on-primary, #fff); border-radius: var(--radius-xs, 0.125rem); }
  .version-pages { font-size: var(--font-size-xs, 0.75rem); color: var(--color-text-muted, #9ca3af); }
  .version-actions { display: flex; gap: var(--space-xs, 0.25rem); }

  .inline-form { display: inline; }
  .btn-secondary, .btn-danger { padding: var(--space-xs, 0.25rem) var(--space-sm, 0.5rem); border: 1px solid var(--color-border, #e5e7eb); border-radius: var(--radius-sm, 0.25rem); background: transparent; font-size: var(--font-size-xs, 0.75rem); cursor: pointer; color: var(--color-text, inherit); }
  .btn-danger { color: var(--color-danger, #ef4444); border-color: var(--color-danger, #ef4444); }

  .divider { margin: var(--space-lg, 2rem) 0; border: none; border-top: 1px solid var(--color-border, #e5e7eb); }

  .create-form { display: flex; flex-direction: column; gap: var(--space-sm, 0.5rem); }
  .form-field { display: flex; flex-direction: column; gap: var(--space-xs, 0.25rem); }
  .form-label { font-size: var(--font-size-sm, 0.875rem); font-weight: var(--font-weight-medium, 500); }
  .form-input { padding: var(--space-sm, 0.5rem); border: 1px solid var(--color-border, #e5e7eb); border-radius: var(--radius-sm, 0.25rem); font-size: var(--font-size-sm, 0.875rem); color: var(--color-text, inherit); background: var(--color-bg-surface, #fff); }
  .checkbox-field { display: flex; align-items: center; gap: var(--space-xs, 0.25rem); font-size: var(--font-size-sm, 0.875rem); }
  .form-submit { padding: var(--space-sm, 0.5rem) var(--space-md, 1rem); background: var(--color-primary, #3b82f6); color: var(--color-on-primary, #fff); border: none; border-radius: var(--radius-sm, 0.25rem); cursor: pointer; align-self: flex-start; }
</style>
