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

const blockTypes: BlockTypeGroup[] = [
  {
    name: 'Text',
    blocks: [
      { type: 'paragraph', label: 'Paragraph', icon: 'fa-align-left', description: 'Body text' },
      { type: 'heading', label: 'Heading', icon: 'fa-heading', description: 'Section header' },
      { type: 'blockquote', label: 'Quote', icon: 'fa-quote-left', description: 'Blockquote' },
    ],
  },
  {
    name: 'Media',
    blocks: [
      { type: 'image', label: 'Image', icon: 'fa-image', description: 'Upload or embed' },
      { type: 'code_block', label: 'Code Block', icon: 'fa-code', description: 'Syntax highlighted code' },
      { type: 'horizontal_rule', label: 'Divider', icon: 'fa-minus', description: 'Visual separator' },
    ],
  },
  {
    name: 'Rich',
    blocks: [
      { type: 'callout', label: 'Callout', icon: 'fa-circle-info', description: 'Tip, warning, or note', attrs: { variant: 'info' } },
      { type: 'embed', label: 'Embed', icon: 'fa-globe', description: 'External embed' },
    ],
  },
];

const openSections = ref<Record<string, boolean>>({
  meta: true, excerpt: false, seo: false, publishing: true,
});
function toggleSection(key: string): void {
  openSections.value[key] = !openSections.value[key];
}

const tags = computed(() => (props.metadata.tags as string[]) || []);
function onTagsUpdate(newTags: string[]): void { updateMeta('tags', newTags); }
</script>

<template>
  <div class="cpub-be-shell">
    <!-- CENTER: Block Canvas -->
    <div class="cpub-be-canvas">
      <div class="cpub-be-canvas-inner">
        <EditorsBlockCanvas :block-editor="blockEditor" :block-types="blockTypes" />
      </div>
    </div>

    <!-- RIGHT: Properties -->
    <aside class="cpub-be-right" aria-label="Blog properties">
      <div class="cpub-be-right-body">
        <EditorsEditorSection title="Meta" icon="fa-sliders" :open="openSections.meta" @toggle="toggleSection('meta')">
          <div class="cpub-ep-field">
            <label class="cpub-ep-flabel">Slug</label>
            <input class="cpub-ep-input" type="text" :value="metadata.slug" placeholder="auto-generated" @input="updateMeta('slug', ($event.target as HTMLInputElement).value)">
          </div>
          <div class="cpub-ep-field">
            <label class="cpub-ep-flabel">Description</label>
            <textarea class="cpub-ep-textarea" rows="3" :value="metadata.description as string" placeholder="Brief description..." @input="updateMeta('description', ($event.target as HTMLTextAreaElement).value)" />
          </div>
          <div class="cpub-ep-field">
            <label class="cpub-ep-flabel">Tags</label>
            <EditorsEditorTagInput :tags="tags" @update:tags="onTagsUpdate" />
          </div>
        </EditorsEditorSection>

        <EditorsEditorSection title="Excerpt" icon="fa-quote-left" :open="openSections.excerpt" @toggle="toggleSection('excerpt')">
          <div class="cpub-ep-field">
            <textarea class="cpub-ep-textarea" rows="3" :value="metadata.excerpt as string" placeholder="Custom excerpt for feeds and social sharing..." @input="updateMeta('excerpt', ($event.target as HTMLTextAreaElement).value)" />
          </div>
        </EditorsEditorSection>

        <EditorsEditorSection title="SEO" icon="fa-magnifying-glass" :open="openSections.seo" @toggle="toggleSection('seo')">
          <div class="cpub-ep-field">
            <label class="cpub-ep-flabel">SEO Description</label>
            <textarea class="cpub-ep-textarea" rows="3" :value="metadata.seoDescription as string" placeholder="Search engine description..." @input="updateMeta('seoDescription', ($event.target as HTMLTextAreaElement).value)" />
            <span class="cpub-ep-hint">{{ ((metadata.seoDescription as string) || '').length }}/160</span>
          </div>
        </EditorsEditorSection>

        <EditorsEditorSection title="Publishing" icon="fa-calendar" :open="openSections.publishing" @toggle="toggleSection('publishing')">
          <EditorsEditorVisibility :model-value="(metadata.visibility as string) || 'public'" @update:model-value="(v: string) => updateMeta('visibility', v)" />
        </EditorsEditorSection>
      </div>
    </aside>
  </div>
</template>

<style scoped>
.cpub-be-shell { display: flex; flex: 1; overflow: hidden; }
.cpub-be-canvas { flex: 1; overflow-y: auto; background: var(--bg); }
.cpub-be-canvas-inner { max-width: 720px; margin: 0 auto; }
.cpub-be-right { width: 320px; flex-shrink: 0; background: var(--surface); border-left: 2px solid var(--border); display: flex; flex-direction: column; overflow: hidden; }
.cpub-be-right-body { flex: 1; overflow-y: auto; }

@media (max-width: 1024px) { .cpub-be-right { display: none; } }
</style>
