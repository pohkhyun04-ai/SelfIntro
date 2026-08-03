<script setup lang="ts">
import { profile } from '@/data/portfolio'
import AppIcon from './AppIcon.vue'

const stats = [
  { label: 'Years experience', value: '6+' },
  { label: 'Projects shipped', value: '40+' },
  { label: 'Open-source stars', value: '3k+' },
]
</script>

<template>
  <section id="about" class="section">
    <div class="container about">
      <div class="about__text">
        <span class="section__eyebrow">About</span>
        <h2 class="section__title">A bit about me</h2>
        <p class="about__summary">{{ profile.summary }}</p>
        <p class="about__meta">
          <AppIcon name="map-pin" :size="16" />
          {{ profile.location }}
        </p>
      </div>

      <aside class="about__stats">
        <div v-for="stat in stats" :key="stat.label" class="about__stat">
          <span class="about__stat-value text-gradient">{{ stat.value }}</span>
          <span class="about__stat-label">{{ stat.label }}</span>
        </div>
      </aside>
    </div>
  </section>
</template>

<style scoped>
.about {
  display: grid;
  grid-template-columns: 1.4fr 1fr;
  gap: var(--space-8);
  align-items: center;
}

.about__summary {
  font-size: var(--fs-lg);
  color: var(--color-text-muted);
  margin-bottom: var(--space-5);
  max-width: 56ch;
}

.about__meta {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  color: var(--color-text-muted);
  font-size: var(--fs-sm);
}

.about__stats {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-4);
}

.about__stat {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
  padding: var(--space-5);
  border-radius: var(--radius-lg);
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  transition: transform var(--transition-base), border-color var(--transition-base);
}

.about__stat:hover {
  transform: translateY(-4px);
  border-color: var(--color-primary);
}

.about__stat-value {
  font-size: var(--fs-2xl);
  font-weight: var(--fw-bold);
}

.about__stat-label {
  font-size: var(--fs-sm);
  color: var(--color-text-muted);
}

@media (max-width: 860px) {
  .about {
    grid-template-columns: 1fr;
  }
}
</style>
