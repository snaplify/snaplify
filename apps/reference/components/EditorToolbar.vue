<script setup lang="ts">
import type { Editor } from '@tiptap/core';

const props = defineProps<{
  editor: Editor | null;
}>();

function isActive(name: string, attrs?: Record<string, unknown>): boolean {
  return props.editor?.isActive(name, attrs) ?? false;
}

const inlineActions = computed(() => [
  { label: 'Bold', icon: 'fa-solid fa-bold', action: () => props.editor?.chain().focus().toggleBold().run(), active: isActive('bold'), shortcut: 'Ctrl+B' },
  { label: 'Italic', icon: 'fa-solid fa-italic', action: () => props.editor?.chain().focus().toggleItalic().run(), active: isActive('italic'), shortcut: 'Ctrl+I' },
  { label: 'Code', icon: 'fa-solid fa-code', action: () => props.editor?.chain().focus().toggleCode().run(), active: isActive('code'), shortcut: 'Ctrl+E' },
  { label: 'Strikethrough', icon: 'fa-solid fa-strikethrough', action: () => props.editor?.chain().focus().toggleStrike().run(), active: isActive('strike'), shortcut: 'Ctrl+Shift+S' },
]);

const blockActions = computed(() => [
  { label: 'Heading 2', text: 'H2', action: () => props.editor?.chain().focus().toggleHeading({ level: 2 }).run(), active: isActive('heading', { level: 2 }) },
  { label: 'Heading 3', text: 'H3', action: () => props.editor?.chain().focus().toggleHeading({ level: 3 }).run(), active: isActive('heading', { level: 3 }) },
  { label: 'Bullet List', icon: 'fa-solid fa-list-ul', action: () => props.editor?.chain().focus().toggleBulletList().run(), active: isActive('bulletList') },
  { label: 'Ordered List', icon: 'fa-solid fa-list-ol', action: () => props.editor?.chain().focus().toggleOrderedList().run(), active: isActive('orderedList') },
  { label: 'Blockquote', icon: 'fa-solid fa-quote-left', action: () => props.editor?.chain().focus().toggleBlockquote().run(), active: isActive('blockquote') },
  { label: 'Code Block', icon: 'fa-solid fa-file-code', action: () => props.editor?.chain().focus().toggleCodeBlock().run(), active: isActive('codeBlock') },
  { label: 'Divider', icon: 'fa-solid fa-minus', action: () => props.editor?.chain().focus().setHorizontalRule().run(), active: false },
]);
</script>

<template>
  <div class="cpub-toolbar" role="toolbar" aria-label="Formatting toolbar">
    <div class="cpub-toolbar-group">
      <button
        v-for="action in inlineActions"
        :key="action.label"
        class="cpub-toolbar-btn"
        :class="{ 'cpub-toolbar-btn-active': action.active }"
        :aria-label="action.label"
        :aria-pressed="action.active"
        :title="`${action.label} (${action.shortcut})`"
        @click="action.action?.()"
      >
        <i :class="action.icon"></i>
      </button>
    </div>

    <div class="cpub-toolbar-divider" aria-hidden="true" />

    <div class="cpub-toolbar-group">
      <button
        v-for="action in blockActions"
        :key="action.label"
        class="cpub-toolbar-btn"
        :class="{ 'cpub-toolbar-btn-active': action.active }"
        :aria-label="action.label"
        :aria-pressed="action.active"
        @click="action.action?.()"
      >
        <template v-if="action.text">{{ action.text }}</template>
        <i v-else :class="action.icon"></i>
      </button>
    </div>
  </div>
</template>

<style scoped>
.cpub-toolbar {
  display: flex;
  align-items: center;
  gap: var(--space-1);
  padding: var(--space-2) var(--space-3);
  background: var(--surface);
  border: 2px solid var(--border);
  margin-bottom: var(--space-4);
  flex-wrap: wrap;
}

.cpub-toolbar-group {
  display: flex;
  gap: 2px;
}

.cpub-toolbar-divider {
  width: 2px;
  height: 22px;
  background: var(--border2);
  margin: 0 var(--space-2);
}

.cpub-toolbar-btn {
  padding: var(--space-1) var(--space-2);
  min-width: 30px;
  height: 30px;
  background: none;
  border: 2px solid transparent;
  font-family: var(--font-mono);
  font-size: 12px;
  font-weight: var(--font-weight-semibold);
  color: var(--text-dim);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s;
}

.cpub-toolbar-btn:hover {
  background: var(--surface2);
  border-color: var(--border2);
  color: var(--text);
}

.cpub-toolbar-btn-active {
  background: var(--accent-bg);
  border-color: var(--accent-border);
  color: var(--accent);
}

.cpub-toolbar-btn:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 1px;
}
</style>
