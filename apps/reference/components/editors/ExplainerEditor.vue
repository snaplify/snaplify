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

const activeLeftTab = ref<'modules' | 'structure'>('modules');

const blockTypes: BlockTypeGroup[] = [
  {
    name: 'Text',
    blocks: [
      { type: 'paragraph', label: 'Paragraph', icon: 'fa-align-left', description: 'Body text' },
      { type: 'heading', label: 'Heading', icon: 'fa-heading', description: 'Section header' },
      { type: 'image', label: 'Image', icon: 'fa-image', description: 'Upload or embed' },
      { type: 'code_block', label: 'Code Block', icon: 'fa-code', description: 'Syntax highlighted code' },
    ],
  },
  {
    name: 'Interactive',
    blocks: [
      { type: 'interactiveSlider', label: 'Range Slider', icon: 'fa-sliders', description: 'Interactive slider' },
      { type: 'quiz', label: 'Quiz', icon: 'fa-circle-question', description: 'Quiz with options' },
      { type: 'checkpoint', label: 'Checkpoint', icon: 'fa-flag-checkered', description: 'Progress checkpoint' },
    ],
  },
  {
    name: 'Rich',
    blocks: [
      { type: 'callout', label: 'Callout', icon: 'fa-circle-info', description: 'Tip, warning, or note', attrs: { variant: 'info' } },
      { type: 'mathNotation', label: 'Math Block', icon: 'fa-square-root-variable', description: 'Mathematical notation' },
      { type: 'embed', label: 'Embed', icon: 'fa-globe', description: 'External embed' },
    ],
  },
];

const openSections = ref<Record<string, boolean>>({
  section: true, difficulty: true, visibility: false, cover: false,
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
  <div class="cpub-ee-shell">
    <!-- LEFT: Modules/Structure -->
    <aside class="cpub-ee-left" aria-label="Block library">
      <div class="cpub-ee-left-tabs">
        <button class="cpub-ee-left-tab" :class="{ active: activeLeftTab === 'modules' }" @click="activeLeftTab = 'modules'">Modules</button>
        <button class="cpub-ee-left-tab" :class="{ active: activeLeftTab === 'structure' }" @click="activeLeftTab = 'structure'">Structure</button>
      </div>
      <template v-if="activeLeftTab === 'modules'">
        <EditorsEditorBlocks :groups="blockTypes" :block-editor="blockEditor" />
      </template>
      <template v-else>
        <div style="padding: 12px;">
          <p class="cpub-ee-structure-hint">Sections are defined by H2 headings. Add headings to create structure.</p>
          <div v-for="block in blockEditor.blocks.value.filter(b => b.type === 'heading' && b.content.level === 2)" :key="block.id" class="cpub-ee-structure-item" @click="blockEditor.selectBlock(block.id)">
            <span class="cpub-ee-structure-dot" />
            <span>{{ block.content.text || 'Untitled section' }}</span>
          </div>
        </div>
      </template>
    </aside>

    <!-- CENTER: Block Canvas -->
    <div class="cpub-ee-canvas">
      <div class="cpub-ee-canvas-inner">
        <EditorsBlockCanvas :block-editor="blockEditor" :block-types="blockTypes" />
      </div>
    </div>

    <!-- RIGHT: Properties -->
    <aside class="cpub-ee-right" aria-label="Explainer properties">
      <div class="cpub-ee-right-body">
        <EditorsEditorSection title="Content" icon="fa-sliders" :open="openSections.section" @toggle="toggleSection('section')">
          <div class="cpub-ep-field">
            <label class="cpub-ep-flabel">Slug</label>
            <input class="cpub-ep-input" type="text" :value="metadata.slug" placeholder="auto-generated" @input="updateMeta('slug', ($event.target as HTMLInputElement).value)">
          </div>
          <div class="cpub-ep-field">
            <label class="cpub-ep-flabel">Description</label>
            <textarea class="cpub-ep-textarea" rows="3" :value="metadata.description as string" placeholder="What does this explainer teach?" @input="updateMeta('description', ($event.target as HTMLTextAreaElement).value)" />
          </div>
          <div class="cpub-ep-field">
            <label class="cpub-ep-flabel">Estimated Minutes</label>
            <input class="cpub-ep-input" type="number" :value="metadata.estimatedMinutes" placeholder="10" @input="updateMeta('estimatedMinutes', Number(($event.target as HTMLInputElement).value))">
          </div>
          <div class="cpub-ep-field">
            <label class="cpub-ep-flabel">Tags</label>
            <EditorsEditorTagInput :tags="tags" @update:tags="onTagsUpdate" />
          </div>
        </EditorsEditorSection>

        <EditorsEditorSection title="Difficulty" icon="fa-gauge-high" :open="openSections.difficulty" @toggle="toggleSection('difficulty')">
          <select class="cpub-ep-select" :value="metadata.difficulty || 'beginner'" @change="updateMeta('difficulty', ($event.target as HTMLSelectElement).value)">
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </EditorsEditorSection>

        <EditorsEditorSection title="Visibility" icon="fa-eye" :open="openSections.visibility" @toggle="toggleSection('visibility')">
          <EditorsEditorVisibility :model-value="visibility" @update:model-value="onVisibilityUpdate" />
        </EditorsEditorSection>

        <EditorsEditorSection title="Cover Image" icon="fa-image" :open="openSections.cover" @toggle="toggleSection('cover')">
          <div class="cpub-ep-field">
            <input class="cpub-ep-input" type="url" :value="metadata.coverImage" placeholder="https://..." @input="updateMeta('coverImage', ($event.target as HTMLInputElement).value)">
          </div>
        </EditorsEditorSection>
      </div>
    </aside>
  </div>
</template>

<style scoped>
.cpub-ee-shell { display: flex; flex: 1; overflow: hidden; }
.cpub-ee-left { width: 240px; flex-shrink: 0; background: var(--surface); border-right: 2px solid var(--border); display: flex; flex-direction: column; overflow: hidden; }
.cpub-ee-left-tabs { display: flex; border-bottom: 2px solid var(--border); }
.cpub-ee-left-tab { flex: 1; padding: 8px; font-family: var(--font-mono); font-size: 10px; font-weight: 600; letter-spacing: .06em; text-transform: uppercase; text-align: center; background: none; border: none; color: var(--text-dim); cursor: pointer; border-bottom: 2px solid transparent; margin-bottom: -2px; }
.cpub-ee-left-tab.active { color: var(--accent); border-bottom-color: var(--accent); background: var(--accent-bg); }
.cpub-ee-structure-hint { font-size: 11px; color: var(--text-dim); line-height: 1.5; margin-bottom: 12px; }
.cpub-ee-structure-item { display: flex; align-items: center; gap: 8px; padding: 6px 8px; font-size: 12px; color: var(--text-dim); cursor: pointer; border: 2px solid transparent; }
.cpub-ee-structure-item:hover { background: var(--surface2); border-color: var(--border2); color: var(--text); }
.cpub-ee-structure-dot { width: 6px; height: 6px; background: var(--accent); border-radius: 50%; flex-shrink: 0; }
.cpub-ee-canvas { flex: 1; overflow-y: auto; background: var(--bg); }
.cpub-ee-canvas-inner { max-width: 720px; margin: 0 auto; }
.cpub-ee-right { width: 280px; flex-shrink: 0; background: var(--surface); border-left: 2px solid var(--border); display: flex; flex-direction: column; overflow: hidden; }
.cpub-ee-right-body { flex: 1; overflow-y: auto; }

@media (max-width: 1024px) { .cpub-ee-left, .cpub-ee-right { display: none; } }
</style>
