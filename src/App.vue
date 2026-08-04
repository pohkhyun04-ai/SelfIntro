<script setup lang="ts">
import { useAdmin } from '@/composables/useAdmin'
import { useI18n } from 'vue-i18n'
import AdminLogin from '@/components/AdminLogin.vue'
import AdminDashboard from '@/components/AdminDashboard.vue'
import ChatBot from '@/components/ChatBot.vue'
import TheHeader from '@/components/TheHeader.vue'
import HeroSection from '@/components/HeroSection.vue'
import AboutSection from '@/components/AboutSection.vue'
import SkillsSection from '@/components/SkillsSection.vue'
import ProjectsSection from '@/components/ProjectsSection.vue'
import ExperienceSection from '@/components/ExperienceSection.vue'
import ContactSection from '@/components/ContactSection.vue'
import TheFooter from '@/components/TheFooter.vue'

const { t } = useI18n()
const { isLoggedIn, showAdmin } = useAdmin()
</script>

<template>
  <!-- ========== Admin panel ========== -->
  <template v-if="showAdmin">
    <div class="admin-bar">
      <button class="admin-bar__back" @click="showAdmin = false">
        {{ t('admin.backToPortfolio') }}
      </button>
    </div>
    <AdminLogin v-if="!isLoggedIn" />
    <AdminDashboard v-else />
  </template>

  <!-- ========== Public portfolio ========== -->
  <template v-else>
    <TheHeader />
    <main>
      <HeroSection />
      <AboutSection />
      <SkillsSection />
      <ProjectsSection />
      <ExperienceSection />
      <ContactSection />
    </main>
    <TheFooter />
    <ChatBot />
  </template>
</template>

<style scoped>
.admin-bar {
  max-width: var(--container-max);
  margin: 0 auto;
  padding: var(--space-3) var(--space-4);
}

.admin-bar__back {
  background: none;
  border: none;
  color: var(--color-text-muted);
  font-family: inherit;
  font-size: var(--fs-sm);
  cursor: pointer;
}

.admin-bar__back:hover {
  color: var(--color-primary);
}
</style>
