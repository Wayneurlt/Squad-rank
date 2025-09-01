<template>
  <div 
    class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
    :class="badgeClasses"
    data-aos="zoom-in"
  >
    <Icon 
      v-if="icon" 
      :name="icon" 
      class="w-4 h-4 mr-1"
    />
    <slot>{{ text }}</slot>
  </div>
</template>

<script setup lang="ts">
interface Props {
  variant?: 'default' | 'success' | 'warning' | 'info' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  icon?: string
  text?: string
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  size: 'md'
})

const badgeClasses = computed(() => {
  const baseClasses = 'inline-flex items-center font-medium'
  
  const variantClasses = {
    default: 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200',
    success: 'bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200',
    warning: 'bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200',
    info: 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200',
    danger: 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
  }
  
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-base'
  }
  
  return `${baseClasses} ${variantClasses[props.variant]} ${sizeClasses[props.size]}`
})
</script>
