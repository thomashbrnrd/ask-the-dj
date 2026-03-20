export type TextColor = 'white' | 'neon-pink' | 'neon-green' | 'yellow' | 'electric-blue'
export type ScrollSpeed = 'slow' | 'medium' | 'fast'
export type TextSize = 'L' | 'XL' | 'XXL'

export interface DJSettings {
  message: string
  color: TextColor
  speed: ScrollSpeed
  size: TextSize
}

const STORAGE_KEY = 'askthedj-settings'

const defaultSettings: DJSettings = {
  message: '',
  color: 'white',
  speed: 'medium',
  size: 'XL',
}

function loadFromStorage(): DJSettings {
  if (import.meta.server) return { ...defaultSettings }
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      return { ...defaultSettings, ...JSON.parse(raw) }
    }
  }
  catch {}
  return { ...defaultSettings }
}

export function useSettings() {
  const settings = useState<DJSettings>('dj-settings', () => loadFromStorage())

  function updateMessage(msg: string) {
    settings.value.message = msg.slice(0, 40)
    save()
  }

  function updateColor(color: TextColor) {
    settings.value.color = color
    save()
  }

  function updateSpeed(speed: ScrollSpeed) {
    settings.value.speed = speed
    save()
  }

  function updateSize(size: TextSize) {
    settings.value.size = size
    save()
  }

  function save() {
    if (import.meta.server) return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings.value))
    }
    catch {}
  }

  return {
    settings,
    updateMessage,
    updateColor,
    updateSpeed,
    updateSize,
  }
}
