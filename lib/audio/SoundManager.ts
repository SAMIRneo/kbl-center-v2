// Audio Manager with Howler.js
import { Howl, Howler } from 'howler'

export interface SoundConfig {
  src: string[]
  volume?: number
  loop?: boolean
  sprite?: { [key: string]: [number, number] }
}

export class SoundManager {
  private sounds: Map<string, Howl> = new Map()
  private ambient: Howl | null = null
  private masterVolume: number = 0.7
  private isMuted: boolean = false

  constructor() {
    if (typeof window !== 'undefined') {
      Howler.volume(this.masterVolume)
    }
  }

  loadSound(name: string, config: SoundConfig): void {
    const sound = new Howl({
      src: config.src,
      volume: config.volume ?? 1.0,
      loop: config.loop ?? false,
      sprite: config.sprite,
      html5: true,
    })

    this.sounds.set(name, sound)
  }

  play(name: string, spriteKey?: string): number | undefined {
    const sound = this.sounds.get(name)
    if (!sound) {
      console.warn(`Sound "${name}" not found`)
      return
    }

    return spriteKey ? sound.play(spriteKey) : sound.play()
  }

  stop(name: string): void {
    const sound = this.sounds.get(name)
    sound?.stop()
  }

  pause(name: string): void {
    const sound = this.sounds.get(name)
    sound?.pause()
  }

  setVolume(name: string, volume: number): void {
    const sound = this.sounds.get(name)
    sound?.volume(volume)
  }

  setMasterVolume(volume: number): void {
    this.masterVolume = Math.max(0, Math.min(1, volume))
    Howler.volume(this.isMuted ? 0 : this.masterVolume)
  }

  toggleMute(): void {
    this.isMuted = !this.isMuted
    Howler.volume(this.isMuted ? 0 : this.masterVolume)
  }

  playAmbient(src: string[], volume: number = 0.3): void {
    this.stopAmbient()

    this.ambient = new Howl({
      src,
      volume,
      loop: true,
      html5: true,
    })

    this.ambient.play()
  }

  stopAmbient(): void {
    if (this.ambient) {
      this.ambient.stop()
      this.ambient.unload()
      this.ambient = null
    }
  }

  fadeIn(name: string, duration: number = 1000): void {
    const sound = this.sounds.get(name)
    if (!sound) return

    sound.volume(0)
    const id = sound.play()
    if (id !== undefined) {
      sound.fade(0, 1, duration, id)
    }
  }

  fadeOut(name: string, duration: number = 1000): void {
    const sound = this.sounds.get(name)
    if (!sound) return

    sound.fade(sound.volume(), 0, duration)
    setTimeout(() => sound.stop(), duration)
  }

  preloadSounds(): void {
    // Ambient space sounds
    this.loadSound('ambient', {
      src: ['/sounds/ambient-space.mp3'],
      volume: 0.3,
      loop: true,
    })

    // UI sounds
    this.loadSound('ui', {
      src: ['/sounds/ui-sounds.mp3'],
      sprite: {
        hover: [0, 200],
        click: [300, 400],
        whoosh: [800, 600],
        energy: [1500, 800],
      },
    })

    // Node interaction sounds
    this.loadSound('crystal', {
      src: ['/sounds/crystal-chime.mp3'],
      volume: 0.6,
    })

    this.loadSound('portal', {
      src: ['/sounds/portal-open.mp3'],
      volume: 0.5,
    })
  }

  unloadAll(): void {
    this.sounds.forEach((sound) => sound.unload())
    this.sounds.clear()
    this.stopAmbient()
  }
}

// Singleton instance
let soundManagerInstance: SoundManager | null = null

export const getSoundManager = (): SoundManager => {
  if (!soundManagerInstance) {
    soundManagerInstance = new SoundManager()
  }
  return soundManagerInstance
}
