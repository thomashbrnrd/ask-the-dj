<template>
  <div class="min-h-screen bg-zinc-950 flex items-start justify-center">
    <!-- Phone container on desktop -->
    <div class="w-full max-w-[420px] min-h-screen bg-zinc-950 relative overflow-hidden flex flex-col">

      <!-- ===== EDIT MODE ===== -->
      <Transition name="fade">
        <div v-if="!isDisplayMode" class="flex flex-col min-h-screen">

          <!-- Header -->
          <header class="pt-10 pb-4 px-6 text-center">
            <h1 class="text-3xl font-black text-white tracking-tight">AskTheDJ</h1>
            <p class="text-zinc-400 text-sm mt-1 font-medium">Show your message. Be seen instantly.</p>
          </header>

          <!-- Main content scrollable -->
          <main class="flex-1 overflow-y-auto px-4 pb-36">

            <!-- Message input -->
            <div class="mt-4">
              <div class="relative">
                <input
                  ref="inputRef"
                  v-model="localMessage"
                  type="text"
                  maxlength="40"
                  placeholder="Type your message…"
                  autocomplete="off"
                  autocorrect="off"
                  spellcheck="false"
                  class="w-full bg-zinc-900 text-white text-xl font-bold rounded-2xl px-5 py-4 outline-none border-2 border-zinc-700 focus:border-white transition-colors placeholder:text-zinc-600 pr-14"
                  @input="onInput"
                />
                <span class="absolute right-4 bottom-4 text-zinc-500 text-xs font-mono">
                  {{ localMessage.length }}/40
                </span>
              </div>
            </div>

            <!-- Preset messages -->
            <div class="mt-5">
              <p class="text-zinc-500 text-xs font-semibold uppercase tracking-widest mb-3 px-1">Quick messages</p>
              <div class="flex gap-2 overflow-x-auto pb-1 snap-x scrollbar-none">
                <button
                  v-for="preset in PRESETS"
                  :key="preset"
                  class="flex-shrink-0 snap-start bg-zinc-800 hover:bg-zinc-700 active:scale-95 text-white text-sm font-bold px-4 py-2 rounded-full transition-all whitespace-nowrap"
                  @click="usePreset(preset)"
                >
                  {{ preset }}
                </button>
              </div>
            </div>

            <!-- Color selector -->
            <div class="mt-6">
              <p class="text-zinc-500 text-xs font-semibold uppercase tracking-widest mb-3 px-1">Color</p>
              <div class="flex gap-3 flex-wrap">
                <button
                  v-for="color in COLORS"
                  :key="color.value"
                  :title="color.label"
                  :class="[
                    'w-10 h-10 rounded-full border-2 transition-all active:scale-95',
                    settings.color === color.value
                      ? 'border-white scale-110 shadow-lg'
                      : 'border-zinc-700 opacity-70 hover:opacity-100',
                  ]"
                  :style="{ background: color.hex }"
                  @click="updateColor(color.value)"
                />
              </div>
            </div>

            <!-- Scroll speed selector -->
            <div class="mt-6">
              <p class="text-zinc-500 text-xs font-semibold uppercase tracking-widest mb-3 px-1">Scroll speed</p>
              <div class="flex gap-2">
                <button
                  v-for="spd in SPEEDS"
                  :key="spd.value"
                  :class="[
                    'flex-1 py-2 rounded-xl text-sm font-bold transition-all active:scale-95',
                    settings.speed === spd.value
                      ? 'bg-white text-black'
                      : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700',
                  ]"
                  @click="updateSpeed(spd.value)"
                >
                  {{ spd.label }}
                </button>
              </div>
            </div>

            <!-- Text size selector -->
            <div class="mt-6">
              <p class="text-zinc-500 text-xs font-semibold uppercase tracking-widest mb-3 px-1">Text size</p>
              <div class="flex gap-2">
                <button
                  v-for="sz in SIZES"
                  :key="sz.value"
                  :class="[
                    'flex-1 py-2 rounded-xl font-bold transition-all active:scale-95',
                    settings.size === sz.value
                      ? 'bg-white text-black'
                      : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700',
                    sz.value === 'L' ? 'text-base' : sz.value === 'XL' ? 'text-lg' : 'text-xl',
                  ]"
                  @click="updateSize(sz.value)"
                >
                  {{ sz.label }}
                </button>
              </div>
            </div>

            <!-- PWA Install hint -->
            <div v-if="showInstallHint" class="mt-6 bg-zinc-900 border border-zinc-700 rounded-2xl px-4 py-3 flex items-center gap-3">
              <span class="text-2xl">📲</span>
              <div class="flex-1">
                <p class="text-white text-sm font-semibold">Install AskTheDJ</p>
                <p class="text-zinc-500 text-xs mt-0.5">Faster access at festivals.</p>
              </div>
              <button
                class="text-zinc-500 hover:text-white text-lg leading-none transition-colors"
                @click="showInstallHint = false"
              >
                ✕
              </button>
            </div>

          </main>

          <!-- Sticky CTA button -->
          <div class="fixed bottom-0 left-0 right-0 px-4 pb-8 pt-4 bg-gradient-to-t from-zinc-950 via-zinc-950/95 to-transparent max-w-[420px] mx-auto">
            <button
              :disabled="!localMessage.trim()"
              class="w-full py-5 rounded-2xl text-xl font-black tracking-widest transition-all active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed"
              :class="localMessage.trim() ? 'bg-white text-black hover:bg-zinc-100 shadow-2xl shadow-white/20' : 'bg-zinc-800 text-zinc-500'"
              @click="onShowMessage"
            >
              SHOW MESSAGE
            </button>
          </div>

        </div>
      </Transition>

      <!-- ===== DISPLAY MODE ===== -->
      <Transition name="fade">
        <div
          v-if="isDisplayMode"
          class="fixed inset-0 bg-black z-50 flex items-center overflow-hidden cursor-pointer select-none"
          @click="toggleOverlay"
          @touchstart="onTouchStart"
          @touchend="onTouchEnd"
        >
          <!-- Scrolling banner -->
          <div class="relative w-full flex items-center" :style="bannerHeightStyle">
            <div
              class="flex items-center whitespace-nowrap will-change-transform"
              :class="scrollAnimClass"
              :style="scrollAnimStyle"
            >
              <!-- Duplicate for seamless loop -->
              <span
                v-for="n in 4"
                :key="n"
                class="font-black uppercase"
                :class="[textSizeClass, textColorClass, 'px-[1em]']"
                :style="{ letterSpacing: '0.08em' }"
              >
                {{ displayMessage }}
              </span>
            </div>
          </div>

          <!-- Tap hint (brief flash) -->
          <Transition name="fade-quick">
            <div
              v-if="showTapHint"
              class="absolute inset-0 flex items-end justify-center pb-10 pointer-events-none"
            >
              <p class="text-white/40 text-sm font-medium">Tap to open controls</p>
            </div>
          </Transition>

          <!-- Overlay controls -->
          <Transition name="slide-up">
            <div
              v-if="showOverlay"
              class="absolute inset-0 bg-black/80 flex flex-col justify-end"
              @click.stop
            >
              <div class="bg-zinc-900 rounded-t-3xl px-6 pt-2 pb-10">
                <!-- Handle bar -->
                <div class="w-10 h-1 bg-zinc-700 rounded-full mx-auto mb-6" />

                <!-- Overlay color row -->
                <div class="mb-5">
                  <p class="text-zinc-500 text-xs font-semibold uppercase tracking-widest mb-3">Color</p>
                  <div class="flex gap-3">
                    <button
                      v-for="color in COLORS"
                      :key="color.value"
                      :style="{ background: color.hex }"
                      :class="[
                        'w-9 h-9 rounded-full border-2 transition-all active:scale-95',
                        settings.color === color.value ? 'border-white scale-110' : 'border-zinc-700',
                      ]"
                      @click="updateColor(color.value)"
                    />
                  </div>
                </div>

                <!-- Overlay speed row -->
                <div class="mb-5">
                  <p class="text-zinc-500 text-xs font-semibold uppercase tracking-widest mb-3">Speed</p>
                  <div class="flex gap-2">
                    <button
                      v-for="spd in SPEEDS"
                      :key="spd.value"
                      :class="[
                        'flex-1 py-2 rounded-xl text-sm font-bold transition-all active:scale-95',
                        settings.speed === spd.value ? 'bg-white text-black' : 'bg-zinc-800 text-zinc-300',
                      ]"
                      @click="updateSpeed(spd.value)"
                    >
                      {{ spd.label }}
                    </button>
                  </div>
                </div>

                <!-- Overlay action buttons -->
                <div class="grid grid-cols-2 gap-3 mt-6">
                  <button
                    class="bg-zinc-800 hover:bg-zinc-700 active:scale-95 text-white font-bold py-3 rounded-2xl transition-all text-sm"
                    @click="onEditMessage"
                  >
                    ✏️ Edit message
                  </button>
                  <button
                    class="bg-zinc-800 hover:bg-zinc-700 active:scale-95 text-white font-bold py-3 rounded-2xl transition-all text-sm"
                    @click="exitDisplayMode"
                  >
                    ✕ Exit
                  </button>
                </div>
              </div>
            </div>
          </Transition>
        </div>
      </Transition>

    </div>
  </div>
