<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { navLinks, profile } from '@/data/portfolio'
import { useTheme } from '@/composables/useTheme'
import { useI18n } from 'vue-i18n'
import { setLocale } from '@/i18n'
import AppIcon from './AppIcon.vue'

const { t, locale } = useI18n()
const { theme, toggleTheme } = useTheme()

const isScrolled = ref(false)
const isMenuOpen = ref(false)

function handleScroll(): void {
  isScrolled.value = window.scrollY > 12
}

function closeMenu(): void {
  isMenuOpen.value = false
}

function toggleLang(): void {
  setLocale(locale.value === 'en' ? 'zh' : 'en')
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
  handleScroll()
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <header class="header" :class="{ 'header--scrolled': isScrolled }">
    <div class="container header__inner">
      <a href="#top" class="header__brand" @click="closeMenu">
        <span class="header__brand-mark">{{ initials }}</span>
        <span class="header__brand-name">{{ profile.name }}</span>
      </a>

      <nav class="header__nav" :class="{ 'header__nav--open': isMenuOpen }">
        <a
          v-for="link in navLinks"
          :key="link.href"
          :href="link.href"
          class="header__link"
          @click="closeMenu"
        >
          {{ t(`nav.${link.i18nKey}`) }}
        </a>
      </nav>

      <div class="header__actions">
        <!-- Language toggle -->
        <button
          class="header__icon-btn header__lang-btn"
          type="button"
          :aria-label="t('lang.switchTo')"
          @click="toggleLang"
        >
          {{ t('lang.label') }}
        </button>

        <button
          class="header__icon-btn"
          type="button"
          :aria-label="`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`"
          @click="toggleTheme"
        >
          <AppIcon :name="theme === 'dark' ? 'sun' : 'moon'" :size="18" />
        </button>

        <button
          class="header__icon-btn header__menu-toggle"
          type="button"
          aria-label="Toggle menu"
          @click="isMenuOpen = !isMenuOpen"
        >
          <AppIcon :name="isMenuOpen ? 'close' : 'menu'" :size="20" />
        </button>
      </div>
    </div>
  </header>
</template>

<script lang="ts">
export default {
  computed: {
    initials(): string {
      return profile.name
        .split(' ')
        .map((part) => part[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    },
  },
}
</script>

<style scoped>
.header {
  position: fixed;
  inset: 0 0 auto 0;
  z-index: 100;
  transition: background-color var(--transition-base), box-shadow var(--transition-base),
    border-color var(--transition-base);
  border-bottom: 1px solid transparent;
}

.header--scrolled {
  background-color: color-mix(in srgb, var(--color-bg) 85%, transparent);
  backdrop-filter: blur(12px);
  border-bottom-color: var(--color-border);
  box-shadow: var(--shadow-sm);
}

.header__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 4.5rem;
}

.header__brand {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  color: var(--color-heading);
  font-weight: var(--fw-bold);
}

.header__brand-mark {
  display: grid;
  place-items: center;
  width: 2.25rem;
  height: 2.25rem;
  border-radius: var(--radius-md);
  background: linear-gradient(120deg, var(--color-primary), var(--color-accent));
  color: #fff;
  font-size: var(--fs-sm);
  box-shadow: var(--shadow-glow);
}

.header__brand-name {
  font-size: var(--fs-lg);
}

.header__nav {
  display: flex;
  align-items: center;
  gap: var(--space-6);
}

.header__link {
  color: var(--color-text-muted);
  font-size: var(--fs-sm);
  font-weight: var(--fw-medium);
  transition: color var(--transition-fast);
}

.header__link:hover {
  color: var(--color-heading);
}

.header__actions {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.header__icon-btn {
  display: grid;
  place-items: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: var(--radius-full);
  color: var(--color-text);
  border: 1px solid var(--color-border);
  background-color: var(--color-surface);
  transition: color var(--transition-fast), border-color var(--transition-fast),
    background-color var(--transition-fast);
}

.header__icon-btn:hover {
  color: var(--color-primary);
  border-color: var(--color-primary);
}

.header__lang-btn {
  width: auto;
  padding: 0 var(--space-3);
  font-family: inherit;
  font-size: var(--fs-xs);
  font-weight: var(--fw-semibold);
  cursor: pointer;
}

.header__menu-toggle {
  display: none;
}

@media (max-width: 768px) {
  .header__menu-toggle {
    display: grid;
  }

  .header__brand-name {
    display: none;
  }

  .header__nav {
    position: absolute;
    top: 4.5rem;
    left: 0;
    right: 0;
    flex-direction: column;
    align-items: stretch;
    gap: 0;
    padding: var(--space-4) var(--space-5);
    background-color: var(--color-bg);
    border-bottom: 1px solid var(--color-border);
    box-shadow: var(--shadow-md);
    transform: translateY(-12px);
    opacity: 0;
    pointer-events: none;
    transition: opacity var(--transition-fast), transform var(--transition-fast);
  }

  .header__nav--open {
    transform: translateY(0);
    opacity: 1;
    pointer-events: auto;
  }

  .header__link {
    padding-block: var(--space-3);
    font-size: var(--fs-base);
  }
}
</style>
