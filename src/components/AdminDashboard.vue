<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useAdmin } from "@/composables/useAdmin";
import { useI18n } from "vue-i18n";
import AppIcon from "./AppIcon.vue";

const { t } = useI18n();
const { token, logout } = useAdmin();

interface Contact {
  id: number;
  name: string;
  email: string | null;
  message: string;
  created_at: string;
}

const contacts = ref<Contact[]>([]);
const loading = ref(true);
const error = ref("");

async function fetchContacts(): Promise<void> {
  loading.value = true;
  error.value = "";

  try {
    const res = await fetch("/api/contacts", {
      headers: { Authorization: `Bearer ${token.value}` },
    });

    if (!res.ok) {
      if (res.status === 401) { logout(); return; }
      throw new Error(`Server responded ${res.status}`);
    }

    contacts.value = await res.json();
  } catch {
    error.value = t('admin.loadFailed');
  } finally {
    loading.value = false;
  }
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString();
}

onMounted(() => {
  fetchContacts()
  fetchAvatarPreview()
})

// ---- avatar upload ----
const avatarFile = ref<File | null>(null)
const avatarUploading = ref(false)
const avatarMsg = ref("")
const avatarPreview = ref("")

function onFileChange(e: Event) {
  const input = e.target as HTMLInputElement
  if (input.files?.length) {
    avatarFile.value = input.files[0]
  }
}

async function fetchAvatarPreview() {
  try {
    const res = await fetch("/api/avatar")
    if (res.ok) {
      const blob = await res.blob()
      avatarPreview.value = URL.createObjectURL(blob)
    }
  } catch { /* no avatar yet */ }
}

