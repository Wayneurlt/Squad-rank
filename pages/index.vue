<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
    <!-- Hero Section -->
    <div class="relative overflow-hidden">
      <div class="absolute inset-0 bg-gradient-to-r from-indigo-600/10 to-purple-600/10"></div>
      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div class="text-center" data-aos="fade-up">
          <h1 class="text-4xl md:text-6xl font-bold text-slate-900 dark:text-slate-100 mb-6">
            <span class="gradient-text">SquadRank</span>
          </h1>
          <p class="text-xl text-slate-600 dark:text-slate-400 mb-8 max-w-2xl mx-auto">
            Track and rank your squad members across various categories with beautiful leaderboards and engaging animations.
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <UButton 
              to="/leaderboard" 
              size="lg" 
              class="gradient-bg hover:scale-105 transition-transform"
            >
              View Leaderboard
            </UButton>
            <UButton 
              to="/admin" 
              variant="outline" 
              size="lg"
              class="hover:scale-105 transition-transform"
            >
              Admin Panel
            </UButton>
          </div>
        </div>
      </div>
    </div>

    <!-- Features Section -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div class="text-center mb-16" data-aos="fade-up">
        <h2 class="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-4">
          Why SquadRank?
        </h2>
        <p class="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          Built with modern technology and beautiful design to make squad ranking fun and engaging.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div 
          v-for="(feature, index) in features" 
          :key="index"
          class="glass-card rounded-2xl p-8 text-center hover:scale-105 transition-all duration-300"
          data-aos="fade-up"
          :data-aos-delay="index * 100"
        >
          <div class="w-16 h-16 gradient-bg rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Icon :name="feature.icon" class="w-8 h-8 text-white" />
          </div>
          <h3 class="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
            {{ feature.title }}
          </h3>
          <p class="text-slate-600 dark:text-slate-400">
            {{ feature.description }}
          </p>
        </div>
      </div>
    </div>

    <!-- Stats Section -->
    <div class="bg-slate-100 dark:bg-slate-800 py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
          <div 
            v-for="(stat, index) in stats" 
            :key="index"
            data-aos="fade-up"
            :data-aos-delay="index * 100"
          >
            <div class="text-3xl font-bold gradient-text mb-2">
              {{ stat.value }}
            </div>
            <div class="text-slate-600 dark:text-slate-400">
              {{ stat.label }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- CTA Section -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div class="glass-card rounded-2xl p-12 text-center" data-aos="fade-up">
        <h2 class="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-4">
          Ready to rank your squad?
        </h2>
        <p class="text-lg text-slate-600 dark:text-slate-400 mb-8 max-w-2xl mx-auto">
          Start tracking your squad's performance across different categories and see who comes out on top!
        </p>
        <UButton 
          to="/leaderboard" 
          size="xl" 
          class="gradient-bg hover:scale-105 transition-transform"
        >
          Get Started
        </UButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { initAOS } = useAnimations()

const features = [
  {
    icon: 'heroicons:chart-bar',
    title: 'Beautiful Leaderboards',
    description: 'Modern, responsive leaderboards with smooth animations and glassmorphism effects.'
  },
  {
    icon: 'heroicons:star',
    title: 'Category Rankings',
    description: 'Track performance across multiple categories with weighted scoring systems.'
  },
  {
    icon: 'heroicons:cog-6-tooth',
    title: 'Admin Panel',
    description: 'Secure admin interface for managing profiles, categories, and scores.'
  }
]

const stats = [
  { value: '6', label: 'Squad Members' },
  { value: '8', label: 'Categories' },
  { value: '5★', label: 'Max Rating' },
  { value: '100%', label: 'Fun Factor' }
]

onMounted(() => {
  initAOS()
})

// SEO
useHead({
  title: 'SquadRank - Squad Leaderboard',
  meta: [
    { name: 'description', content: 'Track and rank your squad members across various categories with beautiful leaderboards and engaging animations.' }
  ]
})
</script> 
