<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
    <!-- Header -->
    <div class="relative overflow-hidden">
      <div class="absolute inset-0 bg-gradient-to-r from-indigo-600/10 to-purple-600/10"></div>
      <div class="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div class="text-center" data-aos="fade-up">
          <h1 class="text-4xl md:text-5xl font-bold text-slate-900 dark:text-slate-100 mb-4">
            <span class="gradient-text">Squad Rankings</span>
          </h1>
          <p class="text-lg text-slate-600 dark:text-slate-400 mb-8">
            Simple and clear ranking of your squad members
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
        title="Failed to load rankings"
        description="There was an error loading the data. Please try again."
        action-text="Retry"
        @action="refresh"
      />
    </div>

    <!-- Category Overview Grid -->
    <div v-else class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
      <!-- Simple Info -->
      <div class="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
        <h3 class="font-semibold text-blue-800 dark:text-blue-200 mb-2">🎯 Simple Tier Ranking</h3>
        <p class="text-sm text-blue-700 dark:text-blue-300">
          Click on any category below to rank your squad members into S, A, B, C, or D tiers.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div 
          v-for="category in leaderboardData?.categories" 
          :key="category.category.slug"
          class="glass-card rounded-2xl p-6 hover:scale-105 transition-transform cursor-pointer"
          @click="navigateToCategory(category.category.slug)"
        >
          <!-- Category Header -->
          <div class="text-center mb-6">
            <h3 class="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">
              {{ category.category.name }}
            </h3>
            <p v-if="category.category.description" class="text-sm text-slate-600 dark:text-slate-400 mb-3">
              {{ category.category.description }}
            </p>
            <div class="inline-flex items-center px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-200 rounded-full text-sm font-medium">
              Weight: {{ category.category.weight }}x
            </div>
          </div>

          <!-- Simple Status -->
          <div class="text-center mb-6">
            <div class="text-3xl font-bold text-blue-600">{{ category.totalParticipants }}</div>
            <div class="text-sm text-slate-600 dark:text-slate-400">Profiles to Rank</div>
          </div>

          <!-- Action Button -->
          <div class="mt-4">
            <button class="w-full px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg font-medium hover:from-blue-600 hover:to-indigo-700 transition-all duration-200">
              Start Ranking
            </button>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="!leaderboardData?.categories?.length" class="py-12 text-center">
        <EmptyState
          icon="heroicons:users"
          title="No categories found"
          description="No ranking categories have been set up yet."
        />
      </div>
    </div>


  </div>
</template>

<script setup lang="ts">
const { 
  leaderboardData, 
  pending, 
  error, 
  refresh 
} = useLeaderboard()

const { initAOS } = useAnimations()

const navigateToCategory = (slug: string) => {
  navigateTo(`/category/${slug}`)
}

onMounted(() => {
  initAOS()
})

// SEO
useHead({
  title: 'Squad Rankings - SquadRank',
  meta: [
    { name: 'description', content: 'Simple and clear ranking of your squad members with scores across all categories.' }
  ]
})
</script>