async function uploadAvatar() {
  if (!avatarFile.value) return
  avatarUploading.value = true
  avatarMsg.value = ""

  const form = new FormData()
  form.append("file", avatarFile.value)

  try {
    const res = await fetch("/api/assets/avatar", {
      method: "POST",
      headers: { Authorization: `Bearer ${token.value}` },
      body: form,
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error ?? t('admin.uploadFailed'))
    avatarMsg.value = t('admin.avatarUpdated')
    avatarFile.value = null
    fetchAvatarPreview()
  } catch (err: any) {
    avatarMsg.value = err.message ?? t('admin.uploadFailed')
  } finally {
    avatarUploading.value = false
  }
}
</script>

<template>
  <div class="dashboard">
    <header class="dashboard__header">
      <h2 class="dashboard__title">
        <AppIcon name="mail" :size="22" />
        {{ t('admin.contactMessages') }} ({{ contacts.length }})
      </h2>
      <button class="btn btn--ghost" @click="logout">{{ t('admin.logout') }}</button>
    </header>

    <!-- Avatar upload -->
    <section class="dashboard__avatar-section">
      <h3 class="dashboard__section-title">
        <AppIcon name="mail" :size="18" />
        {{ t('admin.chatbotAvatar') }}
      </h3>
      <p class="dashboard__avatar-desc">
        {{ t('admin.avatarDesc') }}
      </p>
      <div class="dashboard__avatar-row">
        <div class="dashboard__avatar-preview-wrap">
          <img
            v-if="avatarPreview"
            :src="avatarPreview"
            alt="Current avatar"
            class="dashboard__avatar-preview"
          />
          <div v-else class="dashboard__avatar-placeholder">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="8" r="4" />
              <path d="M4 20c0-4 4-7 8-7s8 3 8 7" />
            </svg>
          </div>
        </div>
        <div class="dashboard__avatar-controls">
          <label class="dashboard__file-label" :class="{ 'dashboard__file-label--disabled': avatarUploading }">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            {{ avatarFile ? avatarFile.name : t('admin.chooseImage') }}
            <input
              type="file"
              accept="image/*"
              :disabled="avatarUploading"
              @change="onFileChange"
              class="dashboard__file-input"
            />
          </label>
          <button
            class="btn btn--primary dashboard__upload-btn"
            :disabled="!avatarFile || avatarUploading"
            @click="uploadAvatar"
          >
            <svg v-if="avatarUploading" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="dashboard__spinner">
              <circle cx="12" cy="12" r="10" stroke-opacity="0.25" />
              <path d="M12 2a10 10 0 0 1 10 10" stroke-linecap="round" />
            </svg>
            {{ avatarUploading ? t('admin.uploading') : t('admin.uploadAvatar') }}
          </button>
        </div>
      </div>
      <p v-if="avatarMsg" class="dashboard__avatar-msg" :class="{ 'dashboard__avatar-msg--err': avatarMsg.toLowerCase().includes('fail') || avatarMsg.toLowerCase().includes('error') }">{{ avatarMsg }}</p>
    </section>

    <p v-if="loading" class="dashboard__status">{{ t('admin.loading') }}</p>
    <p v-if="error" class="dashboard__status dashboard__status--err">{{ error }}</p>

    <div v-if="!loading && contacts.length === 0 && !error" class="dashboard__empty">
      <AppIcon name="mail" :size="40" />
      <p>{{ t('admin.noMessages') }}</p>
    </div>

    <div v-if="contacts.length > 0" class="dashboard__table-wrapper">
      <table class="dashboard__table">
        <thead>
          <tr>
            <th>{{ t('admin.tableHeaders.id') }}</th>
            <th>{{ t('admin.tableHeaders.name') }}</th>
            <th>{{ t('admin.tableHeaders.email') }}</th>
            <th>{{ t('admin.tableHeaders.message') }}</th>
            <th>{{ t('admin.tableHeaders.date') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="c in contacts" :key="c.id">
            <td class="dashboard__id">{{ c.id }}</td>
            <td class="dashboard__name">{{ c.name }}</td>
            <td>{{ c.email || "—" }}</td>
            <td class="dashboard__msg">{{ c.message }}</td>
            <td class="dashboard__date">{{ formatDate(c.created_at) }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <button class="btn btn--primary dashboard__refresh" @click="fetchContacts">
      {{ t('admin.refresh') }}
    </button>
  </div>
</template>

<style scoped>
.dashboard {
  max-width: var(--container-max);
  margin: 0 auto;
  padding: var(--space-6) var(--space-4);
}

.dashboard__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--space-5);
}

.dashboard__title {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  font-size: var(--fs-xl);
  margin: 0;
}

.dashboard__status { text-align: center; color: var(--color-text-muted); }
.dashboard__status--err { color: var(--color-danger); }

.dashboard__empty {
  text-align: center;
  padding: var(--space-8) 0;
  color: var(--color-text-muted);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-4);
}

.dashboard__table-wrapper { overflow-x: auto; margin-bottom: var(--space-5); }

.dashboard__table {
  width: 100%;
  border-collapse: collapse;
  font-size: var(--fs-sm);
}

.dashboard__table th,
.dashboard__table td {
  text-align: left;
  padding: var(--space-3) var(--space-4);
  border-bottom: 1px solid var(--color-border);
  white-space: nowrap;
}

.dashboard__table th {
  color: var(--color-text-muted);
  font-weight: var(--fw-semibold);
  font-size: var(--fs-xs);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.dashboard__table tbody tr:hover { background-color: var(--color-surface-hover); }
.dashboard__id { color: var(--color-text-muted); font-variant-numeric: tabular-nums; }
.dashboard__name { font-weight: var(--fw-semibold); }
.dashboard__msg { max-width: 320px; white-space: normal; word-break: break-word; }
.dashboard__date { color: var(--color-text-muted); font-variant-numeric: tabular-nums; }
.dashboard__refresh { display: block; margin: 0 auto; }

/* ---- Avatar upload ---- */
.dashboard__avatar-section {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--space-5);
  margin-bottom: var(--space-5);
}
.dashboard__section-title {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  margin: 0 0 var(--space-1);
  font-size: var(--fs-lg);
  font-weight: var(--fw-semibold);
}
.dashboard__avatar-desc {
  margin: 0 0 var(--space-4);
  font-size: var(--fs-sm);
  color: var(--color-text-muted);
}
.dashboard__avatar-row {
  display: flex;
  align-items: center;
  gap: var(--space-5);
  flex-wrap: wrap;
}
.dashboard__avatar-preview-wrap {
  flex-shrink: 0;
}
.dashboard__avatar-preview {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid var(--color-primary);
  box-shadow: 0 0 0 3px var(--color-primary-alpha, rgba(99, 102, 241, 0.15));
}
.dashboard__avatar-placeholder {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: var(--color-surface-hover);
  border: 2px dashed var(--color-border);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-muted);
}
.dashboard__avatar-controls {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  flex-wrap: wrap;
  flex: 1;
  min-width: 0;
}
.dashboard__file-label {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-4);
  background: var(--color-surface-hover);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  font-size: var(--fs-sm);
  color: var(--color-text);
  cursor: pointer;
  transition: border-color var(--transition-fast), background var(--transition-fast);
  max-width: 240px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.dashboard__file-label:hover {
  border-color: var(--color-primary);
  background: var(--color-surface);
}
.dashboard__file-label--disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.dashboard__file-input {
  position: absolute;
  width: 0;
  height: 0;
  opacity: 0;
  pointer-events: none;
}
.dashboard__upload-btn {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
}
.dashboard__spinner {
  animation: dashboard-spin 0.8s linear infinite;
}
@keyframes dashboard-spin {
  to { transform: rotate(360deg); }
}
.dashboard__avatar-msg {
  margin: var(--space-3) 0 0;
  font-size: var(--fs-sm);
  color: var(--color-success, #22c55e);
}
.dashboard__avatar-msg--err {
  color: var(--color-danger);
}
</style>
