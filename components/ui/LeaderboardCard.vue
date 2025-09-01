<template>
  <div 
    class="glass-card rounded-2xl p-6 transition-all duration-300 hover:scale-105 hover:shadow-xl"
    :class="{
      'glow': rank <= 3,
      'glow-green': rank === 1,
      'glow-amber': rank === 2,
      'floating': rank <= 3
    }"
    data-aos="fade-up"
    :data-aos-delay="rank * 100"
  >
    <div class="flex items-center space-x-4">
      <!-- Rank Badge -->
      <div class="flex-shrink-0">
        <div 
          class="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg"
          :class="{
            'gradient-bg': rank <= 3,
            'bg-slate-400': rank > 3
          }"
        >
          <Icon 
            v-if="rank === 1" 
            name="heroicons:trophy" 
            class="w-6 h-6 text-yellow-300"
          />
          <Icon 
            v-else-if="rank === 2" 
            name="heroicons:trophy" 
            class="w-6 h-6 text-gray-300"
          />
          <Icon 
            v-else-if="rank === 3" 
            name="heroicons:trophy" 
            class="w-6 h-6 text-amber-600"
          />
          <span v-else>{{ rank }}</span>
        </div>
      </div>

      <!-- Profile Info -->
      <div class="flex-1 min-w-0">
        <div class="flex items-center space-x-3">
          <!-- Avatar -->
          <div class="flex-shrink-0">
            <div class="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl">
              <img 
                v-if="profile.photoUrl" 
                :src="profile.photoUrl" 
                :alt="profile.name"
                class="w-full h-full rounded-full object-cover"
              />
              <span v-else>{{ profile.name.charAt(0) }}</span>
            </div>
          </div>

          <!-- Name and Bio -->
          <div class="flex-1 min-w-0">
            <h3 class="text-lg font-semibold text-slate-900 dark:text-slate-100 truncate">
              {{ profile.name }}
              <span v-if="profile.nickname" class="text-slate-500 dark:text-slate-400 font-normal">
                ({{ profile.nickname }})
              </span>
            </h3>
            <p v-if="profile.bio" class="text-sm text-slate-600 dark:text-slate-400 truncate">
              {{ profile.bio }}
            </p>
          </div>
        </div>
      </div>

      <!-- Score Display -->
      <div class="flex-shrink-0 text-right">
        <div class="text-2xl font-bold gradient-text">
          {{ animatedScore }}
        </div>
        <div class="text-xs text-slate-500 dark:text-slate-400">
          Overall Score
        </div>
      </div>
    </div>

    <!-- Category Scores (if expanded) -->
    <div v-if="showCategories" class="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
      <div class="grid grid-cols-2 md:grid-cols-4 gap-2">
        <div 
          v-for="(score, categorySlug) in byCategory" 
          :key="categorySlug"
          class="text-center"
        >
          <div class="text-xs text-slate-500 dark:text-slate-400 mb-1">
            {{ getCategoryName(categorySlug) }}
          </div>
          <div class="text-sm font-semibold text-slate-900 dark:text-slate-100">
            {{ score }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { gsap } from 'gsap'

interface Props {
  profile: {
    id: string
    name: string
    nickname?: string
    photoUrl?: string
    bio?: string
    createdAt: Date
  }
  overallScore: number
  byCategory: Record<string, number>
  rank: number
  showCategories?: boolean
  categories?: Array<{ slug: string; name: string }>
}

const props = withDefaults(defineProps<Props>(), {
  showCategories: false
})

const animatedScore = ref(0)

const getCategoryName = (slug: string) => {
  if (!props.categories) return slug
  const category = props.categories.find(c => c.slug === slug)
  return category?.name || slug
}

const animateScore = () => {
  gsap.to(animatedScore, {
    value: props.overallScore,
    duration: 1.5,
    ease: "power2.out",
    onUpdate: () => {
      animatedScore.value = Math.round(animatedScore.value * 100) / 100
    }
  })
}

onMounted(() => {
  // Delay animation based on rank
  setTimeout(() => {
    animateScore()
  }, props.rank * 200)
})

watch(() => props.overallScore, () => {
  animateScore()
})
</script>
