<script setup lang="ts">
import type { BlockEditor } from '~/composables/useBlockEditor';
import type { BlockTypeGroup } from './BlockPicker.vue';

const props = defineProps<{
  blockEditor: BlockEditor;
  metadata: Record<string, unknown>;
}>();

const emit = defineEmits<{
  'update:metadata': [metadata: Record<string, unknown>];
}>();

function updateMeta(key: string, value: unknown): void {
  emit('update:metadata', { ...props.metadata, [key]: value });
}

// --- Block types available for article editor ---
const blockTypes: BlockTypeGroup[] = [
  {
    name: 'Text',
    blocks: [
      { type: 'paragraph', label: 'Paragraph', icon: 'fa-align-left', description: 'Body text' },
      { type: 'heading', label: 'Heading', icon: 'fa-heading', description: 'Section header' },
      { type: 'blockquote', label: 'Quote', icon: 'fa-quote-left', description: 'Blockquote with attribution' },
    ],
  },
  {
    name: 'Media',
    blocks: [
      { type: 'image', label: 'Image', icon: 'fa-image', description: 'Upload or embed image' },
      { type: 'video', label: 'Video Embed', icon: 'fa-film', description: 'YouTube, Vimeo, etc.' },
      { type: 'horizontal_rule', label: 'Divider', icon: 'fa-minus', description: 'Visual separator' },
    ],
  },
  {
    name: 'Rich',
    blocks: [
      { type: 'code_block', label: 'Code Block', icon: 'fa-code', description: 'Syntax highlighted code' },
      { type: 'callout', label: 'Callout', icon: 'fa-circle-info', description: 'Tip, warning, or note', attrs: { variant: 'info' } },
      { type: 'embed', label: 'Embed', icon: 'fa-globe', description: 'External embed' },
    ],
  },
];

// --- Right panel section state ---
const openSections = ref<Record<string, boolean>>({
  metadata: true, seo: false, visibility: true, cover: false,
});

function toggleSection(key: string): void {
  openSections.value[key] = !openSections.value[key];
}

const tags = computed(() => (props.metadata.tags as string[]) || []);
function onTagsUpdate(newTags: string[]): void { updateMeta('tags', newTags); }

const visibility = computed(() => (props.metadata.visibility as string) || 'public');
function onVisibilityUpdate(val: string): void { updateMeta('visibility', val); }
</script>

<template>
  <div class="cpub-ae-shell">
    <!-- LEFT: Block Library sidebar -->
    <aside class="cpub-ae-left" aria-label="Block library">
      <EditorsEditorBlocks :groups="blockTypes" :block-editor="blockEditor" />
    </aside>

    <!-- CENTER: Block Canvas -->
    <div class="cpub-ae-canvas">
      <div class="cpub-ae-canvas-inner">
        <EditorsBlockCanvas :block-editor="blockEditor" :block-types="blockTypes" />
      </div>
    </div>

    <!-- RIGHT: Properties -->
    <aside class="cpub-ae-right" aria-label="Document properties">
      <div class="cpub-ae-right-body">
        <EditorsEditorSection title="Metadata" icon="fa-sliders" :open="openSections.metadata" @toggle="toggleSection('metadata')">
          <div class="cpub-ep-field">
            <label class="cpub-ep-flabel">Slug</label>
            <input class="cpub-ep-input" type="text" :value="metadata.slug" placeholder="auto-generated" @input="updateMeta('slug', ($event.target as HTMLInputElement).value)">
          </div>
          <div class="cpub-ep-field">
            <label class="cpub-ep-flabel">Description</label>
            <textarea class="cpub-ep-textarea" rows="3" :value="metadata.description as string" placeholder="Brief description..." @input="updateMeta('description', ($event.target as HTMLTextAreaElement).value)" />
          </div>
          <div class="cpub-ep-field">
            <label class="cpub-ep-flabel">Category</label>
            <select class="cpub-ep-select" :value="metadata.category || ''" @change="updateMeta('category', ($event.target as HTMLSelectElement).value)">
              <option value="">Select category</option>
              <option value="tutorial">Tutorial</option>
              <option value="deep-dive">Deep Dive</option>
              <option value="opinion">Opinion</option>
            </select>
          </div>
          <div class="cpub-ep-field">
            <label class="cpub-ep-flabel">Tags</label>
            <EditorsEditorTagInput :tags="tags" @update:tags="onTagsUpdate" />
          </div>
        </EditorsEditorSection>

        <EditorsEditorSection title="SEO" icon="fa-magnifying-glass" :open="openSections.seo" @toggle="toggleSection('seo')">
          <div class="cpub-ep-field">
            <label class="cpub-ep-flabel">SEO Description</label>
            <textarea class="cpub-ep-textarea" rows="3" :value="metadata.seoDescription as string" placeholder="Search engine description..." @input="updateMeta('seoDescription', ($event.target as HTMLTextAreaElement).value)" />
            <span class="cpub-ep-hint">{{ ((metadata.seoDescription as string) || '').length }}/160</span>
          </div>
        </EditorsEditorSection>

        <EditorsEditorSection title="Visibility" icon="fa-eye" :open="openSections.visibility" @toggle="toggleSection('visibility')">
          <EditorsEditorVisibility :model-value="visibility" @update:model-value="onVisibilityUpdate" />
        </EditorsEditorSection>

        <EditorsEditorSection title="Cover Image" icon="fa-image" :open="openSections.cover" @toggle="toggleSection('cover')">
          <div class="cpub-ep-field">
            <label class="cpub-ep-flabel">Image URL</label>
            <input class="cpub-ep-input" type="url" :value="metadata.coverImage" placeholder="https://..." @input="updateMeta('coverImage', ($event.target as HTMLInputElement).value)">
          </div>
        </EditorsEditorSection>
      </div>
    </aside>
  </div>
</template>

<style scoped>
.cpub-ae-shell { display: flex; flex: 1; overflow: hidden; }
.cpub-ae-left { width: 220px; flex-shrink: 0; background: var(--surface); border-right: 2px solid var(--border); display: flex; flex-direction: column; overflow: hidden; }
.cpub-ae-canvas { flex: 1; overflow-y: auto; background: var(--bg); }
.cpub-ae-canvas-inner { max-width: 740px; margin: 0 auto; }
.cpub-ae-right { width: 280px; flex-shrink: 0; background: var(--surface); border-left: 2px solid var(--border); display: flex; flex-direction: column; overflow: hidden; }
.cpub-ae-right-body { flex: 1; overflow-y: auto; }

@media (max-width: 1024px) { .cpub-ae-left, .cpub-ae-right { display: none; } }
</style>
