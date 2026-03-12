<script setup lang="ts">
import type { Editor } from '@tiptap/core';

const props = defineProps<{
  contentType: string;
  editor: Editor | null;
}>();

interface BlockItem {
  type: string;
  label: string;
  icon: string;
}

interface BlockGroup {
  name: string;
  items: BlockItem[];
  types: string[];
}

const groups: BlockGroup[] = [
  {
    name: 'Core',
    types: ['article', 'blog', 'project', 'explainer', 'guide'],
    items: [
      { type: 'paragraph', label: 'Text', icon: 'fa-solid fa-paragraph' },
      { type: 'heading', label: 'Heading', icon: 'fa-solid fa-heading' },
      { type: 'image', label: 'Image', icon: 'fa-solid fa-image' },
      { type: 'gallery', label: 'Gallery', icon: 'fa-solid fa-images' },
      { type: 'code_block', label: 'Code', icon: 'fa-solid fa-code' },
      { type: 'video', label: 'Video', icon: 'fa-solid fa-video' },
    ],
  },
  {
    name: 'Blog',
    types: ['article', 'blog', 'guide'],
    items: [
      { type: 'callout', label: 'Callout', icon: 'fa-solid fa-circle-exclamation' },
      { type: 'horizontal_rule', label: 'Divider', icon: 'fa-solid fa-minus' },
      { type: 'blockquote', label: 'Quote', icon: 'fa-solid fa-quote-left' },
      { type: 'embed', label: 'Embed', icon: 'fa-solid fa-globe' },
    ],
  },
  {
    name: 'Project',
    types: ['project'],
    items: [
      { type: 'partsList', label: 'Parts List', icon: 'fa-solid fa-list-check' },
      { type: 'buildStep', label: 'Build Step', icon: 'fa-solid fa-hammer' },
      { type: 'toolList', label: 'Tool List', icon: 'fa-solid fa-screwdriver-wrench' },
      { type: 'downloads', label: 'Downloads', icon: 'fa-solid fa-download' },
    ],
  },
  {
    name: 'Interactive',
    types: ['explainer'],
    items: [
      { type: 'quiz', label: 'Quiz', icon: 'fa-solid fa-circle-question' },
      { type: 'interactiveSlider', label: 'Slider', icon: 'fa-solid fa-sliders' },
      { type: 'checkpoint', label: 'Checkpoint', icon: 'fa-solid fa-flag-checkered' },
      { type: 'mathNotation', label: 'Math', icon: 'fa-solid fa-square-root-variable' },
    ],
  },
];

const filteredGroups = computed(() =>
  groups.filter((g) => g.types.includes(props.contentType)),
);

function insertBlock(type: string): void {
  if (!props.editor) return;

  switch (type) {
    case 'paragraph':
      props.editor.chain().focus().insertContent({ type: 'paragraph' }).run();
      break;
    case 'heading':
      props.editor.chain().focus().insertContent({ type: 'heading', attrs: { level: 2 } }).run();
      break;
    case 'image':
      props.editor.chain().focus().setImage({ src: '', alt: '' }).run();
      break;
    case 'code_block':
      props.editor.chain().focus().setCodeBlock().run();
      break;
    case 'horizontal_rule':
      props.editor.chain().focus().setHorizontalRule().run();
      break;
    case 'blockquote':
      props.editor.chain().focus().setBlockquote().run();
      break;
    case 'callout':
      props.editor.chain().focus().setCallout({ variant: 'info' }).run();
      break;
    case 'gallery':
      props.editor.chain().focus().setGallery({ images: [] }).run();
      break;
    case 'video':
      props.editor.chain().focus().setVideo({ url: '', platform: 'youtube' }).run();
      break;
    case 'embed':
      props.editor.chain().focus().setEmbed({ url: '', type: 'generic' }).run();
      break;
    case 'partsList':
      props.editor.chain().focus().setPartsList({ parts: [] }).run();
      break;
    case 'buildStep':
      props.editor.chain().focus().setBuildStep({ stepNumber: 1, instructions: '' }).run();
      break;
    case 'toolList':
      props.editor.chain().focus().setToolList({ tools: [] }).run();
      break;
    case 'downloads':
      props.editor.chain().focus().setDownloads({ files: [] }).run();
      break;
    case 'quiz':
      props.editor.chain().focus().setQuiz({ question: '', options: [] }).run();
      break;
    case 'interactiveSlider':
      props.editor.chain().focus().setInteractiveSlider({ label: '', min: 0, max: 100, step: 1, defaultValue: 50, states: [] }).run();
      break;
    case 'checkpoint':
      props.editor.chain().focus().setCheckpoint({ message: '' }).run();
      break;
    case 'mathNotation':
      props.editor.chain().focus().setMathNotation({ expression: '' }).run();
      break;
  }
}
</script>

<template>
  <aside class="cpub-block-library" aria-label="Block library">
    <div class="cpub-block-library-header">
      <span class="cpub-block-library-title">Blocks</span>
    </div>
    <div v-for="group in filteredGroups" :key="group.name" class="cpub-block-group">
      <span class="cpub-block-group-label">{{ group.name }}</span>
      <button
        v-for="item in group.items"
        :key="item.type"
        class="cpub-block-item"
        :aria-label="`Insert ${item.label} block`"
        @click="insertBlock(item.type)"
      >
        <span class="cpub-block-icon"><i :class="item.icon"></i></span>
        <span class="cpub-block-label">{{ item.label }}</span>
      </button>
    </div>
  </aside>
</template>

<style scoped>
.cpub-block-library {
  width: 230px;
  border-right: 2px solid var(--border);
  background: var(--surface);
  overflow-y: auto;
  flex-shrink: 0;
}

.cpub-block-library-header {
  padding: var(--space-3) var(--space-4);
  border-bottom: 1px solid var(--border2);
}

.cpub-block-library-title {
  font-family: var(--font-mono);
  font-size: 10px;
  font-weight: var(--font-weight-semibold);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--text-dim);
}

.cpub-block-group {
  padding: var(--space-2) var(--space-3);
}

.cpub-block-group-label {
  display: block;
  padding: var(--space-2) var(--space-1);
  font-family: var(--font-mono);
  font-size: 10px;
  font-weight: var(--font-weight-semibold);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--text-faint);
}

.cpub-block-item {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  width: 100%;
  padding: var(--space-2) var(--space-2);
  background: none;
  border: 2px solid transparent;
  cursor: pointer;
  font-family: var(--font-sans);
  font-size: var(--text-sm);
  color: var(--text);
  text-align: left;
  transition: all 0.15s;
}

.cpub-block-item:hover {
  background: var(--surface2);
  border-color: var(--border2);
}

.cpub-block-item:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: -2px;
}

.cpub-block-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  background: var(--surface2);
  border: 1px solid var(--border2);
  font-size: 12px;
  color: var(--text-dim);
  flex-shrink: 0;
}

.cpub-block-label {
  font-size: var(--text-sm);
}
</style>
