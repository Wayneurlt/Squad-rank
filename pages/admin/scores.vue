<template>
  <div>
    <!-- Header -->
    <div class="mb-8" data-aos="fade-up">
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
            Rate Your Squad Members
          </h1>
          <p class="text-slate-600 dark:text-slate-400">
            Click the stars to give each person a score from 1-5 in each category
          </p>
        </div>
        <div class="flex items-center space-x-4">
          <UButton
            @click="refreshData"
            variant="outline"
            size="sm"
          >
            <Icon name="heroicons:arrow-path" class="w-4 h-4 mr-2" />
            Refresh
          </UButton>
        </div>
      </div>
    </div>

    <!-- Instructions -->
    <div class="mb-8">
      <div class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl p-6">
        <div class="flex items-start space-x-3">
          <Icon name="heroicons:information-circle" class="w-6 h-6 text-blue-500 mt-0.5" />
          <div>
            <h3 class="text-lg font-medium text-blue-900 dark:text-blue-100 mb-2">
              How to Rank Your Squad
            </h3>
            <div class="text-blue-800 dark:text-blue-200 space-y-2">
              <p>• Click on the stars to rate each squad member from 1-5 for each category</p>
              <p>• Scores are saved automatically when you click a star</p>
              <p>• Higher scores mean better performance in that category</p>
              <p>• Category weights affect the overall ranking (shown in the preview below)</p>
              <p>• Use the refresh button to reload data if needed</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="pending" class="space-y-4">
      <LoadingSkeleton type="list" :count="6" />
    </div>

    <!-- Scores Matrix -->
    <div v-else-if="profiles && profiles.length > 0" class="glass-card rounded-2xl p-6 overflow-x-auto">
      <div class="min-w-full">
        <!-- Header Row -->
        <div class="grid gap-4 mb-4" :style="{ gridTemplateColumns: `200px repeat(${categories.length}, 1fr)` }">
          <div class="font-semibold text-slate-900 dark:text-slate-100">
            Squad Member
          </div>
          <div 
            v-for="category in categories" 
            :key="category.id"
            class="text-center"
          >
            <div class="flex items-center justify-center space-x-2 mb-2">
              <Icon :name="getCategoryIcon(category.slug)" class="w-5 h-5" />
              <span class="font-semibold text-slate-900 dark:text-slate-100">
                {{ category.name }}
              </span>
            </div>
            <div class="text-xs text-slate-500 dark:text-slate-400">
              Weight: {{ category.weight }}x
            </div>
          </div>
        </div>

        <!-- Profile Rows -->
        <div 
          v-for="profile in profiles" 
          :key="profile.id"
          class="grid gap-4 py-4 border-b border-slate-200 dark:border-slate-700 last:border-b-0"
          :style="{ gridTemplateColumns: `200px repeat(${categories.length}, 1fr)` }"
          data-aos="fade-up"
        >
          <!-- Profile Info -->
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold">
              <img 
                v-if="profile.photoUrl" 
                :src="profile.photoUrl" 
                :alt="profile.name"
                class="w-full h-full rounded-full object-cover"
              />
              <span v-else>{{ profile.name.charAt(0) }}</span>
            </div>
            <div>
              <div class="font-medium text-slate-900 dark:text-slate-100">
                {{ profile.name }}
              </div>
              <div v-if="profile.nickname" class="text-sm text-slate-500 dark:text-slate-400">
                {{ profile.nickname }}
              </div>
            </div>
          </div>

          <!-- Score Stars -->
          <div 
            v-for="category in categories" 
            :key="`${profile.id}-${category.id}`"
            class="flex justify-center items-center"
          >
            <div class="relative">
              <ScoreStars
                :value="getScore(profile.id, category.id)"
                :readonly="savingScores[`${profile.id}-${category.id}`]"
                @update="(value) => updateScore(profile.id, category.id, value)"
              />
              <!-- Loading indicator -->
              <div 
                v-if="savingScores[`${profile.id}-${category.id}`]"
                class="absolute inset-0 flex items-center justify-center bg-white/80 dark:bg-slate-800/80 rounded"
              >
                <Icon name="heroicons:arrow-path" class="w-4 h-4 animate-spin text-indigo-500" />
              </div>
              <!-- Success indicator -->
              <div 
                v-if="lastUpdated[`${profile.id}-${category.id}`] && !savingScores[`${profile.id}-${category.id}`]"
                class="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Current Rankings Preview -->
    <div class="mt-8">
      <h2 class="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-6">
        Current Rankings Preview
      </h2>
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Overall Ranking -->
        <div class="glass-card rounded-2xl p-6">
          <h3 class="text-lg font-medium text-slate-900 dark:text-slate-100 mb-4 flex items-center">
            <Icon name="heroicons:trophy" class="w-5 h-5 mr-2 text-yellow-500" />
            Overall Ranking
          </h3>
          <div class="space-y-3">
            <div 
              v-for="(row, index) in leaderboardData?.overall?.slice(0, 5) || []" 
              :key="row.profile.id"
              class="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700 rounded-lg"
            >
              <div class="flex items-center space-x-3">
                <div class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                     :class="{
                       'bg-yellow-500 text-white': index === 0,
                       'bg-gray-400 text-white': index === 1,
                       'bg-amber-600 text-white': index === 2,
                       'bg-slate-400 text-white': index > 2
                     }">
                  {{ index + 1 }}
                </div>
                <div class="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                  <img 
                    v-if="row.profile.photoUrl" 
                    :src="row.profile.photoUrl" 
                    :alt="row.profile.name"
                    class="w-full h-full rounded-full object-cover"
                  />
                  <span v-else>{{ row.profile.name.charAt(0) }}</span>
                </div>
                <div>
                  <div class="font-medium text-slate-900 dark:text-slate-100">
                    {{ row.profile.name }}
                  </div>
                  <div v-if="row.profile.nickname" class="text-sm text-slate-500 dark:text-slate-400">
                    {{ row.profile.nickname }}
                  </div>
                </div>
              </div>
              <div class="text-right">
                <div class="font-bold text-slate-900 dark:text-slate-100">
                  {{ row.overallScore.toFixed(1) }}
                </div>
                <div class="text-xs text-slate-500 dark:text-slate-400">
                  points
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Category Rankings -->
        <div class="glass-card rounded-2xl p-6">
          <h3 class="text-lg font-medium text-slate-900 dark:text-slate-100 mb-4 flex items-center">
            <Icon name="heroicons:chart-bar" class="w-5 h-5 mr-2 text-indigo-500" />
            Top Categories
          </h3>
          <div class="space-y-3">
            <div 
              v-for="categoryData in leaderboardData?.categories?.slice(0, 3) || []" 
              :key="categoryData.category.id"
              class="p-3 bg-slate-50 dark:bg-slate-700 rounded-lg"
            >
              <div class="flex items-center space-x-2 mb-2">
                <Icon :name="getCategoryIcon(categoryData.category.slug)" class="w-4 h-4" />
                <span class="font-medium text-slate-900 dark:text-slate-100">
                  {{ categoryData.category.name }}
                </span>
              </div>
              <div class="text-sm text-slate-600 dark:text-slate-400">
                Leader: <span class="font-medium">{{ categoryData.top[0]?.profile.name || 'N/A' }}</span>
                ({{ categoryData.top[0]?.byCategory[categoryData.category.id] || 0 }}/5)
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Summary Stats -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
      <div class="glass-card rounded-2xl p-6" data-aos="fade-up" data-aos-delay="100">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-slate-600 dark:text-slate-400 mb-1">
              Total Scores
            </p>
            <p class="text-2xl font-bold text-slate-900 dark:text-slate-100">
              {{ totalScores }}
            </p>
          </div>
          <div class="w-12 h-12 rounded-2xl bg-blue-500 flex items-center justify-center">
            <Icon name="heroicons:star" class="w-6 h-6 text-white" />
          </div>
        </div>
      </div>

      <div class="glass-card rounded-2xl p-6" data-aos="fade-up" data-aos-delay="200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-slate-600 dark:text-slate-400 mb-1">
              Average Score
            </p>
            <p class="text-2xl font-bold text-slate-900 dark:text-slate-100">
              {{ averageScore }}
            </p>
          </div>
          <div class="w-12 h-12 rounded-2xl bg-green-500 flex items-center justify-center">
            <Icon name="heroicons:chart-bar" class="w-6 h-6 text-white" />
          </div>
        </div>
      </div>

      <div class="glass-card rounded-2xl p-6" data-aos="fade-up" data-aos-delay="300">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-slate-600 dark:text-slate-400 mb-1">
              Active Categories
            </p>
            <p class="text-2xl font-bold text-slate-900 dark:text-slate-100">
              {{ activeCategories }}
            </p>
          </div>
          <div class="w-12 h-12 rounded-2xl bg-amber-500 flex items-center justify-center">
            <Icon name="heroicons:tag" class="w-6 h-6 text-white" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Use the admin layout
