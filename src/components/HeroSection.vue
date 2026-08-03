<script setup lang="ts">
import { profile, socials } from '@/data/portfolio'
import AppIcon from './AppIcon.vue'
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
          <a
            :href="social.href"
            class="hero__social-link"
            target="_blank"
            rel="noopener noreferrer"
            :aria-label="social.label"
          >
            <AppIcon :name="social.icon" :size="20" />
          </a>
        </li>
      </ul>
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
  background: radial-gradient(
    ellipse at center,
    rgba(99, 102, 241, 0.18),
    transparent 70%
  );
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
