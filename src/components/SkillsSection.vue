<script setup lang="ts">
import { skills } from '@/data/portfolio'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<template>
  <section id="skills" class="section skills">
    <div class="container">
      <span class="section__eyebrow">{{ t('skills.eyebrow') }}</span>
      <h2 class="section__title">{{ t('skills.title') }}</h2>
      <p class="section__subtitle">
        {{ t('skills.subtitle') }}
      </p>

      <div class="skills__grid">
        <div v-for="skill in skills" :key="skill.name" class="skill">
          <div class="skill__head">
            <span class="skill__name">{{ skill.name }}</span>
            <span class="skill__pct">{{ skill.level }}%</span>
          </div>
          <div class="skill__track">
            <div
              class="skill__bar"
              :style="{ width: `${skill.level}%` }"
              role="progressbar"
              :aria-valuenow="skill.level"
              aria-valuemin="0"
              aria-valuemax="100"
              :aria-label="t('skills.ariaProficiency', { skill: skill.name })"
            ></div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.skills {
  background-color: var(--color-bg-soft);
}

.skills__grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-5) var(--space-6);
}

.skill__head {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: var(--space-2);
}

.skill__name {
  font-weight: var(--fw-semibold);
  color: var(--color-heading);
}

.skill__pct {
  font-size: var(--fs-sm);
  color: var(--color-text-muted);
  font-variant-numeric: tabular-nums;
}

.skill__track {
  height: 0.5rem;
  border-radius: var(--radius-full);
  background-color: var(--color-border);
  overflow: hidden;
}

.skill__bar {
  height: 100%;
  border-radius: var(--radius-full);
  background: linear-gradient(90deg, var(--color-primary), var(--color-accent));
  transition: width 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}

@media (max-width: 640px) {
  .skills__grid {
    grid-template-columns: 1fr;
  }
}
</style>
