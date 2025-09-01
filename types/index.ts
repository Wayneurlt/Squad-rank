export interface Profile {
  id: string
  name: string
  nickname?: string
  photoUrl?: string
  bio?: string
  createdAt: Date
}

export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  weight: number
  active: boolean
  createdAt: Date
}

export interface Score {
  id: string
  profileId: string
  categoryId: string
  value: number
  createdAt: Date
}

export interface LeaderboardRow {
  profile: Profile
  overallScore: number
  byCategory: Record<string, number>
}

export interface TieredProfile {
  profile: Profile
  score: number
  categoryId: string
  tier: 'S' | 'A' | 'B' | 'C' | 'D' | null
}

export interface CategoryRanking {
  category: Category
  profiles: TieredProfile[]
  totalParticipants: number
  tiers: {
    S: TieredProfile[]
    A: TieredProfile[]
    B: TieredProfile[]
    C: TieredProfile[]
    D: TieredProfile[]
  }
}

export interface LeaderboardResponse {
  categories: CategoryRanking[]
  totalProfiles?: number
  totalCategories?: number
  currentCategory?: Category
}

export interface ApiResponse<T = any> {
  data?: T
  error?: string
  success: boolean
}

export interface AdminSession {
  isAuthenticated: boolean
  expiresAt?: Date
}

export interface CreateProfileData {
  name: string
  nickname?: string
  photoUrl?: string
  bio?: string
}

export interface CreateCategoryData {
  name: string
  slug: string
  description?: string
  weight?: number
}

export interface UpdateScoreData {
  profileId: string
  categoryId: string
  value: number
}
