<script setup lang="ts">
definePageMeta({ middleware: 'auth' });
useSeoMeta({ title: 'Edit Profile — CommonPub' });

const { user } = useAuth();
const saving = ref(false);
const success = ref(false);

const form = ref({
  displayName: '',
  bio: '',
  location: '',
  website: '',
  headline: '',
});

// Load current profile
onMounted(() => {
  if (user.value) {
    form.value.displayName = user.value.displayName || '';
    form.value.bio = user.value.bio || '';
    form.value.location = user.value.location || '';
    form.value.website = user.value.website || '';
    form.value.headline = user.value.headline || '';
  }
});

async function handleSave(): Promise<void> {
  saving.value = true;
  success.value = false;
  try {
    await $fetch('/api/users/me', {
      method: 'PUT',
      body: form.value,
    });
    success.value = true;
  } catch { /* silent */ } finally {
    saving.value = false;
  }
}
</script>

<template>
  <div class="cpub-settings">
    <h1 class="cpub-page-title">Edit Profile</h1>

    <form class="cpub-settings-form" @submit.prevent="handleSave">
      <div class="cpub-form-section">
        <span class="cpub-form-section-label">Profile</span>

        <div class="cpub-form-field">
          <label for="displayName" class="cpub-form-label">Display Name</label>
          <input id="displayName" v-model="form.displayName" type="text" class="cpub-form-input" />
        </div>

        <div class="cpub-form-field">
          <label for="headline" class="cpub-form-label">Headline</label>
          <input id="headline" v-model="form.headline" type="text" class="cpub-form-input" placeholder="e.g., Full-stack maker" />
        </div>

        <div class="cpub-form-field">
          <label for="bio" class="cpub-form-label">Bio</label>
          <textarea id="bio" v-model="form.bio" class="cpub-form-textarea" rows="4" placeholder="Tell people about yourself..." />
        </div>

        <div class="cpub-form-field">
          <label for="location" class="cpub-form-label">Location</label>
          <input id="location" v-model="form.location" type="text" class="cpub-form-input" placeholder="City, Country" />
        </div>

        <div class="cpub-form-field">
          <label for="website" class="cpub-form-label">Website</label>
          <input id="website" v-model="form.website" type="url" class="cpub-form-input" placeholder="https://..." />
        </div>
      </div>

      <div class="cpub-form-actions">
        <div v-if="success" class="cpub-form-success">Profile updated.</div>
        <button type="submit" class="cpub-save-btn" :disabled="saving">
          {{ saving ? 'Saving...' : 'Save Changes' }}
        </button>
      </div>
    </form>
  </div>
</template>

<style scoped>
.cpub-settings { max-width: 640px; }
.cpub-page-title { font-size: var(--text-xl); font-weight: var(--font-weight-bold); margin-bottom: var(--space-6); }
.cpub-settings-form { display: flex; flex-direction: column; gap: var(--space-6); }
.cpub-form-section { padding-bottom: var(--space-6); border-bottom: 1px solid var(--border2); }
.cpub-form-section-label { display: block; font-family: var(--font-mono); font-size: var(--text-label); font-weight: var(--font-weight-semibold); text-transform: uppercase; letter-spacing: var(--tracking-widest); color: var(--text-faint); margin-bottom: var(--space-4); }
.cpub-form-field { margin-bottom: var(--space-4); }
.cpub-form-label { display: block; font-size: var(--text-sm); font-weight: var(--font-weight-medium); color: var(--text); margin-bottom: var(--space-1); }
.cpub-form-input, .cpub-form-textarea { width: 100%; padding: var(--space-2) var(--space-3); border: var(--border-width-default) solid var(--border); background: var(--surface); color: var(--text); font-family: var(--font-sans); font-size: var(--text-sm); }
.cpub-form-input:focus, .cpub-form-textarea:focus { outline: none; border-color: var(--accent); }
.cpub-form-textarea { resize: vertical; }
.cpub-form-actions { display: flex; align-items: center; gap: var(--space-3); }
.cpub-form-success { font-size: var(--text-sm); color: var(--green); }
.cpub-save-btn { padding: var(--space-2) var(--space-5); background: var(--accent); color: #fff; border: var(--border-width-default) solid var(--border); font-size: var(--text-sm); cursor: pointer; font-family: var(--font-sans); box-shadow: var(--shadow-sm); }
.cpub-save-btn:hover { background: var(--color-primary-hover); }
.cpub-save-btn:disabled { opacity: 0.5; cursor: not-allowed; }
</style>