definePageMeta({
  layout: 'admin'
})

import type { Profile, Category, UpdateScoreData } from '~/types'

const { isAuthenticated, checkSession, makeAuthenticatedRequest } = useAdminAuth()
const { initAOS } = useAnimations()
const toast = useNotivue()

// Check authentication on mount
onMounted(async () => {
  await checkSession()
  if (!isAuthenticated.value) {
    navigateTo('/admin/login')
  }
  initAOS()
})

const { data: profiles, pending: profilesPending } = useFetch<Profile[]>('/api/profiles', {
  server: false,
  default: () => []
})

const { data: categories, pending: categoriesPending } = useFetch<Category[]>('/api/categories', {
  server: false,
  default: () => []
})

const { data: leaderboardData, pending: leaderboardPending } = useFetch('/api/leaderboard', {
  server: false,
  default: () => ({ overall: [], categories: [] })
})

const pending = computed(() => profilesPending.value || categoriesPending.value || leaderboardPending.value)

const scores = ref<Record<string, Record<string, number>>>({})
const savingScores = ref<Record<string, boolean>>({})
const lastUpdated = ref<Record<string, Date>>({})

const getCategoryIcon = (slug: string) => {
  const iconMap: Record<string, string> = {
    'humor': 'heroicons:face-smile',
    'reliability': 'heroicons:shield-check',
    'party-energy': 'heroicons:bolt',
    'style': 'heroicons:sparkles',
    'meme-lord': 'heroicons:computer-desktop',
    'timekeeper': 'heroicons:clock',
    'creative-spark': 'heroicons:light-bulb',
    'travel-buddy': 'heroicons:map'
  }
  return iconMap[slug] || 'heroicons:star'
}

