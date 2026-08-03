<script setup lang="ts">
import { ref, nextTick, watch } from 'vue'

// ---- types ----
interface ChatMessage {
  role: 'user' | 'model'
  text: string
}

// ---- state ----
const isOpen = ref(false)
const input = ref('')
const messages = ref<ChatMessage[]>([])
const loading = ref(false)
const error = ref('')
const chatBody = ref<HTMLElement | null>(null)

// Track whether the custom avatar image loaded successfully
const hasAvatar = ref(true)

// Predefined FAQ quick-questions (always shown when chat is empty)
const faqQuestions = [
  "What skills does Qia have?",
  "Tell me about Qia's projects",
  "What is Qia's work experience?",
  "Is Qia available for hire?",
  "How can I contact Qia?",
]

// ---- methods ----
function toggleChat() {
  isOpen.value = !isOpen.value
  error.value = ''
  if (isOpen.value) {
    nextTick(() => scrollToBottom())
  }
}

function sendMessage(text?: string) {
  const msg = (text ?? input.value).trim()
  if (!msg || loading.value) return

  // Add user message
  messages.value.push({ role: 'user', text: msg })
  input.value = ''
  error.value = ''
  loading.value = true

  nextTick(() => scrollToBottom())

  // Build history (exclude the latest user message)
  const history = messages.value.slice(0, -1)

  fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: msg, history }),
  })
    .then(async (res) => {
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error ?? 'Request failed')
      }
      messages.value.push({ role: 'model', text: data.reply })
    })
    .catch((err: Error) => {
      error.value = err.message ?? 'Failed to send message.'
    })
    .finally(() => {
      loading.value = false
      nextTick(() => scrollToBottom())
    })
}

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    sendMessage()
  }
}

function scrollToBottom() {
  if (chatBody.value) {
    chatBody.value.scrollTop = chatBody.value.scrollHeight
  }
}

// Auto-scroll when messages change
watch(messages, () => {
  nextTick(() => scrollToBottom())
}, { deep: true })
</script>

<template>
  <!-- ========== Floating chat bubble / panel ========== -->
  <div class="chatbot" :class="{ 'chatbot--open': isOpen }">
    <!-- Toggle button -->
    <button class="chatbot__toggle" :aria-label="isOpen ? 'Close chat' : 'Open chat'" @click="toggleChat">
      <!-- Chat icon -->
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
        stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        <path d="M8 10h.01M12 10h.01M16 10h.01" />
      </svg>
    </button>

    <!-- Chat panel -->
    <Transition name="chat-panel">
      <div v-if="isOpen" class="chatbot__panel">
        <!-- Header -->
        <div class="chatbot__header">
          <div class="chatbot__header-info">
            <div class="chatbot__avatar">
              <img
                v-if="hasAvatar"
                :src="'/api/avatar'"
                alt="AI Assistant"
                class="chatbot__avatar-img"
                @error="hasAvatar = false"
              />
              <!-- Fallback SVG shown if no image uploaded yet -->
              <svg
                v-if="!hasAvatar"
                class="chatbot__avatar-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <circle cx="12" cy="8" r="4" />
                <path d="M4 20c0-4 4-7 8-7s8 3 8 7" />
              </svg>
            </div>
            <div>
              <p class="chatbot__title">Qia's AI Assistant</p>
              <p class="chatbot__subtitle">Ask me anything!</p>
            </div>
          </div>
          <button class="chatbot__close-btn" @click="isOpen = false" aria-label="Close">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
              stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <!-- Body: messages or FAQ -->
        <div ref="chatBody" class="chatbot__body">
          <!-- FAQ quick-questions (shown when no messages) -->
          <div v-if="messages.length === 0" class="chatbot__faq">
            <p class="chatbot__faq-title">Frequently Asked Questions</p>
            <button v-for="q in faqQuestions" :key="q" class="chatbot__faq-btn" @click="sendMessage(q)">
              {{ q }}
            </button>
          </div>

          <!-- Messages -->
          <div v-for="(msg, i) in messages" :key="i" class="chatbot__msg"
            :class="msg.role === 'user' ? 'chatbot__msg--user' : 'chatbot__msg--bot'">
            <p>{{ msg.text }}</p>
          </div>

          <!-- Typing indicator -->
          <div v-if="loading" class="chatbot__msg chatbot__msg--bot">
            <div class="chatbot__typing">
              <span></span><span></span><span></span>
            </div>
          </div>

          <!-- Error -->
          <p v-if="error" class="chatbot__error">{{ error }}</p>
        </div>

        <!-- Input area -->
        <div class="chatbot__input-area">
          <input v-model="input" class="chatbot__input" type="text" placeholder="Type a message..." :disabled="loading"
            @keydown="handleKeydown" />
          <button class="chatbot__send" :disabled="!input.trim() || loading" @click="sendMessage()" aria-label="Send">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
              stroke-linecap="round" stroke-linejoin="round">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
/* ---- Floating container ---- */
.chatbot {
  position: fixed;
  bottom: var(--space-5);
  right: var(--space-5);
  z-index: 9999;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: var(--space-3);
}

/* ---- Toggle button ---- */
.chatbot__toggle {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  border: none;
  background: var(--color-primary);
  color: #fff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: var(--shadow-md);
  transition: transform var(--transition-fast), background var(--transition-fast);
  flex-shrink: 0;
}

