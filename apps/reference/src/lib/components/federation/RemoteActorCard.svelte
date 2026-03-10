<script lang="ts">
  interface RemoteActor {
    actorUri: string;
    preferredUsername?: string;
    displayName?: string;
    avatarUrl?: string;
    instanceDomain: string;
  }

  let { actor }: { actor: RemoteActor } = $props();
</script>

<div class="actor-card" aria-label="Remote actor {actor.preferredUsername ?? actor.actorUri}">
  {#if actor.avatarUrl}
    <img
      src={actor.avatarUrl}
      alt="{actor.displayName ?? actor.preferredUsername ?? 'Remote actor'}'s avatar"
      class="avatar"
      loading="lazy"
    />
  {:else}
    <div class="avatar placeholder" aria-hidden="true">
      {(actor.preferredUsername ?? '?')[0].toUpperCase()}
    </div>
  {/if}

  <div class="info">
    <span class="name">{actor.displayName ?? actor.preferredUsername ?? 'Unknown'}</span>
    <span class="handle">
      @{actor.preferredUsername ?? ''}@{actor.instanceDomain}
    </span>
  </div>
</div>

<style>
  .actor-card {
    display: flex;
    align-items: center;
    gap: var(--space-3, 0.75rem);
    padding: var(--space-3, 0.75rem);
    border: 1px solid var(--color-border, #e5e5e5);
    border-radius: var(--radius-md, 0.375rem);
  }

  .avatar {
    width: 2.5rem;
    height: 2.5rem;
    border-radius: var(--radius-full, 9999px);
    object-fit: cover;
  }

  .avatar.placeholder {
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--color-bg-subtle, #f5f5f5);
    color: var(--color-text-secondary, #666);
    font-weight: var(--font-bold, 700);
    font-size: var(--text-lg, 1.125rem);
  }

  .info {
    display: flex;
    flex-direction: column;
  }

  .name {
    font-weight: var(--font-medium, 500);
    color: var(--color-text, #111);
  }

  .handle {
    font-size: var(--text-sm, 0.875rem);
    color: var(--color-text-secondary, #666);
  }
</style>
