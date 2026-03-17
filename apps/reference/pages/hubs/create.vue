<script setup lang="ts">
definePageMeta({ middleware: 'auth' });

useSeoMeta({
  title: 'Create Hub — CommonPub',
  description: 'Create a new maker hub.',
});

const toast = useToast();
const { extract: extractError } = useApiError();
const name = ref('');
const description = ref('');
const saving = ref(false);

async function handleCreate(): Promise<void> {
  saving.value = true;
  try {
    const result = await $fetch('/api/hubs', {
      method: 'POST',
      body: { name: name.value, description: description.value },
    });
    await navigateTo(`/hubs/${(result as { slug: string }).slug}`);
  } catch (err: unknown) {
    toast.error(extractError(err));
  } finally {
    saving.value = false;
  }
}
</script>

<template>
  <div class="create-community-page">
    <h1 class="page-title">Create Hub</h1>

    <form class="community-form" @submit.prevent="handleCreate" aria-label="Create community form">
      <div class="form-field">
        <label for="community-name" class="form-label">Name</label>
        <input id="community-name" v-model="name" type="text" class="form-input" required placeholder="Hub name" />
      </div>

      <div class="form-field">
        <label for="community-desc" class="form-label">Description</label>
        <textarea id="community-desc" v-model="description" class="form-textarea" rows="3" placeholder="What is this community about?" />
      </div>

      <button type="submit" class="cpub-btn cpub-btn-primary" :disabled="saving || !name">
        {{ saving ? 'Creating...' : 'Create Hub' }}
      </button>
    </form>
  </div>
</template>

<style scoped>
.create-community-page {
  max-width: 600px;
}

.page-title {
  font-size: var(--text-xl);
  font-weight: var(--font-weight-bold);
  margin-bottom: var(--space-6);
}

.community-form {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.form-label {
  font-size: var(--text-sm);
  font-weight: var(--font-weight-medium);
}

.form-input,
.form-textarea {
  padding: var(--space-2) var(--space-3);
  border: 1px solid var(--border);
  background: var(--surface);
  color: var(--text);
  font-size: var(--text-base);
  font-family: var(--font-sans);
}

.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: var(--accent);
  box-shadow: var(--focus-ring);
}

.form-textarea {
  resize: vertical;
}

/* cpub-btn, cpub-btn-primary → global components.css */
</style>