const getScore = (profileId: string, categoryId: string) => {
  return scores.value[profileId]?.[categoryId] || 1
}

const updateScore = async (profileId: string, categoryId: string, value: number) => {
  if (!scores.value[profileId]) {
    scores.value[profileId] = {}
  }
  
  const oldValue = scores.value[profileId][categoryId] || 1
  scores.value[profileId][categoryId] = value
  
  // Save immediately
  const scoreKey = `${profileId}-${categoryId}`
  savingScores.value[scoreKey] = true
  
  try {
    await makeAuthenticatedRequest('/api/admin/score', {
      method: 'POST',
      body: {
        profileId,
        categoryId,
        value
      }
    })
    
    lastUpdated.value[scoreKey] = new Date()
    toast.success(`Score updated to ${value}/5`)
  } catch (error: any) {
    // Revert the change on error
    scores.value[profileId][categoryId] = oldValue
    toast.error(error.data?.message || 'Failed to save score')
  } finally {
    savingScores.value[scoreKey] = false
  }
}

const refreshData = async () => {
  try {
    await Promise.all([
      profiles.value ? $fetch('/api/profiles') : Promise.resolve(),
      categories.value ? $fetch('/api/categories') : Promise.resolve(),
      leaderboardData.value ? $fetch('/api/leaderboard') : Promise.resolve()
    ])
    toast.success('Data refreshed successfully!')
  } catch (error: any) {
    toast.error('Failed to refresh data')
  }
}

const totalScores = computed(() => {
  return profiles.value.length * categories.value.length
})

const averageScore = computed(() => {
  if (!profiles.value.length || !categories.value.length) return '0.0'
  
  let total = 0
  let count = 0
  
  for (const profile of profiles.value) {
    for (const category of categories.value) {
      total += getScore(profile.id, category.id)
      count++
    }
  }
  
  return (total / count).toFixed(1)
})

const activeCategories = computed(() => {
  return categories.value.filter(cat => cat.active).length
})

// Initialize scores from leaderboard data
watch([profiles, categories, leaderboardData], () => {
  if (profiles.value.length && categories.value.length && leaderboardData.value) {
    const newScores: Record<string, Record<string, number>> = {}
    
    for (const row of leaderboardData.value.overall) {
      newScores[row.profile.id] = { ...row.byCategory }
    }
    
    scores.value = newScores
  }
}, { immediate: true })

onMounted(() => {
  initAOS()
})

// SEO
useHead({
  title: 'Manage Scores - SquadRank Admin',
  meta: [
    { name: 'description', content: 'Manage squad member scores in SquadRank.' }
  ]
})
</script>
