import { ref, computed } from "vue";

const TOKEN_KEY = "admin_token";

// Module-level singletons — shared across all components
const token = ref<string | null>(localStorage.getItem(TOKEN_KEY));
const showAdmin = ref(false);

export function useAdmin() {
  const isLoggedIn = computed(() => !!token.value);

  /** Store token after successful login. */
  function login(newToken: string): void {
    token.value = newToken;
    localStorage.setItem(TOKEN_KEY, newToken);
  }

  /** Clear token (logout). */
  function logout(): void {
    token.value = null;
    localStorage.removeItem(TOKEN_KEY);
  }

  /** Switch the UI to the admin panel. */
  function openAdmin(): void {
    showAdmin.value = true;
  }

  /** Return to the public portfolio. */
  function closeAdmin(): void {
    showAdmin.value = false;
  }

  /** Helper: Authorization header object for fetch calls. */
  function authHeaders(): Record<string, string> {
    return token.value
      ? { Authorization: `Bearer ${token.value}` }
      : {};
  }

  return { token, isLoggedIn, showAdmin, login, logout, openAdmin, closeAdmin, authHeaders };
}
