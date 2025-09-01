import type { LeaderboardResponse, Profile, Category } from '~/types'

export const useLeaderboard = () => {
  const { data: leaderboardData, pending, error, refresh } = useFetch<LeaderboardResponse>('/api/leaderboard', {
    server: false,
    default: () => ({
      overall: [],
      categories: []
    })
  })

  const { data: profilesData } = useFetch<Profile[]>('/api/profiles', {
    server: false,
    default: () => []
  })

  const { data: categoriesData } = useFetch<Category[]>('/api/categories', {
    server: false,
    default: () => []
  })

  const selectedCategory = ref<string | null>(null)
  const searchQuery = ref('')

  const filteredLeaderboard = computed(() => {
    if (!leaderboardData.value) return { overall: [], categories: [] }

    let data = leaderboardData.value

    // Filter by category if selected
    if (selectedCategory.value) {
      const categoryData = data.categories.find(c => c.category.slug === selectedCategory.value)
      if (categoryData) {
        return {
          overall: categoryData.top,
          categories: data.categories
        }
      }
    }

    // Filter by search query
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase()
      const filtered = data.overall.filter(row => 
        row.profile.name.toLowerCase().includes(query) ||
        row.profile.nickname?.toLowerCase().includes(query) ||
        row.profile.bio?.toLowerCase().includes(query)
      )
      return {
        overall: filtered,
        categories: data.categories
      }
    }

    return data
  })

  const topThree = computed(() => {
    return filteredLeaderboard.value.overall.slice(0, 3)
  })

  const remaining = computed(() => {
    return filteredLeaderboard.value.overall.slice(3)
  })

  const selectCategory = (categorySlug: string | null) => {
    selectedCategory.value = categorySlug
  }

  const clearFilters = () => {
    selectedCategory.value = null
    searchQuery.value = ''
  }

  return {
    leaderboardData: readonly(leaderboardData),
    profilesData: readonly(profilesData),
    categoriesData: readonly(categoriesData),
    filteredLeaderboard,
    topThree,
    remaining,
    selectedCategory: readonly(selectedCategory),
    searchQuery,
    pending,
    error,
    refresh,
    selectCategory,
    clearFilters
  }
}
