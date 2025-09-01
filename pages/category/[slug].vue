<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
    <!-- Header -->
    <div class="relative overflow-hidden">
      <div class="absolute inset-0 bg-gradient-to-r from-indigo-600/10 to-purple-600/10"></div>
      <div class="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div class="text-center" data-aos="fade-up">
          <NuxtLink 
            to="/leaderboard" 
            class="inline-flex items-center text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 mb-4 transition-colors"
          >
            <Icon name="heroicons:arrow-left" class="w-4 h-4 mr-2" />
            Back to Leaderboard
          </NuxtLink>
          <h1 class="text-4xl md:text-5xl font-bold text-slate-900 dark:text-slate-100 mb-4">
            <span class="gradient-text">{{ categoryData?.category.name || 'Category' }} Rankings</span>
          </h1>
          <p class="text-lg text-slate-600 dark:text-slate-400 mb-8">
            Simply select a tier for each profile
          </p>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="pending" class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <LoadingSkeleton type="card" :count="6" />
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <EmptyState
        icon="heroicons:exclamation-triangle"
        title="Failed to load category rankings"
        description="There was an error loading the data. Please try again."
        @action="refresh"
      />
    </div>

    <!-- Simple Profile List with Tier Selection -->
    <div v-else class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
      <!-- Debug Info -->
      <div class="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-700">
        <h3 class="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">Debug Info:</h3>
        <div class="space-y-2 text-xs text-yellow-700 dark:text-yellow-300">
          <div><strong>Category Slug:</strong> {{ categorySlug }}</div>
          <div><strong>Category Data:</strong> {{ categoryData ? 'Found' : 'Not Found' }}</div>
          <div><strong>Profiles Count:</strong> {{ categoryData?.profiles?.length || 0 }}</div>
          <div><strong>Raw Data:</strong> {{ JSON.stringify(categoryData, null, 2) }}</div>
        </div>
      </div>

      <div class="glass-card rounded-2xl p-6">
        <h2 class="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6 text-center">
          Rank Your Squad Members
        </h2>
        
        <!-- Show all profiles with simple tier selection -->
        <div class="space-y-4">
          <div 
            v-for="profile in categoryData?.profiles || []" 
            :key="profile.profile.id"
            class="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors"
          >
            <!-- Profile Info -->
            <div class="flex items-center space-x-4">
              <div class="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                <img 
                  v-if="profile.profile.photoUrl" 
                  :src="profile.profile.photoUrl" 
                  :alt="profile.profile.name"
                  class="w-full h-full rounded-full object-cover"
                />
                <span v-else>{{ profile.profile.name.charAt(0) }}</span>
              </div>
              <div>
                <h3 class="text-lg font-semibold text-slate-900 dark:text-slate-100">
                  {{ profile.profile.name }}
                </h3>
                <p class="text-sm text-slate-600 dark:text-slate-400">
                  Score: {{ profile.score }}/5
                </p>
              </div>
            </div>

            <!-- Simple Tier Selection -->
            <div class="flex items-center space-x-3">
              <span class="text-sm font-medium text-slate-700 dark:text-slate-300">Tier:</span>
              <select 
                v-model="profile.tier" 
                @change="updateTier(profile.profile.id, profile.tier)"
                class="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="">Select Tier</option>
                <option value="S">S Tier (Elite)</option>
                <option value="A">A Tier (Excellent)</option>
                <option value="B">B Tier (Good)</option>
                <option value="C">C Tier (Average)</option>
                <option value="D">D Tier (Poor)</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-if="!categoryData?.profiles?.length" class="py-12 text-center">
          <EmptyState
            icon="heroicons:users"
            title="No profiles found"
            description="No profiles have scores in this category yet."
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const categorySlug = route.params.slug as string
const { leaderboardData, pending, error, refresh } = useLeaderboard()
const { initAOS } = useAnimations()

const categoryData = computed(() => leaderboardData.value?.categories?.find(c => c.category.slug === categorySlug))

const updateTier = async (profileId: string, tier: string) => {
  try {
    const response = await $fetch('/api/leaderboard/update-tier', {
      method: 'POST',
      body: {
        profileId,
        categoryId: categoryData.value?.category.id,
        tier
      }
    })
    
    if (response.success) {
      console.log(`✅ ${response.message}`)
      // Show success message
      const profile = categoryData.value?.profiles?.find(p => p.profile.id === profileId)
      if (profile) {
        // Simple success notification
        const notification = document.createElement('div')
        notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50'
        notification.textContent = `${profile.profile.name} assigned to ${tier} tier!`
        document.body.appendChild(notification)
        
        // Remove after 3 seconds
        setTimeout(() => {
          document.body.removeChild(notification)
        }, 3000)
      }
      
      // Refresh the data to show updated tiers
      await refresh()
    }
  } catch (error) {
    console.error('❌ Failed to update tier:', error)
    // Simple error notification
    const notification = document.createElement('div')
    notification.className = 'fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50'
    notification.textContent = 'Failed to update tier. Please try again.'
    document.body.appendChild(notification)
    
    // Remove after 3 seconds
    setTimeout(() => {
      document.body.removeChild(notification)
    }, 3000)
  }
}

onMounted(() => {
  initAOS()
})

useHead({
  title: `${categoryData.value?.category.name || 'Category'} Rankings - SquadRank`,
  meta: [
    { name: 'description', content: `Simple tier rankings for ${categoryData.value?.category.name || 'category'} in your squad.` }
  ]
})
</script>
