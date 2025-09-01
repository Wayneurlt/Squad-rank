<template>
  <div class="min-h-screen bg-gray-100 p-8">
    <div class="max-w-4xl mx-auto">
      <!-- Header -->
      <div class="text-center mb-8">
        <h1 class="text-4xl font-bold text-gray-900 mb-4">
          {{ categoryData?.category.name || categorySlug }} Rankings
        </h1>
        <p class="text-lg text-gray-600">
          Rank your squad members into tiers
        </p>
        <NuxtLink 
          to="/admin" 
          class="inline-block mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          ← Back to Admin
        </NuxtLink>
      </div>

      <!-- Loading State -->
      <div v-if="pending" class="text-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
        <p class="mt-4 text-gray-600">Loading profiles...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center py-12">
        <div class="text-red-500 text-6xl mb-4">⚠️</div>
        <h3 class="text-xl font-semibold text-gray-900 mb-2">Error Loading Profiles</h3>
        <p class="text-gray-600 mb-4">{{ error.message }}</p>
        <button 
          @click="refresh"
          class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Try Again
        </button>
      </div>

      <!-- Profiles List -->
      <div v-else-if="categoryData?.profiles?.length" class="bg-white rounded-lg shadow-lg p-6">
        <h2 class="text-2xl font-bold text-gray-900 mb-6 text-center">
          Rank Your Squad Members
        </h2>
        
        <!-- Profile List -->
        <div class="space-y-4">
          <div 
            v-for="profile in categoryData.profiles" 
            :key="profile.profile.id"
            class="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <!-- Profile Info -->
            <div class="flex items-center space-x-4">
              <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                {{ profile.profile.name.charAt(0) }}
              </div>
              <div>
                <h3 class="text-lg font-semibold text-gray-900">
                  {{ profile.profile.name }}
                </h3>
                <p class="text-sm text-gray-600">
                  Score: {{ profile.score }}/5
                </p>
              </div>
            </div>

            <!-- Tier Selection -->
            <div class="flex items-center space-x-3">
              <span class="text-sm font-medium text-gray-700">Tier:</span>
              <select 
                v-model="profile.tier" 
                @change="updateTier(profile.profile.id, profile.tier)"
                class="px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-500"
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

        <!-- Save All Button -->
        <div class="mt-8 text-center">
          <button 
            @click="saveAllRankings"
            :disabled="isSaving"
            class="px-8 py-3 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-colors text-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="isSaving">Saving...</span>
            <span v-else>Save All Rankings</span>
          </button>
        </div>

        <!-- Current Rankings Summary -->
        <div class="mt-6 p-4 bg-gray-50 rounded-lg">
          <h3 class="font-semibold text-gray-900 mb-2">Current Rankings Summary:</h3>
          <div class="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
            <div class="text-center">
              <div class="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center text-white text-xs font-bold mx-auto mb-1">S</div>
              <div class="text-yellow-700 font-medium">{{ getTierCount('S') }}</div>
              <div class="text-gray-500 text-xs">Elite</div>
            </div>
            <div class="text-center">
              <div class="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold mx-auto mb-1">A</div>
              <div class="text-green-700 font-medium">{{ getTierCount('A') }}</div>
              <div class="text-gray-500 text-xs">Excellent</div>
            </div>
            <div class="text-center">
              <div class="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold mx-auto mb-1">B</div>
              <div class="text-blue-700 font-medium">{{ getTierCount('B') }}</div>
              <div class="text-gray-500 text-xs">Good</div>
            </div>
            <div class="text-center">
              <div class="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white text-xs font-bold mx-auto mb-1">C</div>
              <div class="text-orange-700 font-medium">{{ getTierCount('C') }}</div>
              <div class="text-gray-500 text-xs">Average</div>
            </div>
            <div class="text-center">
              <div class="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold mx-auto mb-1">D</div>
              <div class="text-red-700 font-medium">{{ getTierCount('D') }}</div>
              <div class="text-gray-500 text-xs">Poor</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-12">
        <div class="text-gray-400 text-6xl mb-4">👥</div>
        <h3 class="text-xl font-semibold text-gray-900 mb-2">No Profiles Found</h3>
        <p class="text-gray-600 mb-4">No profiles have scores in this category yet.</p>
        <NuxtLink 
          to="/admin"
          class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Back to Admin
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CategoryRanking, TieredProfile } from '~/types'

const route = useRoute()
const categorySlug = route.params.slug as string

// Fetch leaderboard data
const { leaderboardData, pending, error, refresh } = useLeaderboard()

// Get the specific category data
const categoryData = computed(() => 
  leaderboardData.value?.categories?.find(c => c.category.slug === categorySlug)
)

// State for saving
const isSaving = ref(false)

// Update individual tier
const updateTier = async (profileId: string, tier: string) => {
  if (!tier || !categoryData.value) return

  try {
    console.log(`🎯 Updating ${profileId} to ${tier} tier`)
    
    const response = await $fetch('/api/leaderboard/update-tier', {
      method: 'POST',
      body: {
        profileId,
        categoryId: categoryData.value.category.id,
        tier
      }
    })
    
    if (response.success) {
      console.log(`✅ Tier updated successfully: ${response.message}`)
      // Show success notification
      showNotification('success', `Profile assigned to ${tier} tier!`)
    }
  } catch (error) {
    console.error('❌ Failed to update tier:', error)
    showNotification('error', 'Failed to update tier. Please try again.')
  }
}

// Save all rankings
const saveAllRankings = async () => {
  if (!categoryData.value?.profiles) return

  isSaving.value = true
  
  try {
    // Save each profile's tier
    const savePromises = categoryData.value.profiles
      .filter(profile => profile.tier) // Only save profiles with tiers assigned
      .map(profile => 
        $fetch('/api/leaderboard/update-tier', {
          method: 'POST',
          body: {
            profileId: profile.profile.id,
            categoryId: categoryData.value!.category.id,
            tier: profile.tier
          }
        })
      )

    await Promise.all(savePromises)
    
    showNotification('success', 'All rankings saved successfully!')
    
    // Refresh the data to show updated tiers
    await refresh()
    
  } catch (error) {
    console.error('❌ Failed to save rankings:', error)
    showNotification('error', 'Failed to save rankings. Please try again.')
  } finally {
    isSaving.value = false
  }
}

// Helper functions
const getTierCount = (tier: string) => {
  return categoryData.value?.profiles?.filter(p => p.tier === tier).length || 0
}

// Simple notification system
const showNotification = (type: 'success' | 'error', message: string) => {
  const notification = document.createElement('div')
  notification.className = `fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 ${
    type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
  }`
  notification.textContent = message
  document.body.appendChild(notification)
  
  setTimeout(() => {
    if (document.body.contains(notification)) {
      document.body.removeChild(notification)
    }
  }, 3000)
}

// Watch for route changes and refresh data
watch(() => route.params.slug, () => {
  refresh()
})
</script>
