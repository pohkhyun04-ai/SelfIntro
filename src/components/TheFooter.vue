<script setup lang="ts">
import { profile, navLinks, socials } from '@/data/portfolio'
import AppIcon from './AppIcon.vue'

const year = new Date().getFullYear()
</script>

<template>
  <footer class="footer">
    <div class="container footer__inner">
      <div class="footer__brand">
        <span class="footer__name text-gradient">{{ profile.name }}</span>
        <p class="footer__tagline">{{ profile.tagline }}</p>
      </div>

      <nav class="footer__nav" aria-label="Footer">
        <a v-for="link in navLinks" :key="link.href" :href="link.href" class="footer__link">
          {{ link.label }}
        </a>
      </nav>

      <div class="footer__socials">
        <a
          v-for="social in socials"
          :key="social.label"
          :href="social.href"
          class="footer__social-link"
          target="_blank"
          rel="noopener noreferrer"
          :aria-label="social.label"
        >
          <AppIcon :name="social.icon" :size="18" />
        </a>
      </div>
    </div>

    <div class="container footer__bottom">
      <p>© {{ year }} {{ profile.name }}. All rights reserved.</p>
      <p>Built with Vue 3, TypeScript & CSS.</p>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  border-top: 1px solid var(--color-border);
  padding-top: var(--space-8);
  background-color: var(--color-bg-soft);
}

.footer__inner {
  display: grid;
  grid-template-columns: 1.5fr 1fr 1fr;
  gap: var(--space-6);
  padding-bottom: var(--space-7);
}

.footer__name {
  font-size: var(--fs-xl);
  font-weight: var(--fw-bold);
}

.footer__tagline {
  color: var(--color-text-muted);
  font-size: var(--fs-sm);
  margin-top: var(--space-2);
  max-width: 32ch;
}

.footer__nav {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.footer__link {
  color: var(--color-text-muted);
  font-size: var(--fs-sm);
  transition: color var(--transition-fast);
}

.footer__link:hover {
  color: var(--color-primary);
}

.footer__socials {
  display: flex;
  gap: var(--space-2);
}

.footer__social-link {
  display: grid;
  place-items: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: var(--radius-full);
  color: var(--color-text-muted);
  border: 1px solid var(--color-border);
  background-color: var(--color-surface);
  transition: color var(--transition-fast), border-color var(--transition-fast),
    transform var(--transition-fast);
}

.footer__social-link:hover {
  color: var(--color-primary);
  border-color: var(--color-primary);
  transform: translateY(-3px);
}

.footer__bottom {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: var(--space-2);
  padding-block: var(--space-5);
  border-top: 1px solid var(--color-border);
  color: var(--color-text-muted);
  font-size: var(--fs-sm);
}

@media (max-width: 768px) {
  .footer__inner {
    grid-template-columns: 1fr;
    text-align: center;
  }

  .footer__nav {
    align-items: center;
  }

  .footer__socials {
    justify-content: center;
  }

  .footer__bottom {
    justify-content: center;
    text-align: center;
  }
}
</style>