</template>

<script setup lang="ts">
import type { TextColor, ScrollSpeed, TextSize } from '~/composables/useSettings'

const { settings, updateMessage, updateColor, updateSpeed, updateSize } = useSettings()
const { isDisplayMode, showOverlay, enterDisplayMode, exitDisplayMode, toggleOverlay, trackEvent } = useDisplay()

const config = useRuntimeConfig()
const inputRef = ref<HTMLInputElement>()

const localMessage = ref(settings.value.message)
const showInstallHint = ref(true)
const showTapHint = ref(false)
const displayMessage = ref('')

let touchStartY = 0
let tapHintTimer: ReturnType<typeof setTimeout> | null = null

// ─── Constants ────────────────────────────────────────────────────────────────

const PRESETS = [
  'PLAY THIS',
  'CAN YOU PLAY TECHNO',
  "IT'S MY BDAY",
  "YOU'RE AMAZING",
  'WATER PLEASE',
  "LET'S DANCE",
]

const COLORS: Array<{ value: TextColor; label: string; hex: string }> = [
  { value: 'white', label: 'White', hex: '#FFFFFF' },
  { value: 'neon-pink', label: 'Neon Pink', hex: '#FF2D78' },
  { value: 'neon-green', label: 'Neon Green', hex: '#39FF14' },
  { value: 'yellow', label: 'Yellow', hex: '#FFE500' },
  { value: 'electric-blue', label: 'Electric Blue', hex: '#00CFFF' },
]

