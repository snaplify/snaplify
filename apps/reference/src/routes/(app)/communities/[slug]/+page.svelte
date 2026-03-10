<script lang="ts">
  import { enhance } from '$app/forms';
  import CommunityHeader from '$lib/components/community/CommunityHeader.svelte';
  import CommunityNav from '$lib/components/community/CommunityNav.svelte';
  import PostCard from '$lib/components/community/PostCard.svelte';
  import PostComposer from '$lib/components/community/PostComposer.svelte';
  import type { PageData, ActionData } from './$types';

  let { data, form }: { data: PageData; form: ActionData } = $props();
</script>

<svelte:head>
  <title>{data.community.name} — Snaplify</title>
</svelte:head>

<div class="community-page">
  <CommunityHeader community={data.community} />
  <CommunityNav slug={data.community.slug} active="feed" role={data.community.currentUserRole} />

  {#if form?.error}
    <div class="error-banner" role="alert">{form.error}</div>
  {/if}

  {#if data.community.currentUserRole && !data.community.isBanned}
    <PostComposer slug={data.community.slug} />
  {/if}

  {#if data.community.isBanned}
    <div class="banned-banner" role="alert">
      You are banned from this community.
    </div>
  {/if}

  <div class="posts-feed">
    {#if data.posts.length === 0}
      <div class="empty-state">
        <p>No posts yet. Be the first to post!</p>
      </div>
    {:else}
      {#each data.posts as post (post.id)}
        <PostCard
          {post}
          slug={data.community.slug}
          userRole={data.community.currentUserRole}
        />
      {/each}
    {/if}
  </div>
</div>

<style>
  .community-page {
    max-width: var(--layout-content-width, 960px);
    margin: 0 auto;
  }

  .error-banner {
    padding: var(--space-sm, 0.5rem) var(--space-md, 1rem);
    background: var(--color-error-bg, #fef2f2);
    color: var(--color-error, #dc2626);
    border-radius: var(--radius-md, 6px);
    margin-bottom: var(--space-md, 1rem);
  }

  .banned-banner {
    padding: var(--space-sm, 0.5rem) var(--space-md, 1rem);
    background: var(--color-warning-bg, #fffbeb);
    color: var(--color-warning, #f59e0b);
    border-radius: var(--radius-md, 6px);
    margin-bottom: var(--space-md, 1rem);
  }

  .posts-feed {
    display: flex;
    flex-direction: column;
    gap: var(--space-md, 1rem);
  }

  .empty-state {
    text-align: center;
    padding: var(--space-xl, 3rem);
    color: var(--color-text-secondary, #666);
  }
</style>
