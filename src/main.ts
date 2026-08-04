import { createApp } from 'vue'
import App from './App.vue'
import { profile } from './data/portfolio'
import i18n from './i18n'
import './assets/styles/main.css'

const app = createApp(App)
app.use(i18n)
app.mount('#app')

// Keep the browser tab title in sync with locale
document.title = `${profile.name} — ${profile.role}`
