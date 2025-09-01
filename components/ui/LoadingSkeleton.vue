<template>
  <div class="animate-pulse">
    <div 
      v-if="type === 'card'"
      class="glass-card rounded-2xl p-6"
    >
      <div class="flex items-center space-x-4">
        <div class="w-12 h-12 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
        <div class="flex-1 space-y-2">
          <div class="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
          <div class="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
        </div>
        <div class="w-16 h-8 bg-slate-200 dark:bg-slate-700 rounded"></div>
      </div>
    </div>
    
    <div 
      v-else-if="type === 'list'"
      class="space-y-4"
    >
      <div 
        v-for="i in count" 
        :key="i"
        class="flex items-center space-x-4 p-4"
      >
        <div class="w-10 h-10 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
        <div class="flex-1 space-y-2">
          <div class="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/3"></div>
          <div class="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/4"></div>
        </div>
        <div class="w-12 h-6 bg-slate-200 dark:bg-slate-700 rounded"></div>
      </div>
    </div>
    
    <div 
      v-else-if="type === 'grid'"
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      <div 
        v-for="i in count" 
        :key="i"
        class="glass-card rounded-2xl p-6 space-y-4"
      >
        <div class="w-16 h-16 bg-slate-200 dark:bg-slate-700 rounded-full mx-auto"></div>
        <div class="space-y-2">
          <div class="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mx-auto"></div>
          <div class="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/2 mx-auto"></div>
        </div>
        <div class="w-20 h-6 bg-slate-200 dark:bg-slate-700 rounded mx-auto"></div>
      </div>
    </div>
    
    <div 
      v-else
      class="space-y-3"
    >
      <div class="h-4 bg-slate-200 dark:bg-slate-700 rounded w-full"></div>
      <div class="h-4 bg-slate-200 dark:bg-slate-700 rounded w-5/6"></div>
      <div class="h-4 bg-slate-200 dark:bg-slate-700 rounded w-4/6"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  type?: 'card' | 'list' | 'grid' | 'text'
  count?: number
}

withDefaults(defineProps<Props>(), {
  type: 'text',
  count: 3
})
</script>
