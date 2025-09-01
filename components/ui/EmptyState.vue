<template>
  <div class="text-center py-12" data-aos="fade-up">
    <div class="mx-auto w-24 h-24 mb-6 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
      <Icon 
        :name="icon" 
        class="w-12 h-12 text-slate-400 dark:text-slate-500"
      />
    </div>
    <h3 class="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
      {{ title }}
    </h3>
    <p class="text-slate-600 dark:text-slate-400 mb-6 max-w-sm mx-auto">
      {{ description }}
    </p>
    <slot name="action">
      <UButton 
        v-if="actionText && actionHandler"
        @click="actionHandler"
        :variant="actionVariant"
        :size="actionSize"
      >
        {{ actionText }}
      </UButton>
    </slot>
  </div>
</template>

<script setup lang="ts">
interface Props {
  icon?: string
  title?: string
  description?: string
  actionText?: string
  actionVariant?: 'solid' | 'outline' | 'soft' | 'ghost' | 'link'
  actionSize?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  actionHandler?: () => void
}

withDefaults(defineProps<Props>(), {
  icon: 'heroicons:inbox',
  title: 'No data available',
  description: 'There\'s nothing to show here yet.',
  actionVariant: 'solid',
  actionSize: 'md'
})
</script>
