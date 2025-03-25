export interface User {
  id: string
  name: string
  avatar: string
  email?: string
}

export interface Prayer {
  id: string
  user: User
  title?: string
  content: string
  category?: string
  timeAgo: string
  prayerCount: number
  messages?: Message[]
}

export interface Message {
  id: string
  user: User
  content: string
  timestamp: string
}

