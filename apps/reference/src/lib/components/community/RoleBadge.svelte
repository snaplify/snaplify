<script lang="ts">
  let { role }: { role: string } = $props();
</script>

<span class="role-badge role-{role}" aria-label="{role} role">{role}</span>

<style>
  .role-badge {
    padding: var(--space-xs, 0.25rem) var(--space-sm, 0.5rem);
    border-radius: var(--radius-sm, 4px);
    font-size: var(--font-size-xs, 0.75rem);
    font-weight: var(--font-weight-medium, 500);
    text-transform: capitalize;
    display: inline-block;
  }

  .role-owner {
    background: var(--color-warning-bg, #fffbeb);
    color: var(--color-warning, #f59e0b);
  }

  .role-admin {
    background: var(--color-error-bg, #fef2f2);
    color: var(--color-error, #dc2626);
  }

  .role-moderator {
    background: var(--color-info-bg, #eff6ff);
    color: var(--color-info, #3b82f6);
  }

  .role-member {
    background: var(--color-surface-secondary, #f5f5f5);
    color: var(--color-text-secondary, #666);
  }
</style>
