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

    <!-- Simple Rankings List -->
    <div v-else class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
      <div class="space-y-4">
        <div 
          v-for="(member, index) in leaderboardData.overall" 
          :key="member.profile.id"
          class="glass-card rounded-2xl p-6 transition-all duration-300 hover:scale-102 hover:shadow-lg"
          :class="{
            'glow': index < 3,
            'glow-green': index === 0,
            'glow-amber': index === 1,
            'glow-orange': index === 2
          }"
          data-aos="fade-up"
          :data-aos-delay="index * 50"
        >
          <div class="flex items-center space-x-4">
            <!-- Rank Number -->
            <div class="flex-shrink-0">
              <div 
                class="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg"
                :class="{
                  'gradient-bg': index < 3,
                  'bg-slate-400': index >= 3
                }"
              >
                <Icon 
                  v-if="index === 0" 
                  name="heroicons:trophy" 
                  class="w-6 h-6 text-yellow-300"
                />
                <Icon 
                  v-else-if="index === 1" 
                  name="heroicons:trophy" 
                  class="w-6 h-6 text-gray-300"
                />
                <Icon 
                  v-else-if="index === 2" 
                  name="heroicons:trophy" 
                  class="w-6 h-6 text-amber-600"
                />
                <span v-else>{{ index + 1 }}</span>
              </div>
            </div>

            <!-- Profile Info -->
            <div class="flex-1 min-w-0">
              <div class="flex items-center space-x-4">
                <!-- Avatar -->
                <div class="flex-shrink-0">
                  <div class="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl">
                    <img 
                      v-if="member.profile.photoUrl" 
                      :src="member.profile.photoUrl" 
                      :alt="member.profile.name"
                      class="w-full h-full rounded-full object-cover"
                    />
                    <span v-else>{{ member.profile.name.charAt(0) }}</span>
                  </div>
                </div>

                <!-- Name and Bio -->
                <div class="flex-1 min-w-0">
                  <h3 class="text-xl font-bold text-slate-900 dark:text-slate-100">
                    {{ member.profile.name }}
                    <span v-if="member.profile.nickname" class="text-slate-500 dark:text-slate-400 font-normal text-lg">
                      ({{ member.profile.nickname }})
                    </span>
                  </h3>
                  <p v-if="member.profile.bio" class="text-slate-600 dark:text-slate-400 mt-1">
                    {{ member.profile.bio }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Overall Score -->
            <div class="flex-shrink-0 text-right">
              <div class="text-3xl font-bold gradient-text">
                {{ member.overallScore }}
              </div>
              <div class="text-sm text-slate-500 dark:text-slate-400">
                Total Points
              </div>
            </div>
          </div>

          <!-- Category Scores -->
          <div class="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700">
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div 
                v-for="(score, categorySlug) in member.byCategory" 
                :key="categorySlug"
                class="text-center p-3 bg-slate-50 dark:bg-slate-700 rounded-lg"
              >
                <div class="text-xs text-slate-500 dark:text-slate-400 mb-1 font-medium">
                  {{ getCategoryName(categorySlug) }}
                </div>
                <div class="text-lg font-bold text-slate-900 dark:text-slate-100">
                  {{ score }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="leaderboardData.overall.length === 0" class="py-12">
        <EmptyState
          icon="heroicons:users"
          title="No squad members found"
          description="No profiles have been added yet."
        />
      </div>
    </div>

    <!-- Confetti Canvas -->
    <ConfettiCanvas ref="confettiRef" />
  </div>
</template>

<script setup lang="ts">
const { 
  leaderboardData, 
  pending, 
  error, 
  refresh 
} = useLeaderboard()

const { initAOS, createConfetti } = useAnimations()
const confettiRef = ref()

const getCategoryName = (slug: string) => {
  const category = leaderboardData.value?.categories?.find(c => c.category.slug === slug)
  return category?.category.name || slug
}

onMounted(() => {
  initAOS()
  
  // Trigger confetti for top 3 after a delay
  setTimeout(() => {
    if (leaderboardData.value?.overall && leaderboardData.value.overall.length > 0) {
      if (confettiRef.value) {
        confettiRef.value.burst(window.innerWidth / 2, 100, 30)
      }
    }
  }, 2000)
})

// SEO
useHead({
  title: 'Squad Rankings - SquadRank',
  meta: [
    { name: 'description', content: 'Simple and clear ranking of your squad members with scores across all categories.' }
  ]
})
</script>
