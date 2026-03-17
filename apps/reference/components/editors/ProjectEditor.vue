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
    name: 'Basic',
    blocks: [
      { type: 'paragraph', label: 'Text', icon: 'fa-align-left', description: 'Body text' },
      { type: 'heading', label: 'Heading', icon: 'fa-heading', description: 'Section header' },
      { type: 'image', label: 'Image', icon: 'fa-image', description: 'Upload or embed' },
      { type: 'code_block', label: 'Code Block', icon: 'fa-code', description: 'Syntax highlighted code' },
    ],
  },
  {
    name: 'Project',
    blocks: [
      { type: 'partsList', label: 'Parts List', icon: 'fa-list-check', description: 'BOM table' },
      { type: 'buildStep', label: 'Build Step', icon: 'fa-hammer', description: 'Numbered step' },
      { type: 'toolList', label: 'Tool List', icon: 'fa-wrench', description: 'Required tools' },
      { type: 'downloads', label: 'Downloads', icon: 'fa-download', description: 'File attachments' },
    ],
  },
  {
    name: 'Rich',
    blocks: [
      { type: 'callout', label: 'Tip', icon: 'fa-lightbulb', description: 'Tip callout', attrs: { variant: 'tip' } },
      { type: 'callout', label: 'Warning', icon: 'fa-triangle-exclamation', description: 'Warning callout', attrs: { variant: 'warning' } },
      { type: 'blockquote', label: 'Quote', icon: 'fa-quote-left', description: 'Blockquote' },
      { type: 'horizontal_rule', label: 'Divider', icon: 'fa-minus', description: 'Visual separator' },
    ],
  },
];

const openSections = ref<Record<string, boolean>>({
  meta: true, tags: true, visibility: true, cover: false, checklist: true,
});
function toggleSection(key: string): void {
  openSections.value[key] = !openSections.value[key];
}

const difficulties = ['beginner', 'intermediate', 'advanced'] as const;
const tags = computed(() => (props.metadata.tags as string[]) || []);
function onTagsUpdate(newTags: string[]): void { updateMeta('tags', newTags); }
const visibility = computed(() => (props.metadata.visibility as string) || 'public');
function onVisibilityUpdate(val: string): void { updateMeta('visibility', val); }

const checklist = computed(() => [
  { label: 'Has cover image', pass: !!(props.metadata.coverImage) },
  { label: 'Has description', pass: !!((props.metadata.description as string)?.length) },
  { label: 'Has tags', pass: !!(tags.value.length) },
  { label: 'Has difficulty set', pass: !!(props.metadata.difficulty) },
  { label: 'Has build time', pass: !!(props.metadata.buildTime) },
  { label: 'Has cost estimate', pass: !!(props.metadata.estimatedCost) },
]);
const checklistDone = computed(() => checklist.value.filter((c) => c.pass).length);
</script>