const SPEEDS: Array<{ value: ScrollSpeed; label: string }> = [
  { value: 'slow', label: 'Slow' },
  { value: 'medium', label: 'Medium' },
  { value: 'fast', label: 'Fast' },
]

const SIZES: Array<{ value: TextSize; label: string }> = [
  { value: 'L', label: 'L' },
  { value: 'XL', label: 'XL' },
  { value: 'XXL', label: 'XXL' },
]

// ─── Computed ─────────────────────────────────────────────────────────────────

const textSizeClass = computed(() => {
  switch (settings.value.size) {
    case 'L': return 'text-6xl'
    case 'XL': return 'text-8xl'
    case 'XXL': return 'text-[10rem]'
    default: return 'text-8xl'
  }
})

const bannerHeightStyle = computed(() => {
  switch (settings.value.size) {
    case 'L': return { height: '100px' }
    case 'XL': return { height: '140px' }
    case 'XXL': return { height: '200px' }
    default: return { height: '140px' }
  }
})

const textColorClass = computed(() => {
  switch (settings.value.color) {
    case 'white': return 'text-white'
    case 'neon-pink': return 'text-[#FF2D78]'
    case 'neon-green': return 'text-[#39FF14]'
    case 'yellow': return 'text-[#FFE500]'
    case 'electric-blue': return 'text-[#00CFFF]'
    default: return 'text-white'
  }
})

const scrollDuration = computed(() => {
  switch (settings.value.speed) {
    case 'slow': return '24s'
    case 'medium': return '14s'
    case 'fast': return '7s'
    default: return '14s'
  }
})

const scrollAnimClass = computed(() => 'animate-marquee')

const scrollAnimStyle = computed(() => ({
  animationDuration: scrollDuration.value,
}))

// ─── Methods ──────────────────────────────────────────────────────────────────

function onInput() {
  updateMessage(localMessage.value)
}

function usePreset(preset: string) {
  localMessage.value = preset
  updateMessage(preset)
  trackEvent('preset_used')
}

async function onShowMessage() {
  if (!localMessage.value.trim()) return
  displayMessage.value = localMessage.value.trim()
  trackEvent('show_clicked')
  await enterDisplayMode()
  // Show tap hint briefly
  showTapHint.value = true
  tapHintTimer = setTimeout(() => {
    showTapHint.value = false
  }, 2500)
}

function onEditMessage() {
  exitDisplayMode()
  nextTick(() => {
    inputRef.value?.focus()
  })
}

function onTouchStart(e: TouchEvent) {
  touchStartY = e.touches[0]?.clientY ?? 0
}

function onTouchEnd(e: TouchEvent) {
  const endY = e.changedTouches[0]?.clientY ?? 0
  const diff = endY - touchStartY
  if (diff > 80) {
    // Swipe down → exit
    exitDisplayMode()
  }
}

// ─── Lifecycle ────────────────────────────────────────────────────────────────

onMounted(() => {
  // Load persisted message
  localMessage.value = settings.value.message
  // Autofocus
  nextTick(() => {
    inputRef.value?.focus()
  })
  // Listen for fullscreen exit (e.g. hardware back button)
  document.addEventListener('fullscreenchange', () => {
    if (!document.fullscreenElement && isDisplayMode.value) {
      isDisplayMode.value = false
      showOverlay.value = false
    }
  })

  // Inject Umami analytics
  const umamiSrc = config.public.umamiSrc
  const umamiId = config.public.umamiWebsiteId
  if (umamiSrc && umamiId) {
    const script = document.createElement('script')
    script.defer = true
    script.src = umamiSrc
    script.setAttribute('data-website-id', umamiId)
    document.head.appendChild(script)
  }
})

onUnmounted(() => {
  if (tapHintTimer) clearTimeout(tapHintTimer)
})
</script>

<style>
@keyframes marquee {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}

.animate-marquee {
  animation: marquee linear infinite;
}

/* Scrollbar hidden */
.scrollbar-none::-webkit-scrollbar {
  display: none;
}
.scrollbar-none {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

/* Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-quick-enter-active,
.fade-quick-leave-active {
  transition: opacity 0.5s ease;
}
.fade-quick-enter-from,
.fade-quick-leave-to {
  opacity: 0;
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease;
}
.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(100%);
  opacity: 0;
}

html, body {
  overflow: hidden;
}
</style>
