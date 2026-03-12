// Editor composable — wraps @commonpub/editor for content pages
import { createCommonPubEditor, docToBlockTuples } from '@commonpub/editor';
import type { CreateCommonPubEditorOptions, BlockTuple } from '@commonpub/editor';
import type { Editor } from '@tiptap/core';

export function useEditor(options?: Partial<CreateCommonPubEditorOptions>) {
  const editor = ref<Editor | null>(null);
  const content = ref<BlockTuple[]>(options?.content ?? []);
  const isDirty = ref(false);
  const selectedBlock = ref<{ type: string; attrs: Record<string, unknown> } | null>(null);

  onMounted(() => {
    editor.value = createCommonPubEditor({
      content: options?.content,
      editable: options?.editable ?? true,
      ...options,
      onUpdate: (blocks: BlockTuple[]) => {
        content.value = blocks;
        isDirty.value = true;
        options?.onUpdate?.(blocks);
      },
    });

    editor.value.on('selectionUpdate', ({ editor: e }) => {
      const { $anchor } = e.state.selection;
      const node = $anchor.parent;
      if (node && node.type.name !== 'doc') {
        selectedBlock.value = { type: node.type.name, attrs: { ...node.attrs } };
      } else {
        selectedBlock.value = null;
      }
    });
  });

  onBeforeUnmount(() => {
    editor.value?.destroy();
    editor.value = null;
  });

  return { editor, content, isDirty, selectedBlock };
}
