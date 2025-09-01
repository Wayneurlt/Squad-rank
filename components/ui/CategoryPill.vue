<template>
  <button
    @click="$emit('click', category)"
    class="px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 hover:scale-105"
    :class="{
      'gradient-bg text-white shadow-lg': isActive,
      'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-600': !isActive
    }"
    data-aos="fade-right"
    :data-aos-delay="index * 50"
  >
    <div class="flex items-center space-x-2">
      <Icon 
        :name="getCategoryIcon(category.slug)" 
        class="w-4 h-4"
      />
      <span>{{ category.name }}</span>
      <span 
        v-if="category.weight > 1" 
        class="text-xs opacity-75"
      >
        ({{ category.weight }}x)
      </span>
    </div>
  </button>
</template>

<script setup lang="ts">
interface Category {
  id: string
  name: string
  slug: string
  description?: string
  weight: number
  active: boolean
  createdAt: Date
}

interface Props {
  category: Category
  isActive: boolean
  index: number
}

defineProps<Props>()
defineEmits<{
  click: [category: Category]
}>()

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
</script>