<template>
  <div class="cpub-pe-shell">
    <!-- LEFT: Block Library -->
    <aside class="cpub-pe-library" aria-label="Block library">
      <EditorsEditorBlocks :groups="blockTypes" :block-editor="blockEditor" />
    </aside>

    <!-- CENTER: Block Canvas -->
    <div class="cpub-pe-canvas">
      <div class="cpub-pe-canvas-inner">
        <EditorsBlockCanvas :block-editor="blockEditor" :block-types="blockTypes" />
      </div>
    </div>

    <!-- RIGHT: Settings Panel -->
    <aside class="cpub-pe-settings" aria-label="Project settings">
      <div class="cpub-pe-settings-body">
        <EditorsEditorSection title="Project Meta" icon="fa-sliders" :open="openSections.meta" @toggle="toggleSection('meta')">
          <div class="cpub-ep-field">
            <label class="cpub-ep-flabel">Slug</label>
            <input class="cpub-ep-input" type="text" :value="metadata.slug" placeholder="project-url-slug" @input="updateMeta('slug', ($event.target as HTMLInputElement).value)">
          </div>
          <div class="cpub-ep-field">
            <label class="cpub-ep-flabel">Difficulty</label>
            <div class="cpub-pe-toggle-group">
              <button
                v-for="d in difficulties"
                :key="d"
                class="cpub-pe-toggle-opt"
                :class="{ active: (metadata.difficulty || 'intermediate') === d }"
                @click="updateMeta('difficulty', d)"
              >{{ d }}</button>
            </div>
          </div>
          <div class="cpub-ep-field">
            <label class="cpub-ep-flabel">Build Time</label>
            <input class="cpub-ep-input" type="text" :value="metadata.buildTime" placeholder="e.g. 2–4 hours" @input="updateMeta('buildTime', ($event.target as HTMLInputElement).value)">
          </div>
          <div class="cpub-ep-field">
            <label class="cpub-ep-flabel">Estimated Cost</label>
            <input class="cpub-ep-input" type="text" :value="metadata.estimatedCost" placeholder="e.g. $45-60" @input="updateMeta('estimatedCost', ($event.target as HTMLInputElement).value)">
          </div>
          <div class="cpub-ep-field">
            <label class="cpub-ep-flabel">Description</label>
            <textarea class="cpub-ep-textarea" rows="3" :value="metadata.description as string" placeholder="Brief project description..." @input="updateMeta('description', ($event.target as HTMLTextAreaElement).value)" />
          </div>
        </EditorsEditorSection>

        <EditorsEditorSection title="Tags" icon="fa-tag" :open="openSections.tags" @toggle="toggleSection('tags')">
          <EditorsEditorTagInput :tags="tags" @update:tags="onTagsUpdate" />
        </EditorsEditorSection>

        <EditorsEditorSection title="Visibility" icon="fa-eye" :open="openSections.visibility" @toggle="toggleSection('visibility')">
          <EditorsEditorVisibility :model-value="visibility" @update:model-value="onVisibilityUpdate" />
        </EditorsEditorSection>

        <EditorsEditorSection title="Cover Image" icon="fa-image" :open="openSections.cover" @toggle="toggleSection('cover')">
          <div class="cpub-ep-field">
            <input class="cpub-ep-input" type="url" :value="metadata.coverImage" placeholder="https://..." @input="updateMeta('coverImage', ($event.target as HTMLInputElement).value)">
          </div>
        </EditorsEditorSection>

        <EditorsEditorSection title="Checklist" icon="fa-circle-check" :open="openSections.checklist" @toggle="toggleSection('checklist')">
          <div class="cpub-pe-checklist">
            <div v-for="item in checklist" :key="item.label" class="cpub-pe-check-item" :class="{ pass: item.pass }">
              <i :class="item.pass ? 'fa-regular fa-square-check' : 'fa-regular fa-square'" :style="{ color: item.pass ? 'var(--green)' : 'var(--text-faint)' }"></i>
              <span>{{ item.label }}</span>
            </div>
          </div>
          <div class="cpub-pe-checklist-summary">
            {{ checklistDone }}/{{ checklist.length }} complete
          </div>
        </EditorsEditorSection>
      </div>
    </aside>
  </div>
</template>

<style scoped>
.cpub-pe-shell { display: flex; flex: 1; overflow: hidden; }
.cpub-pe-library { width: 220px; flex-shrink: 0; background: var(--surface); border-right: 2px solid var(--border); display: flex; flex-direction: column; overflow: hidden; }
.cpub-pe-canvas { flex: 1; overflow-y: auto; background: var(--bg); }
.cpub-pe-canvas-inner { max-width: 820px; margin: 0 auto; }
.cpub-pe-settings { width: 280px; flex-shrink: 0; background: var(--surface); border-left: 2px solid var(--border); display: flex; flex-direction: column; overflow: hidden; }
.cpub-pe-settings-body { flex: 1; overflow-y: auto; }

.cpub-pe-toggle-group { display: flex; border: 2px solid var(--border); overflow: hidden; }
.cpub-pe-toggle-opt { flex: 1; padding: 5px 4px; text-align: center; font-size: 10px; font-family: var(--font-mono); cursor: pointer; color: var(--text-faint); background: transparent; border: none; border-right: 2px solid var(--border); text-transform: capitalize; }
.cpub-pe-toggle-opt:last-child { border-right: none; }
.cpub-pe-toggle-opt:hover { background: var(--surface2); color: var(--text-dim); }
.cpub-pe-toggle-opt.active { background: var(--accent-bg); color: var(--accent); }

.cpub-pe-checklist { display: flex; flex-direction: column; gap: 5px; }
.cpub-pe-check-item { display: flex; align-items: center; gap: 8px; font-size: 11px; color: var(--text-faint); }
.cpub-pe-check-item.pass { color: var(--text); }
.cpub-pe-checklist-summary { margin-top: 8px; font-family: var(--font-mono); font-size: 10px; color: var(--green); }

@media (max-width: 1200px) { .cpub-pe-library { display: none; } }
@media (max-width: 1024px) { .cpub-pe-settings { display: none; } }
</style>
