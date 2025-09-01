<template>
  <div class="min-h-screen bg-slate-50 dark:bg-slate-900">
    <!-- Desktop Sidebar -->
    <div class="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
      <div class="flex grow flex-col gap-y-5 overflow-y-auto bg-white dark:bg-slate-800 px-6 pb-4 shadow-xl border-r border-slate-200 dark:border-slate-700">
        <!-- Logo -->
        <div class="flex h-16 shrink-0 items-center border-b border-slate-200 dark:border-slate-700">
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 gradient-bg rounded-xl flex items-center justify-center">
              <Icon name="heroicons:shield-check" class="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 class="text-xl font-bold text-slate-900 dark:text-slate-100">SquadRank</h1>
              <p class="text-xs text-slate-500 dark:text-slate-400">Admin Dashboard</p>
            </div>
          </div>
        </div>

        <!-- Navigation -->
        <nav class="flex flex-1 flex-col">
          <ul role="list" class="flex flex-1 flex-col gap-y-7">
            <li>
              <ul role="list" class="-mx-2 space-y-1">
                <li>
                  <NuxtLink 
                    to="/admin" 
                    class="group flex gap-x-3 rounded-xl p-3 text-sm leading-6 font-semibold transition-all duration-200"
                    :class="isActive('/admin') ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400' : 'text-slate-700 hover:text-indigo-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:text-indigo-400 dark:hover:bg-slate-700/50'"
                  >
                    <Icon name="heroicons:home" class="h-6 w-6 shrink-0" />
                    Dashboard
                  </NuxtLink>
                </li>
                <li>
                  <NuxtLink 
                    to="/admin/profiles" 
                    class="group flex gap-x-3 rounded-xl p-3 text-sm leading-6 font-semibold transition-all duration-200"
                    :class="isActive('/admin/profiles') ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400' : 'text-slate-700 hover:text-indigo-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:text-indigo-400 dark:hover:bg-slate-700/50'"
                  >
                    <Icon name="heroicons:users" class="h-6 w-6 shrink-0" />
                    Profiles
                  </NuxtLink>
                </li>
                <li>
                  <NuxtLink 
                    to="/admin/categories" 
                    class="group flex gap-x-3 rounded-xl p-3 text-sm leading-6 font-semibold transition-all duration-200"
                    :class="isActive('/admin/categories') ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400' : 'text-slate-700 hover:text-indigo-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:text-indigo-400 dark:hover:bg-slate-700/50'"
                  >
                    <Icon name="heroicons:tag" class="h-6 w-6 shrink-0" />
                    Categories
                  </NuxtLink>
                </li>
                <li>
                  <NuxtLink 
                    to="/admin/scores" 
                    class="group flex gap-x-3 rounded-xl p-3 text-sm leading-6 font-semibold transition-all duration-200"
                    :class="isActive('/admin/scores') ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400' : 'text-slate-700 hover:text-indigo-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:text-indigo-400 dark:hover:bg-slate-700/50'"
                  >
                    <Icon name="heroicons:chart-bar" class="h-6 w-6 shrink-0" />
                    Scores
                  </NuxtLink>
                </li>
              </ul>
            </li>
            
            <!-- User section -->
            <li class="mt-auto">
              <div class="flex items-center gap-x-4 px-3 py-3 text-sm font-semibold leading-6 text-slate-900 dark:text-slate-100">
                <div class="h-10 w-10 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center">
                  <Icon name="heroicons:user" class="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div class="flex-1 min-w-0">
                  <p class="truncate">{{ admin?.name || 'Admin' }}</p>
                  <p class="truncate text-xs text-slate-500 dark:text-slate-400">{{ admin?.email }}</p>
                </div>
              </div>
              <button 
                @click="handleLogout"
                class="w-full flex items-center gap-x-3 rounded-xl p-3 text-sm leading-6 font-semibold text-slate-700 hover:text-red-600 hover:bg-red-50 dark:text-slate-300 dark:hover:text-red-400 dark:hover:bg-red-900/20 transition-all duration-200"
              >
                <Icon name="heroicons:arrow-right-on-rectangle" class="h-6 w-6 shrink-0" />
                Logout
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </div>

    <!-- Main content -->
    <div class="lg:pl-72">
      <!-- Top bar -->
      <div class="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
        <div class="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
          <div class="flex flex-1 items-center">
            <h2 class="text-lg font-semibold text-slate-900 dark:text-slate-100">
              {{ getPageTitle() }}
            </h2>
          </div>
          <div class="flex items-center gap-x-4 lg:gap-x-6">
            <NuxtLink 
              to="/leaderboard" 
              target="_blank"
              class="flex items-center gap-x-2 rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 hover:text-indigo-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:text-indigo-400 dark:hover:bg-slate-700/50 transition-all duration-200"
            >
              <Icon name="heroicons:eye" class="h-4 w-4" />
              <span class="hidden sm:inline">View Leaderboard</span>
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- Page content -->
      <main class="py-6 px-4 sm:px-6 lg:px-8 pb-20 lg:pb-6">
        <div class="mx-auto max-w-7xl">
          <slot />
        </div>
      </main>
    </div>

    <!-- Mobile Bottom Navigation -->
    <div class="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 shadow-lg">
      <div class="grid grid-cols-4 h-16">
        <NuxtLink 
          to="/admin" 
          class="flex flex-col items-center justify-center space-y-1 transition-colors"
          :class="isActive('/admin') ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500 dark:text-slate-400'"
        >
          <Icon name="heroicons:home" class="h-5 w-5" />
          <span class="text-xs font-medium">Dashboard</span>
        </NuxtLink>
        
        <NuxtLink 
          to="/admin/profiles" 
          class="flex flex-col items-center justify-center space-y-1 transition-colors"
          :class="isActive('/admin/profiles') ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500 dark:text-slate-400'"
        >
          <Icon name="heroicons:users" class="h-5 w-5" />
          <span class="text-xs font-medium">Profiles</span>
        </NuxtLink>
        
        <NuxtLink 
          to="/admin/categories" 
          class="flex flex-col items-center justify-center space-y-1 transition-colors"
          :class="isActive('/admin/categories') ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500 dark:text-slate-400'"
        >
          <Icon name="heroicons:tag" class="h-5 w-5" />
          <span class="text-xs font-medium">Categories</span>
        </NuxtLink>
        
        <NuxtLink 
          to="/admin/scores" 
          class="flex flex-col items-center justify-center space-y-1 transition-colors"
          :class="isActive('/admin/scores') ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500 dark:text-slate-400'"
        >
          <Icon name="heroicons:chart-bar" class="h-5 w-5" />
          <span class="text-xs font-medium">Scores</span>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const { admin, logout } = useAdminAuth()

const isActive = (path: string) => {
  return route.path === path
}

const getPageTitle = () => {
  const titles: Record<string, string> = {
    '/admin': 'Dashboard',
    '/admin/profiles': 'Manage Profiles',
    '/admin/categories': 'Manage Categories',
    '/admin/scores': 'Manage Scores'
  }
  return titles[route.path] || 'Admin Dashboard'
}

const handleLogout = () => {
  logout()
  navigateTo('/admin/login')
}

// SEO
useHead({
  title: 'Admin Dashboard - SquadRank',
  meta: [
    { name: 'description', content: 'SquadRank admin dashboard for managing squad rankings.' }
  ]
})
</script>
