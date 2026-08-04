<script setup lang="ts">
import { ref } from 'vue'
import { profile, socials } from '@/data/portfolio'
import { useI18n } from 'vue-i18n'
import AppIcon from './AppIcon.vue'

const { t } = useI18n()

const name = ref('')
const email = ref('')
const message = ref('')
const status = ref<'idle' | 'sending' | 'sent' | 'error'>('idle')

async function handleSubmit(): Promise<void> {
  status.value = 'sending'

  try {
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: name.value,
        email: email.value || null,
        message: message.value,
      }),
    })

    if (!res.ok) throw new Error(`Server responded ${res.status}`)

    status.value = 'sent'
    name.value = ''
    email.value = ''
    message.value = ''
  } catch (err) {
    console.error('Contact form submission failed:', err)
    status.value = 'error'
  }
}
</script>

<template>
  <section id="contact" class="section">
    <div class="container contact">
      <div class="contact__panel">
        <span class="section__eyebrow">{{ t('contact.eyebrow') }}</span>
        <h2 class="section__title">{{ t('contact.title') }}</h2>
        <p class="section__subtitle">
          {{ t('contact.subtitle') }}
        </p>

        <form class="contact__form" @submit.prevent="handleSubmit">
          <label class="contact__field">
            <span class="contact__label">{{ t('contact.nameLabel') }}</span>
            <input
              v-model="name"
              type="text"
              class="contact__input"
              :placeholder="t('contact.namePlaceholder')"
              required
              :disabled="status === 'sending'"
            />
          </label>

          <label class="contact__field">
            <span class="contact__label">{{ t('contact.emailLabel') }}</span>
            <input
              v-model="email"
              type="email"
              class="contact__input"
              :placeholder="t('contact.emailPlaceholder', { at: '@' })"
              :disabled="status === 'sending'"
            />
          </label>

          <label class="contact__field">
            <span class="contact__label">{{ t('contact.messageLabel') }}</span>
            <textarea
              v-model="message"
              class="contact__input contact__textarea"
              rows="4"
              :placeholder="t('contact.messagePlaceholder')"
              required
              :disabled="status === 'sending'"
            ></textarea>
          </label>

          <button
            type="submit"
            class="btn btn--primary contact__submit"
            :disabled="status === 'sending'"
          >
            <template v-if="status === 'sending'">{{ t('contact.sending') }}</template>
            <template v-else>{{ t('contact.send') }}</template>
            <AppIcon name="mail" :size="18" />
          </button>

          <p v-if="status === 'sent'" class="contact__note contact__note--ok">
            {{ t('contact.success') }}
          </p>

          <p v-if="status === 'error'" class="contact__note contact__note--err">
            {{ t('contact.error') }}
          </p>
        </form>
      </div>

      <aside class="contact__aside">
        <a :href="`mailto:${profile.email}`" class="contact__email">
          <AppIcon name="mail" :size="20" />
          {{ profile.email }}
        </a>
        <ul class="contact__socials">
          <li v-for="social in socials" :key="social.label">
            <a
              :href="social.href"
              target="_blank"
              rel="noopener noreferrer"
              class="contact__social-link"
            >
              <AppIcon :name="social.icon" :size="18" />
              {{ social.label }}
            </a>
          </li>
        </ul>
      </aside>
    </div>
  </section>
</template>

<style scoped>
.contact {
  display: grid;
  grid-template-columns: 1.5fr 1fr;
  gap: var(--space-7);
  align-items: start;
}

.contact__panel {
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--space-7);
}

.contact__form {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  max-width: 36rem;
}

.contact__field {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.contact__label {
  font-size: var(--fs-sm);
  font-weight: var(--fw-medium);
  color: var(--color-text-muted);
}

.contact__input {
  padding: var(--space-3) var(--space-4);
  border-radius: var(--radius-md);
  background-color: var(--color-bg);
  border: 1px solid var(--color-border);
  color: var(--color-text);
  font-family: inherit;
  font-size: var(--fs-base);
  transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
}

.contact__input::placeholder {
  color: var(--color-text-muted);
  opacity: 0.7;
}

.contact__input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-primary) 22%, transparent);
}

.contact__textarea {
  resize: vertical;
  min-height: 6rem;
}

.contact__submit {
  align-self: flex-start;
  margin-top: var(--space-2);
}

.contact__note {
  font-size: var(--fs-sm);
}

.contact__note--ok {
  color: var(--color-success);
}

.contact__note--err {
  color: var(--color-danger);
}

.contact__aside {
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
  padding-top: var(--space-6);
}

.contact__email {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  font-weight: var(--fw-semibold);
  font-size: var(--fs-lg);
}

.contact__socials {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.contact__social-link {
  display: inline-flex;
  align-items: center;
  gap: var(--space-3);
  color: var(--color-text-muted);
  transition: color var(--transition-fast);
}

.contact__social-link:hover {
  color: var(--color-primary);
}

@media (max-width: 860px) {
  .contact {
    grid-template-columns: 1fr;
  }
}
</style>
