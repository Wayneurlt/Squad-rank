<template>
  <div>
    <!-- Welcome Section -->
    <div class="mb-8" data-aos="fade-up">
      <h1 class="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
        Welcome back, {{ admin?.name || 'Admin' }}!
      </h1>
      <p class="text-slate-600 dark:text-slate-400">
        Here's your squad's current ranking status.
      </p>
    </div>

    <!-- Quick Stats -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8" data-aos="fade-up" data-aos-delay="100">
      <div class="glass-card rounded-2xl p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-slate-600 dark:text-slate-400">Total Members</p>
            <p class="text-2xl font-bold text-slate-900 dark:text-slate-100">{{ stats.totalProfiles }}</p>
          </div>
          <div class="w-12 h-12 bg-indigo-100 dark:bg-indigo-900 rounded-xl flex items-center justify-center">
            <Icon name="heroicons:users" class="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
          </div>
        </div>
      </div>

      <div class="glass-card rounded-2xl p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-slate-600 dark:text-slate-400">Categories</p>
            <p class="text-2xl font-bold text-slate-900 dark:text-slate-100">{{ stats.totalCategories }}</p>
          </div>
          <div class="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-xl flex items-center justify-center">
            <Icon name="heroicons:tag" class="w-6 h-6 text-purple-600 dark:text-purple-400" />
          </div>
        </div>
      </div>

      <div class="glass-card rounded-2xl p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-slate-600 dark:text-slate-400">Total Scores</p>
            <p class="text-2xl font-bold text-slate-900 dark:text-slate-100">{{ stats.totalScores }}</p>
          </div>
          <div class="w-12 h-12 bg-emerald-100 dark:bg-emerald-900 rounded-xl flex items-center justify-center">
            <Icon name="heroicons:chart-bar" class="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
          </div>
        </div>
      </div>
    </div>

    <!-- Current Rankings -->
    <div class="glass-card rounded-2xl p-6" data-aos="fade-up" data-aos-delay="200">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-xl font-bold text-slate-900 dark:text-slate-100">Current Rankings</h2>
        <UButton 
          to="/leaderboard" 
          target="_blank"
          variant="outline"
          size="sm"
        >
          <Icon name="heroicons:eye" class="w-4 h-4 mr-2" />
          View Public
        </UButton>
      </div>

      <!-- Loading State -->
      <div v-if="pending" class="space-y-4">
        <LoadingSkeleton type="card" :count="3" />
      </div>

      <!-- Rankings List -->
      <div v-else-if="leaderboardData?.overall" class="space-y-4">
        <div 
          v-for="(member, index) in leaderboardData.overall.slice(0, 5)" 
          :key="member.profile.id"
          class="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors"
        >
          <div class="flex items-center space-x-4">
            <!-- Rank -->
            <div class="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
              :class="{
                'gradient-bg': index < 3,
                'bg-slate-400': index >= 3
              }"
            >
              <Icon 
                v-if="index === 0" 
                name="heroicons:trophy" 
                class="w-5 h-5 text-yellow-300"
              />
              <Icon 
                v-else-if="index === 1" 
                name="heroicons:trophy" 
                class="w-5 h-5 text-gray-300"
              />
              <Icon 
                v-else-if="index === 2" 
                name="heroicons:trophy" 
                class="w-5 h-5 text-amber-600"
              />
              <span v-else>{{ index + 1 }}</span>
            </div>

            <!-- Profile Info -->
            <div>
              <h3 class="font-semibold text-slate-900 dark:text-slate-100">
                {{ member.profile.name }}
                <span v-if="member.profile.nickname" class="text-slate-500 dark:text-slate-400 font-normal">
                  ({{ member.profile.nickname }})
                </span>
              </h3>
              <p class="text-sm text-slate-600 dark:text-slate-400">
                {{ member.overallScore }} total points
              </p>
            </div>
          </div>

          <!-- Quick Actions -->
          <div class="flex items-center space-x-2">
            <UButton 
              to="/admin/profiles" 
              variant="ghost" 
              size="sm"
              class="text-slate-600 hover:text-indigo-600"
            >
              <Icon name="heroicons:pencil" class="w-4 h-4" />
            </UButton>
            <UButton 
              to="/admin/scores" 
              variant="ghost" 
              size="sm"
              class="text-slate-600 hover:text-emerald-600"
            >
              <Icon name="heroicons:chart-bar" class="w-4 h-4" />
            </UButton>
          </div>
        </div>

        <!-- View All Link -->
        <div v-if="leaderboardData.overall.length > 5" class="text-center pt-4">
          <UButton 
            to="/leaderboard" 
            variant="ghost"
            class="text-indigo-600 hover:text-indigo-700"
          >
            View all {{ leaderboardData.overall.length }} members
            <Icon name="heroicons:arrow-right" class="w-4 h-4 ml-2" />
          </UButton>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-8">
        <Icon name="heroicons:users" class="w-12 h-12 text-slate-400 mx-auto mb-4" />
        <p class="text-slate-600 dark:text-slate-400 mb-4">No profiles found</p>
        <UButton 
          to="/admin/profiles" 
          class="gradient-bg"
        >
          <Icon name="heroicons:plus" class="w-4 h-4 mr-2" />
          Add First Profile
        </UButton>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-8" data-aos="fade-up" data-aos-delay="300">
      <UButton 
        to="/admin/profiles" 
        class="h-24 flex flex-col items-center justify-center space-y-2 glass-card hover:scale-105 transition-transform"
      >
        <Icon name="heroicons:users" class="w-8 h-8 text-indigo-600" />
        <span class="font-medium">Manage Profiles</span>
      </UButton>

      <UButton 
        to="/admin/categories" 
        class="h-24 flex flex-col items-center justify-center space-y-2 glass-card hover:scale-105 transition-transform"
      >
        <Icon name="heroicons:tag" class="w-8 h-8 text-purple-600" />
        <span class="font-medium">Manage Categories</span>
      </UButton>

      <UButton 
        to="/admin/scores" 
        class="h-24 flex flex-col items-center justify-center space-y-2 glass-card hover:scale-105 transition-transform"
      >
        <Icon name="heroicons:chart-bar" class="w-8 h-8 text-emerald-600" />
        <span class="font-medium">Manage Scores</span>
      </UButton>

      <UButton 
        to="/admin/seed" 
        class="h-24 flex flex-col items-center justify-center space-y-2 glass-card hover:scale-105 transition-transform"
      >
        <Icon name="heroicons:database" class="w-8 h-8 text-amber-600" />
        <span class="font-medium">Seed Data</span>
      </UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
const { admin } = useAdminAuth()
const { leaderboardData, pending } = useLeaderboard()

// Calculate stats
const stats = computed(() => {
  if (!leaderboardData.value) return { totalProfiles: 0, totalCategories: 0, totalScores: 0 }
  
  const totalProfiles = leaderboardData.value.overall.length
  const totalCategories = leaderboardData.value.categories?.length || 0
  const totalScores = leaderboardData.value.overall.reduce((sum, member) => {
    return sum + Object.keys(member.byCategory).length
  }, 0)
  
  return { totalProfiles, totalCategories, totalScores }
})

const { initAOS } = useAnimations()

onMounted(() => {
  initAOS()
})

// SEO
useHead({
  title: 'Admin Dashboard - SquadRank',
  meta: [
    { name: 'description', content: 'SquadRank admin dashboard for managing squad rankings.' }
  ]
})
</script>