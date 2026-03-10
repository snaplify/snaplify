<script lang="ts">
  interface AuditLogItem {
    id: string;
    action: string;
    targetType: string;
    targetId: string | null;
    metadata: unknown;
    ipAddress: string | null;
    createdAt: Date;
    user: { id: string; username: string; displayName: string | null };
  }

  interface Props {
    logs: AuditLogItem[];
    class?: string;
  }

  let { logs, class: className = '' }: Props = $props();

  function formatTimestamp(date: Date): string {
    return new Date(date).toLocaleString();
  }
</script>

<div
  class={['admin-audit-table-wrapper', className].filter(Boolean).join(' ')}
  role="region"
  aria-label="Audit log table"
>
  <table class="admin-audit-table">
    <thead>
      <tr>
        <th scope="col">Time</th>
        <th scope="col">User</th>
        <th scope="col">Action</th>
        <th scope="col">Target</th>
        <th scope="col">IP</th>
      </tr>
    </thead>
    <tbody>
      {#each logs as log (log.id)}
        <tr>
          <td>
            <time datetime={new Date(log.createdAt).toISOString()}>
              {formatTimestamp(log.createdAt)}
            </time>
          </td>
          <td>{log.user.username}</td>
          <td><code class="admin-audit-table__action">{log.action}</code></td>
          <td>
            <span class="admin-audit-table__target-type">{log.targetType}</span>
            {#if log.targetId}
              <span class="admin-audit-table__target-id">{log.targetId.slice(0, 8)}...</span>
            {/if}
          </td>
          <td>{log.ipAddress ?? '—'}</td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>

<style>
  .admin-audit-table-wrapper {
    overflow-x: auto;
  }

  .admin-audit-table {
    width: 100%;
    border-collapse: collapse;
    font-family: var(--font-body, sans-serif);
    font-size: var(--text-sm, 0.75rem);
  }

  .admin-audit-table th,
  .admin-audit-table td {
    padding: var(--space-2, 0.5rem) var(--space-3, 0.75rem);
    text-align: left;
    border-bottom: var(--border-width-thin, 1px) solid var(--color-border, #e5e7eb);
  }

  .admin-audit-table th {
    font-weight: var(--font-weight-semibold, 600);
    color: var(--color-text-secondary, #555);
    background: var(--color-surface-alt, #f8f9fa);
  }

  .admin-audit-table__action {
    font-family: var(--font-mono, monospace);
    font-size: var(--text-xs, 0.6875rem);
    background: var(--color-surface-alt, #f8f9fa);
    padding: var(--space-1, 0.25rem);
    border-radius: var(--radius-sm, 0.125rem);
  }

  .admin-audit-table__target-type {
    font-weight: var(--font-weight-medium, 500);
  }

  .admin-audit-table__target-id {
    font-family: var(--font-mono, monospace);
    font-size: var(--text-xs, 0.6875rem);
    color: var(--color-text-muted, #888);
    margin-left: var(--space-1, 0.25rem);
  }
</style>
