<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
    <!-- Header -->
    <div class="bg-white dark:bg-slate-800 shadow-sm border-b border-slate-200 dark:border-slate-700">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-6">
          <div>
            <h1 class="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center">
              <Icon :name="getCategoryIcon(category?.slug || '')" class="w-8 h-8 mr-3" />
              Rank: {{ category?.name || 'Loading...' }}
            </h1>
            <p class="text-slate-600 dark:text-slate-400">
              {{ category?.description || 'Rank your squad members for this category' }}
            </p>
          </div>
          <div class="flex items-center space-x-4">
            <UButton 
              @click="saveRankings" 
              :loading="isSaving"
              class="gradient-bg"
              size="lg"
            >
              <Icon name="heroicons:check" class="w-5 h-5 mr-2" />
              Save Rankings
            </UButton>
            <UButton 
              @click="refreshAllData"
              variant="outline" 
              size="sm"
            >
              <Icon name="heroicons:arrow-path" class="w-4 h-4 mr-2" />
              Refresh
            </UButton>
            <UButton 
              to="/admin/categories" 
              variant="outline" 
              size="sm"
            >
              Back to Categories
            </UButton>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Instructions -->
      <div class="mb-8">
        <div class="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border border-indigo-200 dark:border-indigo-800 rounded-2xl p-6">
          <div class="flex items-start space-x-3">
            <Icon name="heroicons:light-bulb" class="w-6 h-6 text-indigo-500 mt-0.5" />
            <div>
              <h3 class="text-lg font-medium text-indigo-900 dark:text-indigo-100 mb-2">
                How to Rank Your Squad
              </h3>
                             <div class="text-indigo-800 dark:text-indigo-200 space-y-2">
                 <p>• <strong>Drag & Drop:</strong> Click and drag squad members to reorder them</p>
                 <p>• <strong>Click to Move:</strong> Use the up/down arrow buttons to move members</p>
                 <p>• The person at the top is ranked #1 (best) for this category</p>
                 <p>• Rankings are automatically converted to scores (1-5 stars)</p>
                 <p>• Click "Save Rankings" when you're done to update the leaderboard</p>
               </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="pending" class="space-y-4">
        <LoadingSkeleton type="list" :count="6" />
      </div>



      <!-- Ranking Interface -->
      <div v-else-if="category && profiles.length > 0" class="space-y-6">
        <!-- Current Rankings -->
        <div class="glass-card rounded-2xl p-6">
                     <h2 class="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-6 flex items-center">
             <Icon name="heroicons:bars-3" class="w-6 h-6 mr-2 text-indigo-500" />
             Drag to Reorder Rankings
             <span class="ml-4 text-sm font-normal text-slate-500 dark:text-slate-400">
               (or use the ↑↓ buttons)
             </span>
           </h2>
          
                     <div class="space-y-3">
             <div 
               v-for="(profile, index) in rankedProfiles" 
               :key="profile.id"
               class="flex items-center p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 hover:shadow-md transition-all duration-200"
               :class="{ 
                 'ring-2 ring-indigo-500': draggedIndex === index,
                 'opacity-50': draggedIndex !== null && draggedIndex !== index,
                 'border-indigo-300 bg-indigo-50 dark:bg-indigo-900/20': draggedIndex !== null && draggedIndex !== index
               }"
               draggable="true"
               @dragstart="startDrag(index, $event)"
               @dragover.prevent="handleDragOver($event)"
               @drop="dropOn(index, $event)"
               @dragend="endDrag"
             >
              <!-- Rank Number -->
              <div class="w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold mr-4"
                   :class="{
                     'bg-yellow-500 text-white': index === 0,
                     'bg-gray-400 text-white': index === 1,
                     'bg-amber-600 text-white': index === 2,
                     'bg-slate-400 text-white': index > 2
                   }">
                {{ index + 1 }}
              </div>

              <!-- Profile Info -->
              <div class="flex items-center space-x-4 flex-1">
                <div class="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl">
                  <img 
                    v-if="profile.photoUrl" 
                    :src="profile.photoUrl" 
                    :alt="profile.name"
                    class="w-full h-full rounded-full object-cover"
                  />
                  <span v-else>{{ profile.name.charAt(0) }}</span>
                </div>
                <div class="flex-1">
                  <h3 class="text-lg font-semibold text-slate-900 dark:text-slate-100">
                    {{ profile.name }}
                  </h3>
                  <p v-if="profile.nickname" class="text-slate-600 dark:text-slate-400">
                    {{ profile.nickname }}
                  </p>
                  <p v-if="profile.bio" class="text-sm text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">
                    {{ profile.bio }}
                  </p>
                </div>
              </div>

              <!-- Current Score -->
              <div class="flex items-center space-x-3">
                <div class="text-right">
                  <div class="text-sm text-slate-500 dark:text-slate-400">Current Score</div>
                  <div class="text-lg font-bold text-slate-900 dark:text-slate-100">
                    {{ getCurrentScore(profile.id) }}/5
                  </div>
                </div>
                <ScoreStars
                  :value="getCurrentScore(profile.id)"
                  :readonly="true"
                  :show-value="false"
                />
              </div>

                             <!-- Move Controls -->
               <div class="flex items-center space-x-2 ml-4">
                 <UButton 
                   @click="moveUp(index)"
                   :disabled="index === 0"
                   variant="outline"
                   size="xs"
                   class="p-1"
                 >
                   <Icon name="heroicons:chevron-up" class="w-4 h-4" />
                 </UButton>
                 <UButton 
                   @click="moveDown(index)"
                   :disabled="index === rankedProfiles.length - 1"
                   variant="outline"
                   size="xs"
                   class="p-1"
                 >
                   <Icon name="heroicons:chevron-down" class="w-4 h-4" />
                 </UButton>
                 <div class="text-slate-400 dark:text-slate-500 ml-2">
                   <Icon name="heroicons:bars-3" class="w-5 h-5" />
                 </div>
               </div>
            </div>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="glass-card rounded-2xl p-6">
            <h3 class="text-lg font-medium text-slate-900 dark:text-slate-100 mb-4 flex items-center">
              <Icon name="heroicons:shuffle" class="w-5 h-5 mr-2 text-blue-500" />
              Quick Actions
            </h3>
                         <div class="space-y-3">
               <UButton 
                 @click="seedData" 
                 variant="outline" 
                 size="sm"
                 class="w-full"
                 color="blue"
                 :loading="isSeeding"
               >
                 <Icon name="heroicons:arrow-path" class="w-4 h-4 mr-2" />
                 Seed Demo Data
               </UButton>
               <UButton 
                 @click="testRanking" 
                 variant="outline" 
                 size="sm"
                 class="w-full"
                 color="green"
               >
                 <Icon name="heroicons:play" class="w-4 h-4 mr-2" />
                 Test Ranking (Demo)
               </UButton>
               <UButton 
                 @click="shuffleRankings" 
                 variant="outline" 
                 size="sm"
                 class="w-full"
               >
                 <Icon name="heroicons:arrow-path" class="w-4 h-4 mr-2" />
                 Shuffle Randomly
               </UButton>
               <UButton 
                 @click="resetToCurrent" 
                 variant="outline" 
                 size="sm"
                 class="w-full"
               >
                 <Icon name="heroicons:arrow-uturn-left" class="w-4 h-4 mr-2" />
                 Reset to Current
               </UButton>
             </div>
          </div>

          <div class="glass-card rounded-2xl p-6">
            <h3 class="text-lg font-medium text-slate-900 dark:text-slate-100 mb-4 flex items-center">
              <Icon name="heroicons:chart-bar" class="w-5 h-5 mr-2 text-green-500" />
              Ranking Preview
            </h3>
            <div class="space-y-2">
              <div class="flex justify-between text-sm">
                <span class="text-slate-600 dark:text-slate-400">Total Members:</span>
                <span class="font-medium">{{ profiles.length }}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-slate-600 dark:text-slate-400">Category Weight:</span>
                <span class="font-medium">{{ category.weight }}x</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-slate-600 dark:text-slate-400">Changes Made:</span>
                <span class="font-medium text-amber-600">{{ hasChanges ? 'Yes' : 'No' }}</span>
              </div>
            </div>
          </div>

          <div class="glass-card rounded-2xl p-6">
            <h3 class="text-lg font-medium text-slate-900 dark:text-slate-100 mb-4 flex items-center">
              <Icon name="heroicons:information-circle" class="w-5 h-5 mr-2 text-purple-500" />
              Score Mapping
            </h3>
            <div class="space-y-2 text-sm">
              <div class="flex justify-between">
                <span class="text-slate-600 dark:text-slate-400">1st Place:</span>
                <span class="font-medium">5 stars</span>
              </div>
              <div class="flex justify-between">
                <span class="text-slate-600 dark:text-slate-400">2nd Place:</span>
                <span class="font-medium">4 stars</span>
              </div>
              <div class="flex justify-between">
                <span class="text-slate-600 dark:text-slate-400">3rd Place:</span>
                <span class="font-medium">3 stars</span>
              </div>
              <div class="flex justify-between">
                <span class="text-slate-600 dark:text-slate-400">4th+ Place:</span>
                <span class="font-medium">2-1 stars</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else-if="!pending" class="py-12">
        <div class="text-center">
          <div class="w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
            <Icon name="heroicons:users" class="w-12 h-12 text-slate-400" />
          </div>
          <h3 class="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
            No Squad Members Found
          </h3>
          <p class="text-slate-600 dark:text-slate-400 mb-8 max-w-md mx-auto">
            You need to add squad members before you can rank them. Use the buttons below to get started quickly.
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <UButton 
              @click="seedData"
              :loading="isSeeding"
              class="gradient-bg"
              size="lg"
            >
              <Icon name="heroicons:arrow-path" class="w-5 h-5 mr-2" />
              Seed Demo Data (6 Members)
            </UButton>
            <UButton 
              to="/admin/profiles"
              variant="outline"
              size="lg"
            >
              <Icon name="heroicons:user-plus" class="w-5 h-5 mr-2" />
              Add Profiles Manually
            </UButton>
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

