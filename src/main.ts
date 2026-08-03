import { createApp } from 'vue'
import App from './App.vue'
import { profile } from './data/portfolio'
import './assets/styles/main.css'

createApp(App).mount('#app')

// Keep the browser tab title in sync with portfolio.ts at runtime.
document.title = `${profile.name} — ${profile.role}`
