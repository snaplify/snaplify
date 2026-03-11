<script lang="ts">
  import { enhance } from '$app/forms';
  import ContentEditor from '$lib/components/ContentEditor.svelte';
  import EditorLayout from '$lib/components/editor/EditorLayout.svelte';
  import BlockLibrary from '$lib/components/editor/BlockLibrary.svelte';
  import PropertiesPanel from '$lib/components/editor/PropertiesPanel.svelte';
  import type { BlockInfo } from '$lib/components/editor/PropertiesPanel.svelte';
  import type { ActionData } from './$types';

  let { form }: { form: ActionData } = $props();

  let title = $state('');
  let description = $state('');
  let tags = $state('');
  let coverImageUrl = $state('');
  let contentBlocks = $state<unknown[]>([]);
  let selectedBlock = $state<BlockInfo | null>(null);
  let editorRef: ContentEditor | undefined = $state();
  let formEl: HTMLFormElement | undefined = $state();

  const blockCategories = [
    {
      label: 'Basic',
      blocks: [
        { type: 'paragraph', label: 'Text', icon: '¶', description: 'Plain text block' },
        { type: 'heading', label: 'Heading', icon: 'H', description: 'Section heading' },
        { type: 'blockquote', label: 'Quote', icon: 'QT', description: 'Blockquote' },
        { type: 'callout', label: 'Callout', icon: '!', description: 'Info/tip/warning box' },
        { type: 'bulletList', label: 'Bullet List', icon: '•', description: 'Unordered list' },
        { type: 'orderedList', label: 'Number List', icon: '#', description: 'Ordered list' },
        { type: 'horizontalRule', label: 'Divider', icon: '—', description: 'Horizontal rule' },
      ],
    },
    {
      label: 'Media',
      blocks: [
        { type: 'codeBlock', label: 'Code', icon: '<>', description: 'Syntax-highlighted code' },
        { type: 'image', label: 'Image', icon: 'IMG', description: 'Image with caption' },
      ],
    },
  ];

  function handleEditorUpdate(blocks: unknown[]) {
    contentBlocks = blocks;
  }

  function handleBlockSelect(info: { type: string; attrs: Record<string, unknown>; pos: number } | null) {
    selectedBlock = info;
  }

  function handleBlockAttr(attr: string, value: unknown) {
    if (!selectedBlock || !editorRef) return;
    // Update via ContentEditor's TipTap instance
    selectedBlock = { ...selectedBlock, attrs: { ...selectedBlock.attrs, [attr]: value } };
  }

  function handleMetaChange(field: string, value: string) {
    if (field === 'description') description = value;
    else if (field === 'tags') tags = value;
    else if (field === 'coverImageUrl') coverImageUrl = value;
  }

  function submitAs(action: string) {
    if (!formEl) return;
    const input = formEl.querySelector<HTMLInputElement>('input[name="action"]');
    if (input) input.value = action;
    formEl.requestSubmit();
  }
</script>

<svelte:head>
  <title>New Article — Snaplify</title>
</svelte:head>

<form method="POST" use:enhance bind:this={formEl} style="display:contents;">
  <input type="hidden" name="title" value={title} />
  <input type="hidden" name="description" value={description} />
  <input type="hidden" name="tags" value={tags} />
  <input type="hidden" name="coverImageUrl" value={coverImageUrl} />
  <input type="hidden" name="content" value={JSON.stringify(contentBlocks)} />
  <input type="hidden" name="action" value="draft" />

  <EditorLayout
    bind:title
    type="article"
    backHref="/create"
    ondraft={() => submitAs('draft')}
    onpublish={() => submitAs('publish')}
  >
    {#snippet leftPanel()}
      <BlockLibrary categories={blockCategories} />
    {/snippet}

    <div class="article-canvas">
      {#if form?.error}
        <div class="form-error" role="alert">{form.error}</div>
      {/if}

      <ContentEditor
        bind:this={editorRef}
        onupdate={handleEditorUpdate}
        onblockselect={handleBlockSelect}
      />
    </div>

    {#snippet rightPanel()}
      <PropertiesPanel
        {selectedBlock}
        meta={{ description, tags, coverImageUrl }}
        onblockattr={handleBlockAttr}
        onmetachange={handleMetaChange}
      />
    {/snippet}
  </EditorLayout>
</form>

<style>
  .article-canvas {
    min-height: 100%;
  }

  .form-error {
    padding: var(--space-2, 0.5rem) var(--space-3, 0.75rem);
    background: rgba(248, 113, 113, 0.08);
    border: 1px solid var(--color-error, #f87171);
    color: var(--color-error, #f87171);
    border-radius: var(--radius-sm, 4px);
    font-size: var(--text-xs, 0.75rem);
    margin-bottom: var(--space-4, 1rem);
  }
</style>
