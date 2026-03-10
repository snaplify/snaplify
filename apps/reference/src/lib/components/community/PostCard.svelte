<script lang="ts">
  import { enhance } from '$app/forms';
  import type { CommunityPostItem } from '$lib/types';
  import { hasPermission } from '$lib/utils/community-permissions';

  let { post, slug, userRole = null }: {
    post: CommunityPostItem;
    slug: string;
    userRole: string | null;
  } = $props();

  const canModerate = userRole ? hasPermission(userRole, 'pinPost') : false;
  const isAuthor = false; // Would need current user ID to determine
</script>

<article class="post-card" class:post-pinned={post.isPinned} class:post-locked={post.isLocked}>
  <div class="post-header">
    <div class="post-author">
      {#if post.author.avatarUrl}
        <img src={post.author.avatarUrl} alt="" class="author-avatar" width="32" height="32" />
      {:else}
        <span class="author-avatar-placeholder">{post.author.displayName?.[0] ?? post.author.username[0]}</span>
      {/if}
      <div class="author-info">
        <span class="author-name">{post.author.displayName ?? post.author.username}</span>
        <time class="post-time" datetime={new Date(post.createdAt).toISOString()}>
          {new Date(post.createdAt).toLocaleDateString()}
        </time>
      </div>
    </div>

    <div class="post-badges">
      {#if post.isPinned}
        <span class="badge badge-pinned" aria-label="Pinned">Pinned</span>
      {/if}
      {#if post.isLocked}
        <span class="badge badge-locked" aria-label="Locked">Locked</span>
      {/if}
      {#if post.type !== 'text'}
        <span class="badge badge-type">{post.type}</span>
      {/if}
    </div>
  </div>

  <div class="post-content">
    {#if post.type === 'share' && post.sharedContent}
      <div class="shared-content">
        <span class="shared-label">Shared</span>
        <a href="/{post.sharedContent.type}/{post.sharedContent.slug}" class="shared-link">
          {post.sharedContent.title}
        </a>
      </div>
    {:else if post.type === 'link'}
      <a href={post.content} class="link-content" target="_blank" rel="noopener noreferrer">
        {post.content}
      </a>
    {:else}
      <p>{post.content}</p>
    {/if}
  </div>

  <div class="post-actions">
    <span class="action-stat">{post.likeCount} likes</span>
    <span class="action-stat">{post.replyCount} replies</span>

    {#if canModerate}
      <form method="POST" action="/communities/{slug}?/pinPost" use:enhance class="inline-form">
        <input type="hidden" name="postId" value={post.id} />
        <button type="submit" class="action-btn" aria-label={post.isPinned ? 'Unpin post' : 'Pin post'}>
          {post.isPinned ? 'Unpin' : 'Pin'}
        </button>
      </form>
      <form method="POST" action="/communities/{slug}?/lockPost" use:enhance class="inline-form">
        <input type="hidden" name="postId" value={post.id} />
        <button type="submit" class="action-btn" aria-label={post.isLocked ? 'Unlock post' : 'Lock post'}>
          {post.isLocked ? 'Unlock' : 'Lock'}
        </button>
      </form>
      <form method="POST" action="/communities/{slug}?/deletePost" use:enhance class="inline-form">
        <input type="hidden" name="postId" value={post.id} />
        <button type="submit" class="action-btn action-danger" aria-label="Delete post">Delete</button>
      </form>
    {/if}
  </div>
</article>

<style>
  .post-card {
    padding: var(--space-md, 1rem);
    border: 1px solid var(--color-border, #e5e5e5);
    border-radius: var(--radius-md, 6px);
    background: var(--color-surface, #ffffff);
  }

  .post-pinned {
    border-color: var(--color-warning, #f59e0b);
    background: var(--color-warning-bg, #fffbeb);
  }

  .post-locked {
    opacity: 0.8;
  }

  .post-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--space-sm, 0.5rem);
  }

  .post-author {
    display: flex;
    gap: var(--space-sm, 0.5rem);
    align-items: center;
  }

  .author-avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    object-fit: cover;
  }

  .author-avatar-placeholder {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: var(--color-primary, #2563eb);
    color: var(--color-on-primary, #ffffff);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-weight: var(--font-weight-bold, 700);
    font-size: var(--font-size-sm, 0.875rem);
  }

  .author-info {
    display: flex;
    flex-direction: column;
  }

  .author-name {
    font-weight: var(--font-weight-medium, 500);
    color: var(--color-text, #1a1a1a);
    font-size: var(--font-size-sm, 0.875rem);
  }

  .post-time {
    font-size: var(--font-size-xs, 0.75rem);
    color: var(--color-text-secondary, #666);
  }

  .post-badges {
    display: flex;
    gap: var(--space-xs, 0.25rem);
  }

  .badge {
    padding: 0 var(--space-xs, 0.25rem);
    border-radius: var(--radius-sm, 4px);
    font-size: var(--font-size-xs, 0.75rem);
    font-weight: var(--font-weight-medium, 500);
  }

  .badge-pinned {
    background: var(--color-warning-bg, #fffbeb);
    color: var(--color-warning, #f59e0b);
  }

  .badge-locked {
    background: var(--color-surface-secondary, #f5f5f5);
    color: var(--color-text-secondary, #666);
  }

  .badge-type {
    background: var(--color-info-bg, #eff6ff);
    color: var(--color-info, #3b82f6);
    text-transform: capitalize;
  }

  .post-content {
    margin-bottom: var(--space-sm, 0.5rem);
    color: var(--color-text, #1a1a1a);
  }

  .post-content p {
    margin: 0;
    white-space: pre-wrap;
  }

  .shared-content {
    padding: var(--space-sm, 0.5rem);
    border: 1px solid var(--color-border, #e5e5e5);
    border-radius: var(--radius-sm, 4px);
    background: var(--color-surface-secondary, #f5f5f5);
  }

  .shared-label {
    font-size: var(--font-size-xs, 0.75rem);
    color: var(--color-text-secondary, #666);
    margin-right: var(--space-xs, 0.25rem);
  }

  .shared-link {
    color: var(--color-primary, #2563eb);
    font-weight: var(--font-weight-medium, 500);
  }

  .link-content {
    color: var(--color-primary, #2563eb);
    word-break: break-all;
  }

  .post-actions {
    display: flex;
    gap: var(--space-md, 1rem);
    align-items: center;
    padding-top: var(--space-sm, 0.5rem);
    border-top: 1px solid var(--color-border, #e5e5e5);
  }

  .action-stat {
    font-size: var(--font-size-sm, 0.875rem);
    color: var(--color-text-secondary, #666);
  }

  .action-btn {
    background: none;
    border: none;
    color: var(--color-text-secondary, #666);
    font-size: var(--font-size-sm, 0.875rem);
    cursor: pointer;
    padding: 0;
  }

  .action-btn:hover {
    color: var(--color-primary, #2563eb);
  }

  .action-danger:hover {
    color: var(--color-error, #dc2626);
  }

  .inline-form {
    display: inline;
  }
</style>
