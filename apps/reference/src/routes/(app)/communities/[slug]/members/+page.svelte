<script lang="ts">
  import CommunityHeader from '$lib/components/community/CommunityHeader.svelte';
  import CommunityNav from '$lib/components/community/CommunityNav.svelte';
  import MemberCard from '$lib/components/community/MemberCard.svelte';
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();
</script>

<svelte:head>
  <title>Members — {data.community.name} — Snaplify</title>
</svelte:head>

<div class="members-page">
  <CommunityHeader community={data.community} />
  <CommunityNav slug={data.community.slug} active="members" role={data.community.currentUserRole} />

  <div class="members-list">
    {#if data.members.length === 0}
      <div class="empty-state">
        <p>No members yet.</p>
      </div>
    {:else}
      {#each data.members as member (member.userId)}
        <MemberCard {member} />
      {/each}
    {/if}
  </div>
</div>

<style>
  .members-page {
    max-width: var(--layout-content-width, 960px);
    margin: 0 auto;
  }

  .members-list {
    display: flex;
    flex-direction: column;
    gap: 1px;
    background: var(--color-border, #e5e5e5);
    border: 1px solid var(--color-border, #e5e5e5);
    border-radius: var(--radius-md, 6px);
    overflow: hidden;
  }

  .empty-state {
    text-align: center;
    padding: var(--space-xl, 3rem);
    color: var(--color-text-secondary, #666);
    background: var(--color-surface, #ffffff);
  }
</style>