.chatbot__toggle:hover {
  background: var(--color-primary-hover);
  transform: scale(1.08);
}

.chatbot--open .chatbot__toggle {
  background: var(--color-surface);
  color: var(--color-text);
  border: 1px solid var(--color-border);
}

.chatbot--open .chatbot__toggle:hover {
  color: var(--color-danger);
}

/* ---- Panel ---- */
.chatbot__panel {
  width: 360px;
  height: 500px;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* Panel transition */
.chat-panel-enter-active {
  transition: all 250ms cubic-bezier(0.4, 0, 0.2, 1);
}

.chat-panel-leave-active {
  transition: all 150ms ease;
}

.chat-panel-enter-from {
  opacity: 0;
  transform: translateY(16px) scale(0.96);
}

.chat-panel-leave-to {
  opacity: 0;
  transform: translateY(8px) scale(0.98);
}

/* ---- Header ---- */
.chatbot__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-3) var(--space-4);
  border-bottom: 1px solid var(--color-border);
  background: var(--color-bg-soft);
  flex-shrink: 0;
}

.chatbot__header-info {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.chatbot__avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: var(--color-primary);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  overflow: hidden;
}

.chatbot__avatar-img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
}

.chatbot__avatar-icon {
  width: 22px;
  height: 22px;
}

.chatbot__title {
  font-size: var(--fs-sm);
  font-weight: var(--fw-semibold);
  color: var(--color-heading);
  margin: 0;
}

.chatbot__subtitle {
  font-size: var(--fs-xs);
  color: var(--color-text-muted);
  margin: 2px 0 0;
}

.chatbot__close-btn {
  background: none;
  border: 0.5px solid var(--color-border);
  color: var(--color-text-muted);
  cursor: pointer;
  padding: 5px;
  border-radius: var(--radius-sm);
  display: flex;
}

.chatbot__close-btn:hover {
  color: var(--color-text);
  background: var(--color-surface-hover);
}

/* ---- Body ---- */
.chatbot__body {
  flex: 1;
  overflow-y: auto;
  padding: var(--space-4);
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

/* ---- FAQ ---- */
.chatbot__faq {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-4) 0;
}

.chatbot__faq-title {
  font-size: var(--fs-sm);
  font-weight: var(--fw-medium);
  color: var(--color-text-muted);
  margin: 0 0 var(--space-2);
}

.chatbot__faq-btn {
  width: 100%;
  text-align: left;
  padding: var(--space-3) var(--space-4);
  background: var(--color-bg-soft);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  color: var(--color-text);
  font-family: inherit;
  font-size: var(--fs-sm);
  cursor: pointer;
  transition: background var(--transition-fast), border-color var(--transition-fast);
}

.chatbot__faq-btn:hover {
  background: var(--color-surface-hover);
  border-color: var(--color-primary);
}

/* ---- Messages ---- */
.chatbot__msg {
  max-width: 85%;
  padding: var(--space-2) var(--space-3);
  border-radius: var(--radius-md);
  font-size: var(--fs-sm);
  line-height: 1.5;
}

.chatbot__msg p {
  margin: 0;
}

.chatbot__msg--user {
  align-self: flex-end;
  background: var(--color-primary);
  color: #fff;
  border-bottom-right-radius: 4px;
}

.chatbot__msg--bot {
  align-self: flex-start;
  background: var(--color-bg-soft);
  color: var(--color-text);
  border-bottom-left-radius: 4px;
}

/* ---- Typing dots ---- */
.chatbot__typing {
  display: flex;
  gap: 4px;
  padding: 2px 0;
}

.chatbot__typing span {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--color-text-muted);
  animation: typing-bounce 1.2s infinite ease-in-out;
}

.chatbot__typing span:nth-child(2) {
  animation-delay: 0.15s;
}

.chatbot__typing span:nth-child(3) {
  animation-delay: 0.3s;
}

@keyframes typing-bounce {

  0%,
  60%,
  100% {
    opacity: 0.3;
    transform: translateY(0);
  }

  30% {
    opacity: 1;
    transform: translateY(-4px);
  }
}

/* ---- Error ---- */
.chatbot__error {
  color: var(--color-danger);
  font-size: var(--fs-xs);
  text-align: center;
  margin: 0;
}

/* ---- Input area ---- */
.chatbot__input-area {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-3) var(--space-4);
  border-top: 1px solid var(--color-border);
  flex-shrink: 0;
}

.chatbot__input {
  flex: 1;
  padding: var(--space-2) var(--space-3);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-full);
  background: var(--color-bg-soft);
  color: var(--color-text);
  font-family: inherit;
  font-size: var(--fs-sm);
  outline: none;
  transition: border-color var(--transition-fast);
}

.chatbot__input:focus {
  border-color: var(--color-primary);
}

.chatbot__input::placeholder {
  color: var(--color-text-muted);
}

.chatbot__send {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  border: none;
  background: var(--color-primary);
  color: #fff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: background var(--transition-fast), opacity var(--transition-fast);
}

.chatbot__send:hover:not(:disabled) {
  background: var(--color-primary-hover);
}

.chatbot__send:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

/* ---- Responsive ---- */
@media (max-width: 480px) {
  .chatbot__panel {
    width: calc(100vw - 32px);
    height: 460px;
  }
}
</style>