import type { Profile, Category } from '~/types'

const route = useRoute()
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

const slug = route.params.slug as string

// Fetch category by slug
const { data: category, pending: categoryPending } = useFetch<Category>(`/api/categories`, {
  server: false,
  default: () => null,
  transform: (categories: Category[]) => {
    return categories.find(cat => cat.slug === slug) || null
  }
})

// Fetch profiles
const { data: profiles, pending: profilesPending, refresh: refreshProfiles } = useFetch<Profile[]>('/api/profiles', {
  server: false,
  default: () => []
})

// Fetch current scores
const { data: leaderboardData, pending: leaderboardPending } = useFetch('/api/leaderboard', {
  server: false,
  default: () => ({ overall: [], categories: [] })
})

const pending = computed(() => categoryPending.value || profilesPending.value || leaderboardPending.value)

// Ranking state
const rankedProfiles = ref<Profile[]>([])
const originalRankings = ref<Profile[]>([])
const draggedIndex = ref<number | null>(null)
const isSaving = ref(false)
const isSeeding = ref(false)

// Get category icon
const getCategoryIcon = (slug: string) => {
  const iconMap: Record<string, string> = {
    'humor': 'heroicons:face-smile',
    'reliability': 'heroicons:shield-check',
    'party-energy': 'heroicons:bolt',
    'style': 'heroicons:sparkles',
    'meme-lord': 'heroicons:computer-desktop',
    'timekeeper': 'heroicons:clock',
    'creative-spark': 'heroicons:light-bulb',
    'travel-buddy': 'heroicons:map',
    'manipulator': 'heroicons:cog'
  }
  return iconMap[slug] || 'heroicons:star'
}

