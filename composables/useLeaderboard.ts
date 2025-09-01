import type { LeaderboardResponse, Profile, Category } from '~/types'

export const useLeaderboard = () => {
  const { data: leaderboardData, pending, error, refresh } = useFetch<LeaderboardResponse>('/api/leaderboard', {
    server: false,
    default: () => ({
      categories: [],
      totalProfiles: 0,
      totalCategories: 0
    })
  })

  // Safe computed values with fallbacks
  const safeLeaderboardData = computed(() => {
    if (!leaderboardData.value) {
      return {
        categories: [],
        totalProfiles: 0,
        totalCategories: 0
      }
    }
    return leaderboardData.value
  })

  const { data: profilesData } = useFetch<Profile[]>('/api/profiles', {
    server: false,
    default: () => []
  })

  const { data: categoriesData } = useFetch<Category[]>('/api/categories', {
    server: false,
    default: () => []
  })

  return {
    leaderboardData: readonly(safeLeaderboardData),
    profilesData: readonly(profilesData),
    categoriesData: readonly(categoriesData),
    pending,
    error,
    refresh
  }
}
