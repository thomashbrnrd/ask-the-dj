export function useDisplay() {
  const isDisplayMode = useState('display-mode', () => false)
  const showOverlay = useState('show-overlay', () => false)

  async function enterDisplayMode() {
    isDisplayMode.value = true
    showOverlay.value = false

    if (import.meta.client) {
      try {
        if (navigator.vibrate) {
          navigator.vibrate(50)
        }
        const el = document.documentElement
        if (el.requestFullscreen) {
          await el.requestFullscreen()
          trackEvent('enter_fullscreen')
        }
      }
      catch {}
    }
  }

  async function exitDisplayMode() {
    isDisplayMode.value = false
    showOverlay.value = false

    if (import.meta.client) {
      try {
        if (document.fullscreenElement) {
          await document.exitFullscreen()
        }
        trackEvent('exit_fullscreen')
      }
      catch {}
    }
  }

  function toggleOverlay() {
    showOverlay.value = !showOverlay.value
  }

  function trackEvent(name: string) {
    if (import.meta.client && typeof window !== 'undefined' && (window as any).umami) {
      try {
        ;(window as any).umami.track(name)
      }
      catch {}
    }
  }

  return {
    isDisplayMode,
    showOverlay,
    enterDisplayMode,
    exitDisplayMode,
    toggleOverlay,
    trackEvent,
  }
}
