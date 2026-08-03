<script setup lang="ts">
import { ref, computed } from 'vue'
import { profile, socials } from '@/data/portfolio'
import AppIcon from './AppIcon.vue'

const name = ref('')
const message = ref('')
const sent = ref(false)

const mailtoHref = computed(() => {
  const subject = encodeURIComponent(`Portfolio inquiry from ${name.value || 'a visitor'}`)
  const body = encodeURIComponent(message.value)
  return `mailto:${profile.email}?subject=${subject}&body=${body}`
})

function handleSubmit(): void {
  window.location.href = mailtoHref.value
  sent.value = true
}
</script>

<template>
  <section id="contact" class="section">
    <div class="container contact">
      <div class="contact__panel">
        <span class="section__eyebrow">Contact</span>
        <h2 class="section__title">Let's build something together</h2>
        <p class="section__subtitle">
          Have a project in mind or just want to say hi? My inbox is always open.
        </p>

        <form class="contact__form" @submit.prevent="handleSubmit">
          <label class="contact__field">
            <span class="contact__label">Your name</span>
            <input
              v-model="name"
              type="text"
              class="contact__input"
              placeholder="Jane Doe"
              required
            />
          </label>

          <label class="contact__field">
            <span class="contact__label">Message</span>
            <textarea
              v-model="message"
              class="contact__input contact__textarea"
              rows="4"
              placeholder="Tell me about your project…"
              required
            ></textarea>
          </label>

          <button type="submit" class="btn btn--primary contact__submit">
            Send message
            <AppIcon name="mail" :size="18" />
          </button>

          <p v-if="sent" class="contact__note">
            Thanks! Your email client should open with your message ready to send.
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
  color: var(--color-success);
  font-size: var(--fs-sm);
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
