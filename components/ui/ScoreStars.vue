<template>
  <div class="flex items-center space-x-1">
    <button
      v-for="star in 5"
      :key="star"
      @click="!readonly && updateScore(star)"
      @mouseenter="!readonly && (hoverValue = star)"
      @mouseleave="!readonly && (hoverValue = 0)"
      @keydown.enter="!readonly && updateScore(star)"
      @keydown.space.prevent="!readonly && updateScore(star)"
      class="transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-opacity-50 rounded"
      :class="{
        'cursor-pointer': !readonly,
        'cursor-default': readonly
      }"
      :aria-label="`Rate ${star} out of 5 stars`"
      :disabled="readonly"
    >
      <Icon
        :name="star <= (hoverValue || value) ? 'heroicons:star-solid' : 'heroicons:star'"
        class="w-6 h-6 transition-all duration-200"
        :class="{
          'text-yellow-400': star <= (hoverValue || value),
          'text-slate-300 dark:text-slate-600': star > (hoverValue || value),
          'hover:text-yellow-300': !readonly && star > value,
          'drop-shadow-sm': star <= (hoverValue || value)
        }"
      />
    </button>
    <span v-if="showValue" class="ml-2 text-sm font-medium text-slate-600 dark:text-slate-400">
      {{ value }}/5
    </span>
  </div>
</template>

<script setup lang="ts">
interface Props {
  value: number
  readonly?: boolean
  showValue?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  readonly: false,
  showValue: false
})

const emit = defineEmits<{
  update: [value: number]
}>()

const hoverValue = ref(0)

const updateScore = (newValue: number) => {
  if (!props.readonly) {
    emit('update', newValue)
  }
}
</script>
