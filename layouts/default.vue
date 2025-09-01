<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
    <slot />
  </div>
</template>

<script setup lang="ts">
// SEO
useHead({
  title: 'SquadRank - Squad Member Rankings',
  meta: [
    { name: 'description', content: 'Track and rank your squad members across various categories with SquadRank.' }
  ]
})
</script>
