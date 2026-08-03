<script setup lang="ts">
import { experience } from '@/data/portfolio'
</script>

<template>
  <section id="experience" class="section experience">
    <div class="container">
      <span class="section__eyebrow">Experience</span>
      <h2 class="section__title">Where I've worked</h2>

      <ol class="timeline">
        <li v-for="(item, index) in experience" :key="index" class="timeline__item">
          <div class="timeline__dot" aria-hidden="true"></div>
          <div class="timeline__content">
            <div class="timeline__head">
              <h3 class="timeline__role">{{ item.role }}</h3>
              <span class="timeline__period">{{ item.period }}</span>
            </div>
            <p class="timeline__company">{{ item.company }}</p>
            <p class="timeline__desc">{{ item.description }}</p>
          </div>
        </li>
      </ol>
    </div>
  </section>
</template>

<style scoped>
.experience {
  background-color: var(--color-bg-soft);
}

.timeline {
  position: relative;
  margin-top: var(--space-6);
  padding-left: var(--space-6);
}

.timeline::before {
  content: '';
  position: absolute;
  top: 0.5rem;
  bottom: 0.5rem;
  left: 5px;
  width: 2px;
  background: linear-gradient(
    to bottom,
    var(--color-primary),
    var(--color-accent),
    transparent
  );
}

.timeline__item {
  position: relative;
  padding-bottom: var(--space-7);
}

.timeline__item:last-child {
  padding-bottom: 0;
}

.timeline__dot {
  position: absolute;
  left: calc(-1 * var(--space-6) + 1px);
  top: 0.4rem;
  width: 11px;
  height: 11px;
  border-radius: 50%;
  background-color: var(--color-bg-soft);
  border: 2px solid var(--color-primary);
  box-shadow: 0 0 0 4px var(--color-bg-soft);
}

.timeline__content {
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--space-5);
  transition: border-color var(--transition-base), transform var(--transition-base);
}

.timeline__content:hover {
  border-color: var(--color-primary);
  transform: translateX(4px);
}

.timeline__head {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: baseline;
  gap: var(--space-2);
}

.timeline__role {
  font-size: var(--fs-lg);
}

.timeline__period {
  font-size: var(--fs-sm);
  color: var(--color-text-muted);
  font-variant-numeric: tabular-nums;
}

.timeline__company {
  color: var(--color-primary);
  font-weight: var(--fw-semibold);
  margin-bottom: var(--space-2);
}

.timeline__desc {
  color: var(--color-text-muted);
  font-size: var(--fs-sm);
}
</style>
