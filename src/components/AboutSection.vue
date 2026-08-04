<script setup lang="ts">
import { profile } from '@/data/portfolio'
import { useI18n } from 'vue-i18n'
import AppIcon from './AppIcon.vue'

const { t } = useI18n()

const stats = [
  { label: t('about.stats.curiosity'), value: t('content.aboutStats.curiosityValue') },
  { label: t('about.stats.learning'), value: t('content.aboutStats.learningValue') },
  { label: t('about.stats.mbti'), value: t('content.aboutStats.mbtiValue') },
]
</script>

<template>
  <section id="about" class="section">
    <div class="container about">
      <div class="about__text">
        <span class="section__eyebrow">{{ t('about.eyebrow') }}</span>
        <h2 class="section__title">{{ t('about.title') }}</h2>
        <p class="about__summary">{{ t('content.profile.summary') }}</p>
        <p class="about__meta">
          <AppIcon name="map-pin" :size="16" />
          {{ profile.location }}
        </p> <br/>
        <p class="about__meta">
          <AppIcon name="graduation-cap" :size="16" />
          {{ profile.school }}
        </p> <br/>
        <p class="about__meta">
          <b>{{ t('about.hobbies') }}</b>
          {{ profile.hobbies.join(', ') }}
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
