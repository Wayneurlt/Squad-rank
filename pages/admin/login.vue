<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center p-4">
    <div class="w-full max-w-md">
      <div class="glass-card rounded-2xl p-8" data-aos="fade-up">
        <div class="text-center mb-8">
          <div class="w-16 h-16 gradient-bg rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Icon name="heroicons:shield-check" class="w-8 h-8 text-white" />
          </div>
          <h1 class="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
            Admin Login
          </h1>
          <p class="text-slate-600 dark:text-slate-400">
            Enter your email and password to access the dashboard
          </p>
        </div>

        <!-- Error Message -->
        <div v-if="errorMessage" class="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {{ errorMessage }}
        </div>

        <!-- Success Message -->
        <div v-if="successMessage" class="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
          {{ successMessage }}
        </div>

        <form @submit.prevent="handleLogin" class="space-y-6">
          <UFormGroup label="Email" required>
            <UInput
              v-model="email"
              type="email"
              placeholder="Enter your email"
              :disabled="isLoading"
              required
            />
          </UFormGroup>

          <UFormGroup label="Password" required>
            <UInput
              v-model="password"
              type="password"
              placeholder="Enter your password"
              :disabled="isLoading"
              required
            />
          </UFormGroup>

          <UButton
            type="submit"
            :loading="isLoading"
            :disabled="!email || !password"
            class="w-full gradient-bg"
            size="lg"
          >
            Sign In
          </UButton>
        </form>

        <div class="mt-6 text-center">
          <NuxtLink 
            to="/" 
            class="text-sm text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          >
            ← Back to Home
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { login, isLoading } = useAdminAuth()
const email = ref('')
const password = ref('')
const errorMessage = ref('')
const successMessage = ref('')

const handleLogin = async () => {
  console.log('handleLogin called with:', { email: email.value, password: password.value ? '***' : 'empty' })
  
  if (!email.value || !password.value) {
    console.log('Missing email or password')
    return
  }

  errorMessage.value = ''
  successMessage.value = ''

  console.log('Calling login function...')
  const result = await login(email.value, password.value)
  console.log('Login result:', result)
  
  if (result.success) {
    successMessage.value = 'Login successful!'
    console.log('Navigating to admin...')
    // Add a small delay to ensure the session is set
    setTimeout(async () => {
      await navigateTo('/admin')
    }, 100)
  } else {
    errorMessage.value = result.message
  }
}

const { initAOS } = useAnimations()

// Check if already authenticated on mount
const { isAuthenticated, checkSession } = useAdminAuth()
onMounted(async () => {
  initAOS()
  await checkSession()
  if (isAuthenticated.value) {
    console.log('Already authenticated, redirecting to admin')
    navigateTo('/admin')
  }
})

// SEO
useHead({
  title: 'Admin Login - SquadRank',
  meta: [
    { name: 'description', content: 'Admin login for SquadRank dashboard.' }
  ]
})
</script>