// Get current score for a profile in this category
const getCurrentScore = (profileId: string) => {
  if (!category.value || !leaderboardData.value) return 1
  
  const profileData = leaderboardData.value.overall.find(row => row.profile.id === profileId)
  return profileData?.byCategory[category.value.id] || 1
}

// Initialize rankings based on current scores
const initializeRankings = () => {
  if (!profiles.value.length || !category.value) return
  
  // Sort profiles by current score (highest first)
  const sortedProfiles = [...profiles.value].sort((a, b) => {
    const scoreA = getCurrentScore(a.id)
    const scoreB = getCurrentScore(b.id)
    return scoreB - scoreA
  })
  
  rankedProfiles.value = sortedProfiles
  originalRankings.value = [...sortedProfiles]
}

// Drag and drop functions
const startDrag = (index: number, event: DragEvent) => {
  draggedIndex.value = index
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = 'move'
    event.dataTransfer.setData('text/html', '')
  }
}

const handleDragOver = (event: DragEvent) => {
  event.preventDefault()
  if (event.dataTransfer) {
    event.dataTransfer.dropEffect = 'move'
  }
}

const dropOn = (targetIndex: number, event: DragEvent) => {
  event.preventDefault()
  if (draggedIndex.value === null || draggedIndex.value === targetIndex) return
  
  const draggedProfile = rankedProfiles.value[draggedIndex.value]
  const newRankings = [...rankedProfiles.value]
  
  // Remove dragged item
  newRankings.splice(draggedIndex.value, 1)
  // Insert at new position
  newRankings.splice(targetIndex, 0, draggedProfile)
  
  rankedProfiles.value = newRankings
}

