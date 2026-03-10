<script lang="ts">
  import { enhance } from '$app/forms';

  let { slug }: { slug: string } = $props();
  let postType = $state('text');
</script>

<form method="POST" action="/communities/{slug}?/createPost" use:enhance class="post-composer">
  <div class="composer-type">
    <label>
      <input type="radio" name="type" value="text" bind:group={postType} />
      Text
    </label>
    <label>
      <input type="radio" name="type" value="link" bind:group={postType} />
      Link
    </label>
  </div>

  <textarea
    name="content"
    class="composer-content"
    rows="3"
    placeholder={postType === 'link' ? 'Paste a URL...' : 'What\'s on your mind?'}
    required
    maxlength="10000"
    aria-label={postType === 'link' ? 'Link URL' : 'Post content'}
  ></textarea>

  <button type="submit" class="btn btn-primary">Post</button>
</form>

<style>
  .post-composer {
    padding: var(--space-md, 1rem);
    border: 1px solid var(--color-border, #e5e5e5);
    border-radius: var(--radius-md, 6px);
    background: var(--color-surface, #ffffff);
    margin-bottom: var(--space-md, 1rem);
    display: flex;
    flex-direction: column;
    gap: var(--space-sm, 0.5rem);
  }

  .composer-type {
    display: flex;
    gap: var(--space-md, 1rem);
    font-size: var(--font-size-sm, 0.875rem);
    color: var(--color-text, #1a1a1a);
  }

  .composer-type label {
    display: flex;
    align-items: center;
    gap: var(--space-xs, 0.25rem);
    cursor: pointer;
  }

  .composer-content {
    padding: var(--space-sm, 0.5rem);
    border: 1px solid var(--color-border, #e5e5e5);
    border-radius: var(--radius-md, 6px);
    font-size: var(--font-size-md, 1rem);
    resize: vertical;
    background: var(--color-surface, #ffffff);
    color: var(--color-text, #1a1a1a);
  }

  .btn {
    padding: var(--space-sm, 0.5rem) var(--space-md, 1rem);
    border: none;
    border-radius: var(--radius-md, 6px);
    font-size: var(--font-size-md, 1rem);
    cursor: pointer;
    align-self: flex-end;
  }

  .btn-primary {
    background: var(--color-primary, #2563eb);
    color: var(--color-on-primary, #ffffff);
  }
</style>
