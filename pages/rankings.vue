<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
    <!-- Header -->
    <div class="relative overflow-hidden bg-white shadow-sm border-b border-slate-200">
      <div class="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-indigo-600/5"></div>
      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div class="text-center" data-aos="fade-up">
          <h1 class="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            <span class="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Squad Rankings
            </span>
          </h1>
          <p class="text-xl text-slate-600 max-w-3xl mx-auto">
            See how your squad members rank across all categories with our tier-based system
          </p>
          <div class="mt-6 flex flex-wrap justify-center gap-3">
            <div class="inline-flex items-center px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
              <div class="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
              S Tier - Elite
            </div>
            <div class="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
              <div class="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              A Tier - Excellent
            </div>
            <div class="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
              <div class="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
              B Tier - Good
            </div>
            <div class="inline-flex items-center px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm font-medium">
              <div class="w-2 h-2 bg-orange-500 rounded-full mr-2"></div>
              C Tier - Average
            </div>
            <div class="inline-flex items-center px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
              <div class="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
              D Tier - Poor
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="pending" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="i in 6" :key="i" class="bg-white rounded-2xl shadow-lg p-6 animate-pulse">
          <div class="h-6 bg-slate-200 rounded mb-4"></div>
          <div class="space-y-3">
            <div v-for="j in 4" :key="j" class="flex items-center space-x-3">
              <div class="w-10 h-10 bg-slate-200 rounded-full"></div>
              <div class="flex-1">
                <div class="h-4 bg-slate-200 rounded w-3/4"></div>
                <div class="h-3 bg-slate-200 rounded w-1/2 mt-2"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Rankings Grid -->
    <div v-else class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <!-- Category Card -->
        <div 
          v-for="categoryData in leaderboardData?.categories || []" 
          :key="categoryData.category.id"
          class="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          data-aos="fade-up"
        >
          <!-- Category Header -->
          <div class="p-6 border-b border-slate-100">
            <div class="flex items-center justify-between mb-3">
              <h3 class="text-xl font-bold text-slate-900">
                {{ categoryData.category.name }}
              </h3>
              <div class="flex items-center space-x-2">
                <span class="text-sm text-slate-500">{{ categoryData.totalParticipants }} members</span>
                <div class="w-2 h-2 bg-blue-500 rounded-full"></div>
              </div>
            </div>
            <p class="text-slate-600 text-sm mb-3">
              {{ categoryData.category.description }}
            </p>
            <div class="flex items-center justify-between">
              <span class="text-xs text-slate-500">
                Weight: {{ categoryData.category.weight }}x
              </span>
              <NuxtLink 
                :to="`/admin/rank/${categoryData.category.slug}`"
                class="inline-flex items-center text-xs text-blue-600 hover:text-blue-700 font-medium"
              >
                Edit Rankings
                <Icon name="heroicons:arrow-right" class="w-3 h-3 ml-1" />
              </NuxtLink>
            </div>
          </div>

          <!-- Tier Rankings -->
          <div class="p-6">
            <!-- S Tier -->
            <div class="mb-4">
              <div class="flex items-center mb-2">
                <div class="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center text-white text-xs font-bold mr-2">
                  S
                </div>
                <span class="text-sm font-semibold text-yellow-700">Elite</span>
                <span class="ml-auto text-xs text-slate-500">
                  {{ getTierCount(categoryData, 'S') }} members
                </span>
              </div>
              <div class="space-y-2">
                <div 
                  v-for="profile in getTierProfiles(categoryData, 'S')" 
                  :key="profile.profile.id"
                  class="flex items-center space-x-3 p-2 bg-yellow-50 rounded-lg"
                >
                  <div class="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {{ profile.profile.name.charAt(0) }}
                  </div>
                  <div class="flex-1">
                    <div class="font-medium text-slate-900">{{ profile.profile.name }}</div>
                    <div class="text-xs text-slate-600">Score: {{ profile.score }}/5</div>
                  </div>
                </div>
                <div v-if="getTierCount(categoryData, 'S') === 0" class="text-xs text-slate-400 italic p-2">
                  No members assigned yet
                </div>
              </div>
            </div>

            <!-- A Tier -->
            <div class="mb-4">
              <div class="flex items-center mb-2">
                <div class="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold mr-2">
                  A
                </div>
                <span class="text-sm font-semibold text-green-700">Excellent</span>
                <span class="ml-auto text-xs text-slate-500">
                  {{ getTierCount(categoryData, 'A') }} members
                </span>
              </div>
              <div class="space-y-2">
                <div 
                  v-for="profile in getTierProfiles(categoryData, 'A')" 
                  :key="profile.profile.id"
                  class="flex items-center space-x-3 p-2 bg-green-50 rounded-lg"
                >
                  <div class="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {{ profile.profile.name.charAt(0) }}
                  </div>
                  <div class="flex-1">
                    <div class="font-medium text-slate-900">{{ profile.profile.name }}</div>
                    <div class="text-xs text-slate-600">Score: {{ profile.score }}/5</div>
                  </div>
                </div>
                <div v-if="getTierCount(categoryData, 'A') === 0" class="text-xs text-slate-400 italic p-2">
                  No members assigned yet
                </div>
              </div>
            </div>

            <!-- B Tier -->
            <div class="mb-4">
              <div class="flex items-center mb-2">
                <div class="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold mr-2">
                  B
                </div>
                <span class="text-sm font-semibold text-blue-700">Good</span>
                <span class="ml-auto text-xs text-slate-500">
                  {{ getTierCount(categoryData, 'B') }} members
                </span>
              </div>
              <div class="space-y-2">
                <div 
                  v-for="profile in getTierProfiles(categoryData, 'B')" 
                  :key="profile.profile.id"
                  class="flex items-center space-x-3 p-2 bg-blue-50 rounded-lg"
                >
                  <div class="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {{ profile.profile.name.charAt(0) }}
                  </div>
                  <div class="flex-1">
                    <div class="font-medium text-slate-900">{{ profile.profile.name }}</div>
                    <div class="text-xs text-slate-600">Score: {{ profile.score }}/5</div>
                  </div>
                </div>
                <div v-if="getTierCount(categoryData, 'B') === 0" class="text-xs text-slate-400 italic p-2">
                  No members assigned yet
                </div>
              </div>
            </div>

            <!-- C Tier -->
            <div class="mb-4">
              <div class="flex items-center mb-2">
                <div class="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-white text-xs font-bold mr-2">
                  C
                </div>
                <span class="text-sm font-semibold text-orange-700">Average</span>
                <span class="ml-auto text-xs text-slate-500">
                  {{ getTierCount(categoryData, 'C') }} members
                </span>
              </div>
              <div class="space-y-2">
                <div 
                  v-for="profile in getTierProfiles(categoryData, 'C')" 
                  :key="profile.profile.id"
                  class="flex items-center space-x-3 p-2 bg-orange-50 rounded-lg"
                >
                  <div class="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {{ profile.profile.name.charAt(0) }}
                  </div>
                  <div class="flex-1">
                    <div class="font-medium text-slate-900">{{ profile.profile.name }}</div>
                    <div class="text-xs text-slate-600">Score: {{ profile.score }}/5</div>
                  </div>
                </div>
                <div v-if="getTierCount(categoryData, 'C') === 0" class="text-xs text-slate-400 italic p-2">
                  No members assigned yet
                </div>
              </div>
            </div>

            <!-- D Tier -->
            <div class="mb-4">
              <div class="flex items-center mb-2">
                <div class="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold mr-2">
                  D
                </div>
                <span class="text-sm font-semibold text-red-700">Poor</span>
                <span class="ml-auto text-xs text-slate-500">
                  {{ getTierCount(categoryData, 'D') }} members
                </span>
              </div>
              <div class="space-y-2">
                <div 
                  v-for="profile in getTierProfiles(categoryData, 'D')" 
                  :key="profile.profile.id"
                  class="flex items-center space-x-3 p-2 bg-red-50 rounded-lg"
                >
                  <div class="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {{ profile.profile.name.charAt(0) }}
                  </div>
                  <div class="flex-1">
                    <div class="font-medium text-slate-900">{{ profile.profile.name }}</div>
                    <div class="text-xs text-slate-600">Score: {{ profile.score }}/5</div>
                  </div>
                </div>
                <div v-if="getTierCount(categoryData, 'D') === 0" class="text-xs text-slate-400 italic p-2">
                  No members assigned yet
                </div>
              </div>
            </div>

            <!-- Unranked -->
            <div class="pt-4 border-t border-slate-100">
              <div class="flex items-center mb-2">
                <div class="w-6 h-6 bg-slate-400 rounded-full flex items-center justify-center text-white text-xs font-bold mr-2">
                  ?
                </div>
                <span class="text-sm font-semibold text-slate-600">Unranked</span>
                <span class="ml-auto text-xs text-slate-500">
                  {{ getUnrankedCount(categoryData) }} members
                </span>
              </div>
              <div class="space-y-2">
                <div 
                  v-for="profile in getUnrankedProfiles(categoryData)" 
                  :key="profile.profile.id"
                  class="flex items-center space-x-3 p-2 bg-slate-50 rounded-lg"
                >
                  <div class="w-8 h-8 bg-slate-400 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {{ profile.profile.name.charAt(0) }}
                  </div>
                  <div class="flex-1">
                    <div class="font-medium text-slate-900">{{ profile.profile.name }}</div>
                    <div class="text-xs text-slate-600">Score: {{ profile.score }}/5</div>
                  </div>
                </div>
                <div v-if="getUnrankedCount(categoryData) === 0" class="text-xs text-slate-400 italic p-2">
                  All members ranked
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="!leaderboardData?.categories?.length" class="text-center py-12">
        <div class="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Icon name="heroicons:trophy" class="w-12 h-12 text-slate-400" />
        </div>
        <h3 class="text-xl font-semibold text-slate-900 mb-2">
          No Rankings Yet
        </h3>
        <p class="text-slate-600 mb-8 max-w-md mx-auto">
          Start ranking your squad members by category to see beautiful tier-based rankings here.
        </p>
        <NuxtLink 
          to="/admin"
          class="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          <Icon name="heroicons:arrow-right" class="w-5 h-5 mr-2" />
          Go to Admin
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { LeaderboardResponse, TieredProfile } from '~/types'

const { leaderboardData, pending } = useLeaderboard()
const { initAOS } = useAnimations()

// Helper functions for tier management
const getTierCount = (categoryData: any, tier: string) => {
  return categoryData.profiles.filter((p: TieredProfile) => p.tier === tier).length
}

const getTierProfiles = (categoryData: any, tier: string) => {
  return categoryData.profiles.filter((p: TieredProfile) => p.tier === tier)
}

const getUnrankedCount = (categoryData: any) => {
  return categoryData.profiles.filter((p: TieredProfile) => !p.tier).length
}

const getUnrankedProfiles = (categoryData: any) => {
  return categoryData.profiles.filter((p: TieredProfile) => !p.tier)
}

onMounted(() => {
  initAOS()
})

useHead({
  title: 'Squad Rankings - Tier-Based Leaderboard',
  meta: [
    { name: 'description', content: 'Beautiful tier-based rankings for your squad across all categories. See S, A, B, C, D tier assignments.' }
  ]
})
</script>
