<script setup lang="ts">
import { projects } from '@/data/portfolio'
import AppIcon from './AppIcon.vue'
</script>

<template>
  <section id="projects" class="section">
    <div class="container">
      <span class="section__eyebrow">Projects</span>
      <h2 class="section__title">Selected work</h2>
      <p class="section__subtitle">
        A few things I've built recently. Each one taught me something new about
        building for real users at scale.
      </p>

      <div class="projects__grid">
        <article
          v-for="project in projects"
          :key="project.title"
          class="project-card"
        >
          <div class="project-card__top">
            <span class="project-card__icon">
              <AppIcon name="code" :size="20" />
            </span>
            <div class="project-card__links">
              <a
                v-if="project.repo"
                :href="project.repo"
                class="project-card__link"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Source code"
              >
                <AppIcon name="github" :size="18" />
              </a>
              <a
                v-if="project.link"
                :href="project.link"
                class="project-card__link"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Live demo"
              >
                <AppIcon name="external" :size="18" />
              </a>
            </div>
          </div>

          <h3 class="project-card__title">{{ project.title }}</h3>
          <p class="project-card__desc">{{ project.description }}</p>

          <ul class="project-card__tags">
            <li v-for="tag in project.tags" :key="tag" class="project-card__tag">
              {{ tag }}
            </li>
          </ul>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped>
.projects__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: var(--space-5);
}

.project-card {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  padding: var(--space-6);
  border-radius: var(--radius-lg);
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  transition: transform var(--transition-base), border-color var(--transition-base),
    box-shadow var(--transition-base);
}

.project-card:hover {
  transform: translateY(-6px);
  border-color: var(--color-primary);
  box-shadow: var(--shadow-md);
}

.project-card__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.project-card__icon {
  display: grid;
  place-items: center;
  width: 2.75rem;
  height: 2.75rem;
  border-radius: var(--radius-md);
  color: var(--color-primary);
  background-color: color-mix(in srgb, var(--color-primary) 14%, transparent);
}

.project-card__links {
  display: flex;
  gap: var(--space-2);
}

.project-card__link {
  display: grid;
  place-items: center;
  width: 2.25rem;
  height: 2.25rem;
  border-radius: var(--radius-full);
  color: var(--color-text-muted);
  transition: color var(--transition-fast), background-color var(--transition-fast);
}

.project-card__link:hover {
  color: var(--color-primary);
  background-color: var(--color-surface-hover);
}

.project-card__title {
  font-size: var(--fs-xl);
}

.project-card__desc {
  color: var(--color-text-muted);
  font-size: var(--fs-sm);
  flex-grow: 1;
}

.project-card__tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  margin-top: auto;
}

.project-card__tag {
  font-size: var(--fs-xs);
  font-family: var(--font-mono);
  padding: var(--space-1) var(--space-2);
  border-radius: var(--radius-sm);
  background-color: var(--color-bg-soft);
  color: var(--color-text-muted);
  border: 1px solid var(--color-border);
}
</style>
