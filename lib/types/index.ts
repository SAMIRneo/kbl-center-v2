export interface SephirotNode {
  name: string
  subtitle: string
  position: [number, number, number]
  color: string
  accent: string
  route: string
}

export interface DeviceState {
  active: boolean
  loading: boolean
  error: string | null
}

export type DeviceType = "audiovisuel" | "communautes" | "ia" | "politique" | "terminal"