const endDrag = () => {
  draggedIndex.value = null
}

// Click to move functions
const moveUp = (index: number) => {
  if (index === 0) return
  
  const newRankings = [...rankedProfiles.value]
  const profile = newRankings[index]
  newRankings[index] = newRankings[index - 1]
  newRankings[index - 1] = profile
  
  rankedProfiles.value = newRankings
}

const moveDown = (index: number) => {
  if (index === rankedProfiles.value.length - 1) return
  
  const newRankings = [...rankedProfiles.value]
  const profile = newRankings[index]
  newRankings[index] = newRankings[index + 1]
  newRankings[index + 1] = profile
  
  rankedProfiles.value = newRankings
}

// Quick actions
const shuffleRankings = () => {
  const shuffled = [...rankedProfiles.value]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  rankedProfiles.value = shuffled
}

const resetToCurrent = () => {
  rankedProfiles.value = [...originalRankings.value]
}

// Refresh all data
const refreshAllData = async () => {
  try {
    await refreshProfiles()
    
    // Reinitialize rankings
    setTimeout(() => {
      if (profiles.value.length && category.value) {
        initializeRankings()
      }
    }, 500)
    
    toast.success('Data refreshed successfully!')
  } catch (error: any) {
    toast.error('Failed to refresh data')
  }
}

// Seed demo data
const seedData = async () => {
  isSeeding.value = true
  try {
    await makeAuthenticatedRequest('/api/admin/seed', { method: 'POST' })
    toast.success('Demo data seeded successfully!')
    
    // Refresh profiles
    await refreshProfiles()
    
    // Reinitialize rankings
    setTimeout(() => {
      if (profiles.value.length && category.value) {
        initializeRankings()
      }
    }, 1000)
  } catch (error: any) {
    toast.error(error.data?.message || 'Failed to seed data')
  } finally {
    isSeeding.value = false
  }
}

// Test ranking function to demonstrate the system
const testRanking = () => {
  if (rankedProfiles.value.length < 2) {
    toast.info('Need at least 2 squad members to test ranking')
    return
  }
  
  // Move the first person to the end to demonstrate ranking
  const newRankings = [...rankedProfiles.value]
  const firstPerson = newRankings.shift()
  if (firstPerson) {
    newRankings.push(firstPerson)
    rankedProfiles.value = newRankings
    toast.success('Test ranking applied! First person moved to last place.')
  }
}

// Check if rankings have changed
const hasChanges = computed(() => {
  if (rankedProfiles.value.length !== originalRankings.value.length) return true
  
  return rankedProfiles.value.some((profile, index) => 
    profile.id !== originalRankings.value[index]?.id
  )
})

// Convert ranking to score (1-5)
const rankingToScore = (position: number, total: number) => {
  if (total <= 1) return 5
  if (total <= 2) return position === 0 ? 5 : 4
  if (total <= 3) return position === 0 ? 5 : position === 1 ? 4 : 3
  if (total <= 4) return position === 0 ? 5 : position === 1 ? 4 : position === 2 ? 3 : 2
  return position === 0 ? 5 : position === 1 ? 4 : position === 2 ? 3 : position === 3 ? 2 : 1
}

// Save rankings
const saveRankings = async () => {
  if (!category.value || !hasChanges.value) {
    toast.info('No changes to save')
    return
  }

  isSaving.value = true
  try {
    const updates = rankedProfiles.value.map((profile, index) => ({
      profileId: profile.id,
      categoryId: category.value!.id,
      value: rankingToScore(index, rankedProfiles.value.length)
    }))

    // Save all scores
    await Promise.all(
      updates.map(update => 
        makeAuthenticatedRequest('/api/admin/score', {
          method: 'POST',
          body: update
        })
      )
    )

    toast.success('Rankings saved successfully!')
    originalRankings.value = [...rankedProfiles.value]
  } catch (error: any) {
    toast.error(error.data?.message || 'Failed to save rankings')
  } finally {
    isSaving.value = false
  }
}

// Initialize when data is loaded
watch([profiles, category], () => {
  if (profiles.value.length && category.value) {
    initializeRankings()
  }
}, { immediate: true })

onMounted(() => {
  initAOS()
})

// SEO
useHead({
  title: `Rank ${category.value?.name || 'Category'} - SquadRank Admin`,
  meta: [
    { name: 'description', content: `Rank squad members for ${category.value?.name || 'this category'} in SquadRank.` }
  ]
})
</script>
