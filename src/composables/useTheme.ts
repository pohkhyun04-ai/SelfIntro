import { ref, watch, onMounted } from 'vue'

export type Theme = 'dark' | 'light'

const STORAGE_KEY = 'portfolio-theme'
const theme = ref<Theme>('dark')

/** Apply the current theme to the document root. */
function applyTheme(value: Theme): void {
  document.documentElement.setAttribute('data-theme', value)
}

/** Toggle between light and dark themes. */
export function toggleTheme(): void {
  theme.value = theme.value === 'dark' ? 'light' : 'dark'
}

export function useTheme() {
  onMounted(() => {
    let initial: Theme = 'dark'

    const stored = localStorage.getItem(STORAGE_KEY) as Theme | null
    if (stored === 'light' || stored === 'dark') {
      initial = stored
    } else if (window.matchMedia('(prefers-color-scheme: light)').matches) {
      initial = 'light'
    }

    theme.value = initial
    applyTheme(initial)
  })

  watch(theme, (value) => {
    applyTheme(value)
    localStorage.setItem(STORAGE_KEY, value)
  })

  return { theme, toggleTheme }
}
