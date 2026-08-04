<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { profile, socials } from '@/data/portfolio'
import AppIcon from './AppIcon.vue'

const likes = ref(0)
const visits = ref(0)
const liked = ref(false)
const API = import.meta.env.VITE_API_URL || ''

const copied = ref(false)

async function copyLink() {
  try {
    await navigator.clipboard.writeText(window.location.href)
    copied.value = true
    setTimeout(() => { copied.value = false }, 2000)
  } catch { /* clipboard not supported */ }
}

async function fetchStats() {
  try {
    const res = await fetch(`${API}/api/stats`)
    if (res.ok) {
      const data = await res.json()
      likes.value = data.likes
      visits.value = data.visits
      liked.value = data.hasLiked
    }
  } catch { /* ignore */ }
}

async function recordVisit() {
  try {
    const res = await fetch(`${API}/api/visit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ page: '/' }),
    })
    if (res.ok) {
      const data = await res.json()
      visits.value = data.visits
    }
  } catch { /* ignore */ }
}

async function likePage() {
  if (liked.value) return
  try {
    const res = await fetch(`${API}/api/like`, { method: 'POST' })
    if (res.ok) {
      const data = await res.json()
      likes.value = data.likes
      liked.value = true
    }
  } catch { /* ignore */ }
}

onMounted(() => {
  fetchStats()
  recordVisit()
})
</script>

<template>
  <section id="top" class="hero">
    <div class="hero__glow" aria-hidden="true"></div>
    <div class="container hero__inner">
      <p class="hero__status fade-in" v-if="profile.available">
        <span class="hero__status-dot"></span>
        Available for new opportunities
      </p>

      <h1 class="hero__title fade-in" style="animation-delay: 0.05s">
        Hi, I'm <span class="text-gradient">{{ profile.name }}</span>.
        <br />
        I'm a {{ profile.role }}.
      </h1>

      <p class="hero__tagline fade-in" style="animation-delay: 0.1s">
        {{ profile.tagline }}
      </p>

      <div class="hero__actions fade-in" style="animation-delay: 0.15s">
        <a href="#projects" class="btn btn--primary">
          View my work
          <AppIcon name="arrow-down" :size="18" />
        </a>
        <a href="#contact" class="btn btn--ghost">Get in touch</a>
      </div>

      <ul class="hero__socials fade-in" style="animation-delay: 0.2s">
        <li v-for="social in socials" :key="social.label">
          <a :href="social.href" class="hero__social-link" target="_blank" rel="noopener noreferrer"
            :aria-label="social.label">
            <AppIcon :name="social.icon" :size="20" />
          </a>
        </li>
      </ul>

      <div class="hero__stats fade-in" style="animation-delay: 0.25s">
        <button class="hero__like-btn" :class="{ 'hero__like-btn--liked': liked }" :disabled="liked" @click="likePage"
          :aria-label="liked ? 'Already liked' : 'Like this page'">
          <AppIcon :name="liked ? 'heart-filled' : 'heart'" :size="20" />
          <span class="hero__like-count">{{ likes }}</span>
          <span class="hero__like-label">{{ liked ? 'Liked!' : 'Like' }}</span>
        </button>
        <p class="hero__visit-count" :class="{ 'hero_visit-count--copied': copied }" @click="copyLink" role="button"
          tabindex="0" title="Click to copy link">
          <AppIcon name="external" :size="14" />
          <span>{{ visits }} visit{{ visits !== 1 ? 's' : '' }}</span>
        </p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  overflow: hidden;
  padding-top: 4.5rem;
}

.hero__glow {
  position: absolute;
  top: -20%;
  left: 50%;
  transform: translateX(-50%);
  width: 60rem;
  height: 40rem;
  background: radial-gradient(ellipse at center,
      rgba(99, 102, 241, 0.18),
      transparent 70%);
  pointer-events: none;
}

.hero__inner {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.hero__status {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-4);
  border-radius: var(--radius-full);
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  font-size: var(--fs-sm);
  color: var(--color-text-muted);
  margin-bottom: var(--space-5);
}

.hero__status-dot {
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 50%;
  background-color: var(--color-success);
  box-shadow: 0 0 0 4px color-mix(in srgb, var(--color-success) 25%, transparent);
}

.hero__title {
  font-size: clamp(2.5rem, 6vw, var(--fs-4xl));
  letter-spacing: -0.02em;
  margin-bottom: var(--space-5);
}

.hero__tagline {
  font-size: var(--fs-xl);
  color: var(--color-text-muted);
  max-width: 46ch;
  margin-bottom: var(--space-7);
}

.hero__actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3);
  justify-content: center;
  margin-bottom: var(--space-7);
}

.hero__socials {
  display: flex;
  gap: var(--space-3);
}

.hero__stats {
  margin-top: var(--space-6);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-3);
}

.hero__like-btn {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  background: var(--color-surface);
  border: 2px solid var(--color-border);
  border-radius: var(--radius-full);
  padding: var(--space-3) var(--space-5);
  color: var(--color-text-muted);
  font-family: inherit;
  font-size: var(--fs-base);
  font-weight: var(--fw-semibold);
  cursor: pointer;
  transition: all var(--transition-base);
}

.hero__like-btn:hover:not(:disabled) {
  color: #e74c3c;
  border-color: #e74c3c;
  transform: scale(1.06);
  box-shadow: 0 0 24px rgba(231, 76, 60, 0.15);
}

.hero__like-btn--liked {
  color: #e74c3c;
  border-color: #e74c3c;
  background-color: rgba(231, 76, 60, 0.06);
  cursor: default;
  animation: heartPop 0.4s ease;
}

@keyframes heartPop {
  0% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.15);
  }

  100% {
    transform: scale(1);
  }
}

.hero__like-count {
  font-size: var(--fs-xl);
  font-variant-numeric: tabular-nums;
}

.hero__like-label {
  font-size: var(--fs-sm);
  opacity: 0.8;
}

.hero__visit-count {
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
  color: var(--color-text-muted);
  font-size: var(--fs-sm);
  opacity: 0.6;
  cursor: pointer;
  padding: var(--space-1) var(--space-2);
  border-radius: var(--radius-sm);
  transition: opacity var(--transition-fast), color var(--transition-fast),
    background-color var(--transition-fast);
}

.hero__visit-count:hover {
  opacity: 1;
  color: var(--color-primary);
  background-color: var(--color-surface);
}

.hero__visit-count--copied {
  opacity: 1;
  color: var(--color-success);
}

.hero__social-link {
  display: grid;
  place-items: center;
  width: 2.75rem;
  height: 2.75rem;
  border-radius: var(--radius-full);
  color: var(--color-text-muted);
  border: 1px solid var(--color-border);
  background-color: var(--color-surface);
  transition: color var(--transition-fast), transform var(--transition-fast),
    border-color var(--transition-fast);
}

.hero__social-link:hover {
  color: var(--color-primary);
  border-color: var(--color-primary);
  transform: translateY(-3px);
}
</style>
