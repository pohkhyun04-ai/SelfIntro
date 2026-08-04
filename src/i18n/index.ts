import { createI18n } from 'vue-i18n'
import en from './en.json'
import zh from './zh.json'

// Detect saved locale or browser preference
function getInitialLocale(): string {
  const saved = localStorage.getItem('locale')
  if (saved === 'zh' || saved === 'en') return saved

  const browserLang = navigator.language.toLowerCase()
  if (browserLang.startsWith('zh')) return 'zh'

  return 'en'
}

const i18n = createI18n({
  legacy: false,
  locale: getInitialLocale(),
  fallbackLocale: 'en',
  messages: { en, zh },
  warnHtmlMessage: false,
})

export default i18n

/** Switch locale and persist to localStorage */
export function setLocale(locale: 'en' | 'zh'): void {
  (i18n.global.locale as any).value = locale
  localStorage.setItem('locale', locale)
  document.documentElement.lang = locale === 'zh' ? 'zh-CN' : 'en'
}

// Set initial html lang
const initLocale = getInitialLocale()
document.documentElement.lang = initLocale === 'zh' ? 'zh-CN' : 'en'
