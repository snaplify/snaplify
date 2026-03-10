<script lang="ts">
  import { enhance } from '$app/forms';
  import CommunityHeader from '$lib/components/community/CommunityHeader.svelte';
  import CommunityNav from '$lib/components/community/CommunityNav.svelte';
  import MemberCard from '$lib/components/community/MemberCard.svelte';
  import RoleSelector from '$lib/components/community/RoleSelector.svelte';
  import BanForm from '$lib/components/community/BanForm.svelte';
  import InviteLinkGenerator from '$lib/components/community/InviteLinkGenerator.svelte';
  import type { PageData, ActionData } from './$types';

  let { data, form }: { data: PageData; form: ActionData } = $props();

  let deleteConfirm = $state(false);
  let banTargetId = $state<string | null>(null);
</script>

<svelte:head>
  <title>Settings — {data.community.name} — Snaplify</title>
</svelte:head>

<div class="settings-page">
  <CommunityHeader community={data.community} />
  <CommunityNav
    slug={data.community.slug}
    active="settings"
    role={data.community.currentUserRole}
  />

  {#if form?.error}
    <div class="error-banner" role="alert">{form.error}</div>
  {/if}

  <section class="settings-section">
    <h2>Community Settings</h2>
    <form method="POST" action="?/update" use:enhance class="settings-form">
      <div class="form-field">
        <label for="name">Name</label>
        <input type="text" id="name" name="name" value={data.community.name} maxlength="128" />
      </div>
      <div class="form-field">
        <label for="description">Description</label>
        <textarea id="description" name="description" rows="3" maxlength="2000"
          >{data.community.description ?? ''}</textarea
        >
      </div>
      <div class="form-field">
        <label for="rules">Rules</label>
        <textarea id="rules" name="rules" rows="5" maxlength="10000"
          >{data.community.rules ?? ''}</textarea
        >
      </div>
      <div class="form-field">
        <label for="joinPolicy">Join Policy</label>
        <select id="joinPolicy" name="joinPolicy">
          <option value="open" selected={data.community.joinPolicy === 'open'}>Open</option>
          <option value="approval" selected={data.community.joinPolicy === 'approval'}
            >Approval</option
          >
          <option value="invite" selected={data.community.joinPolicy === 'invite'}
            >Invite Only</option
          >
        </select>
      </div>
      <button type="submit" class="btn btn-primary">Save Changes</button>
    </form>
  </section>

  <section class="settings-section">
    <h2>Invites</h2>
    <InviteLinkGenerator slug={data.community.slug} invites={data.invites} />
  </section>

  <section class="settings-section">
    <h2>Members ({data.members.length})</h2>
    <div class="members-list">
      {#each data.members as member (member.userId)}
        <div class="member-row">
          <MemberCard {member} />
          {#if data.community.currentUserRole === 'owner' || data.community.currentUserRole === 'admin'}
            <div class="member-actions">
              <RoleSelector
                slug={data.community.slug}
                userId={member.userId}
                currentRole={member.role}
                actorRole={data.community.currentUserRole ?? 'member'}
              />
              {#if member.role !== 'owner'}
                <form method="POST" action="?/kick" use:enhance class="inline-form">
                  <input type="hidden" name="userId" value={member.userId} />
                  <button
                    type="submit"
                    class="btn btn-small btn-danger-outline"
                    aria-label="Kick {member.user.username}"
                  >
                    Kick
                  </button>
                </form>
                <button
                  class="btn btn-small btn-danger-outline"
                  onclick={() => (banTargetId = member.userId)}
                  aria-label="Ban {member.user.username}"
                >
                  Ban
                </button>
              {/if}
            </div>
          {/if}
        </div>
        {#if banTargetId === member.userId}
          <BanForm
            slug={data.community.slug}
            userId={member.userId}
            oncancel={() => (banTargetId = null)}
          />
        {/if}
      {/each}
    </div>
  </section>

  <section class="settings-section">
    <h2>Bans ({data.bans.length})</h2>
    {#if data.bans.length === 0}
      <p class="empty-text">No banned users.</p>
    {:else}
      <div class="bans-list">
        {#each data.bans as ban (ban.id)}
          <div class="ban-row">
            <div class="ban-info">
              <strong>{ban.user.displayName ?? ban.user.username}</strong>
              {#if ban.reason}
                <span class="ban-reason">— {ban.reason}</span>
              {/if}
              {#if ban.expiresAt}
                <span class="ban-expiry"
                  >Expires: {new Date(ban.expiresAt).toLocaleDateString()}</span
                >
              {/if}
            </div>
            <form method="POST" action="?/unban" use:enhance class="inline-form">
              <input type="hidden" name="userId" value={ban.user.id} />
              <button type="submit" class="btn btn-small">Unban</button>
            </form>
          </div>
        {/each}
      </div>
    {/if}
  </section>

  {#if data.community.currentUserRole === 'owner'}
    <section class="settings-section danger-zone">
      <h2>Danger Zone</h2>
      {#if deleteConfirm}
        <form method="POST" action="?/delete" use:enhance>
          <p>This will permanently delete the community and all its data. This cannot be undone.</p>
          <div class="danger-actions">
            <button type="submit" class="btn btn-danger">Delete Community</button>
            <button type="button" class="btn btn-secondary" onclick={() => (deleteConfirm = false)}
              >Cancel</button
            >
          </div>
        </form>
      {:else}
        <button class="btn btn-danger-outline" onclick={() => (deleteConfirm = true)}>
          Delete Community
        </button>
      {/if}
    </section>
  {/if}
</div>

<style>
  .settings-page {
    max-width: var(--layout-content-width, 960px);
    margin: 0 auto;
  }

  .settings-section {
    margin-bottom: var(--space-xl, 3rem);
    padding: var(--space-lg, 2rem);
    border: 1px solid var(--color-border, #e5e5e5);
    border-radius: var(--radius-md, 6px);
    background: var(--color-surface, #ffffff);
  }

  .settings-section h2 {
    font-size: var(--font-size-lg, 1.25rem);
    color: var(--color-text, #1a1a1a);
    margin-bottom: var(--space-md, 1rem);
  }

  .settings-form {
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

  .members-list,
  .bans-list {
    display: flex;
    flex-direction: column;
    gap: var(--space-sm, 0.5rem);
  }

  .member-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--space-sm, 0.5rem);
    border-bottom: 1px solid var(--color-border, #e5e5e5);
  }

  .member-actions {
    display: flex;
    gap: var(--space-xs, 0.25rem);
    align-items: center;
  }

  .ban-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--space-sm, 0.5rem);
    border-bottom: 1px solid var(--color-border, #e5e5e5);
  }

  .ban-info {
    display: flex;
    gap: var(--space-sm, 0.5rem);
    align-items: center;
    color: var(--color-text, #1a1a1a);
  }

  .ban-reason,
  .ban-expiry {
    color: var(--color-text-secondary, #666);
    font-size: var(--font-size-sm, 0.875rem);
  }

  .empty-text {
    color: var(--color-text-secondary, #666);
  }

  .inline-form {
    display: inline;
  }

  .danger-zone {
    border-color: var(--color-error, #dc2626);
  }

  .danger-zone h2 {
    color: var(--color-error, #dc2626);
  }

  .danger-actions {
    display: flex;
    gap: var(--space-sm, 0.5rem);
    margin-top: var(--space-md, 1rem);
  }

  .btn {
    padding: var(--space-sm, 0.5rem) var(--space-md, 1rem);
    border: none;
    border-radius: var(--radius-md, 6px);
    font-size: var(--font-size-md, 1rem);
    cursor: pointer;
    text-decoration: none;
  }

  .btn-primary {
    background: var(--color-primary, #2563eb);
    color: var(--color-on-primary, #ffffff);
  }

  .btn-secondary {
    background: var(--color-surface-secondary, #f5f5f5);
    color: var(--color-text, #1a1a1a);
    border: 1px solid var(--color-border, #e5e5e5);
  }

  .btn-small {
    padding: var(--space-xs, 0.25rem) var(--space-sm, 0.5rem);
    font-size: var(--font-size-xs, 0.75rem);
    background: var(--color-surface-secondary, #f5f5f5);
    color: var(--color-text, #1a1a1a);
    border: 1px solid var(--color-border, #e5e5e5);
  }

  .btn-danger {
    background: var(--color-error, #dc2626);
    color: var(--color-on-primary, #ffffff);
  }

  .btn-danger-outline {
    color: var(--color-error, #dc2626);
    border: 1px solid var(--color-error, #dc2626);
    background: transparent;
  }
</style>
