<script setup lang="ts">
import { ref } from "vue";
import { useAdmin } from "@/composables/useAdmin";
import { useI18n } from "vue-i18n";
import AppIcon from "./AppIcon.vue";

const { t } = useI18n();
const { login } = useAdmin();

const username = ref("");
const password = ref("");
const error = ref("");
const loading = ref(false);

async function handleLogin(): Promise<void> {
  error.value = "";
  loading.value = true;

  try {
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: username.value,
        password: password.value,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      error.value = data.error || t('admin.loginFailed');
      return;
    }

    login(data.token);
  } catch {
    error.value = t('admin.networkError');
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div class="admin-login">
    <form class="admin-login__card" @submit.prevent="handleLogin">
      <div class="admin-login__icon">
        <AppIcon name="code" :size="28" />
      </div>
      <h2 class="admin-login__title">{{ t('admin.portal') }}</h2>

      <label class="admin-login__field">
        <span class="admin-login__label">{{ t('admin.username') }}</span>
        <input
          v-model="username"
          type="text"
          class="admin-login__input"
          :placeholder="t('admin.usernamePlaceholder')"
          required
          :disabled="loading"
          autocomplete="username"
        />
      </label>

      <label class="admin-login__field">
        <span class="admin-login__label">{{ t('admin.password') }}</span>
        <input
          v-model="password"
          type="password"
          class="admin-login__input"
          :placeholder="t('admin.passwordPlaceholder')"
          required
          :disabled="loading"
          autocomplete="current-password"
        />
      </label>

      <p v-if="error" class="admin-login__error">{{ error }}</p>

      <button
        type="submit"
        class="btn btn--primary admin-login__submit"
        :disabled="loading"
      >
        {{ loading ? t('admin.signingIn') : t('admin.signIn') }}
      </button>
    </form>
  </div>
</template>

<style scoped>
.admin-login {
  min-height: calc(100vh - 4rem);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-6);
}

.admin-login__card {
  width: 100%;
  max-width: 400px;
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--space-7);
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.admin-login__icon {
  align-self: center;
  color: var(--color-primary);
}

.admin-login__title {
  text-align: center;
  font-size: var(--fs-xl);
  margin: 0;
}

.admin-login__field {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.admin-login__label {
  font-size: var(--fs-sm);
  color: var(--color-text-muted);
  font-weight: var(--fw-medium);
}

.admin-login__input {
  padding: var(--space-3) var(--space-4);
  border-radius: var(--radius-md);
  background-color: var(--color-bg);
  border: 1px solid var(--color-border);
  color: var(--color-text);
  font-family: inherit;
  font-size: var(--fs-base);
}

.admin-login__input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-primary) 22%, transparent);
}

.admin-login__error {
  color: var(--color-danger);
  font-size: var(--fs-sm);
  margin: 0;
}

.admin-login__submit {
  align-self: center;
  min-width: 140px;
}
</style>
