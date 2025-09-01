<template>
  <div>
    <!-- Header -->
    <div class="bg-white dark:bg-slate-800 shadow-sm border-b border-slate-200 dark:border-slate-700">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-6">
          <div>
            <h1 class="text-2xl font-bold text-slate-900 dark:text-slate-100">
              Manage Profiles
            </h1>
            <p class="text-slate-600 dark:text-slate-400">
              Add, edit, and manage squad member profiles
            </p>
          </div>
          <div class="flex items-center space-x-4">
            <UButton 
              @click="showAddForm = !showAddForm" 
              class="gradient-bg"
              size="lg"
            >
              <Icon :name="showAddForm ? 'heroicons:minus' : 'heroicons:user-plus'" class="w-5 h-5 mr-2" />
              {{ showAddForm ? 'Cancel' : 'Add New Profile' }}
            </UButton>
            <UButton 
              to="/admin" 
              variant="outline" 
              size="sm"
            >
              Back to Dashboard
            </UButton>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Add Profile Form -->
      <div v-if="showAddForm" class="mb-8">
        <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
          <!-- Form Header -->
          <div class="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-4">
            <h2 class="text-xl font-semibold text-white flex items-center">
              <Icon :name="editingProfile ? 'heroicons:pencil' : 'heroicons:user-plus'" class="w-5 h-5 mr-2" />
              {{ editingProfile ? 'Edit Profile' : 'Add New Profile' }}
            </h2>
            <p class="text-indigo-100 text-sm mt-1">
              {{ editingProfile ? 'Update the profile information below' : 'Fill in the details to create a new squad member profile' }}
            </p>
          </div>
          
          <!-- Form Content -->
          <div class="p-6">
            <form @submit.prevent="handleSubmit" class="space-y-6">
              <!-- Basic Information -->
              <div class="space-y-4">
                <h3 class="text-lg font-medium text-slate-900 dark:text-slate-100 flex items-center">
                  <Icon name="heroicons:information-circle" class="w-5 h-5 mr-2 text-indigo-500" />
                  Basic Information
                </h3>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <UFormGroup label="Full Name" required>
                    <UInput
                      v-model="form.name"
                      placeholder="Enter full name"
                      required
                      :error="errors.name"
                      size="lg"
                      icon="heroicons:user"
                    />
                  </UFormGroup>

                  <UFormGroup label="Nickname">
                    <UInput
                      v-model="form.nickname"
                      placeholder="Enter nickname (optional)"
                      size="lg"
                      icon="heroicons:at-symbol"
                    />
                    <template #help>
                      A fun nickname or alias for this squad member
                    </template>
                  </UFormGroup>
                </div>
              </div>

              <!-- Profile Details -->
              <div class="space-y-4">
                <h3 class="text-lg font-medium text-slate-900 dark:text-slate-100 flex items-center">
                  <Icon name="heroicons:photo" class="w-5 h-5 mr-2 text-indigo-500" />
                  Profile Details
                </h3>
                
                <UFormGroup label="Profile Photo URL">
                  <UInput
                    v-model="form.photoUrl"
                    placeholder="https://example.com/photo.jpg"
                    :error="errors.photoUrl"
                    size="lg"
                    icon="heroicons:link"
                  />
                  <template #help>
                    Enter a valid image URL. The image will be displayed as a profile picture.
                  </template>
                </UFormGroup>

                <UFormGroup label="Bio">
                  <UTextarea
                    v-model="form.bio"
                    placeholder="Tell us about this squad member..."
                    :rows="4"
                    size="lg"
                  />
                  <template #help>
                    A brief description about this squad member's personality, interests, or role in the squad.
                  </template>
                </UFormGroup>
              </div>

              <!-- Form Actions -->
              <div class="flex justify-end space-x-3 pt-6 border-t border-slate-200 dark:border-slate-700">
                <UButton 
                  @click="cancelForm" 
                  variant="outline"
                  size="lg"
                  type="button"
                  class="px-6"
                >
                  <Icon name="heroicons:x-mark" class="w-4 h-4 mr-2" />
                  Cancel
                </UButton>
                <UButton 
                  type="submit" 
                  :loading="isSubmitting"
                  size="lg"
                  class="gradient-bg px-6"
                >
                  <Icon :name="editingProfile ? 'heroicons:check' : 'heroicons:plus'" class="w-4 h-4 mr-2" />
                  {{ editingProfile ? 'Update Profile' : 'Create Profile' }}
                </UButton>
              </div>
            </form>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="pending" class="space-y-4">
        <LoadingSkeleton type="list" :count="6" />
      </div>

      <!-- Profiles Grid -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div 
          v-for="(profile, index) in profiles" 
          :key="profile.id"
          class="glass-card rounded-2xl p-6 hover:scale-105 transition-all duration-300"
          data-aos="fade-up"
          :data-aos-delay="index * 100"
        >
          <div class="text-center">
            <!-- Avatar -->
            <div class="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4">
              <img 
                v-if="profile.photoUrl" 
                :src="profile.photoUrl" 
                :alt="profile.name"
                class="w-full h-full rounded-full object-cover"
                @error="handleImageError"
              />
              <span v-else>{{ profile.name.charAt(0) }}</span>
            </div>

            <!-- Name and Nickname -->
            <h3 class="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-1">
              {{ profile.name }}
            </h3>
            <p v-if="profile.nickname" class="text-slate-600 dark:text-slate-400 mb-3">
              ({{ profile.nickname }})
            </p>

            <!-- Bio -->
            <p v-if="profile.bio" class="text-sm text-slate-600 dark:text-slate-400 mb-4 line-clamp-2">
              {{ profile.bio }}
            </p>

            <!-- Created Date -->
            <p class="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Added {{ formatDate(profile.createdAt) }}
            </p>

            <!-- Actions -->
            <div class="flex space-x-2">
              <UButton 
                @click="editProfile(profile)" 
                variant="outline" 
                size="sm"
                class="flex-1"
              >
                <Icon name="heroicons:pencil" class="w-4 h-4 mr-1" />
                Edit
              </UButton>
              <UButton 
                @click="deleteProfile(profile)" 
                variant="outline" 
                size="sm"
                color="red"
                class="flex-1"
                :loading="deletingProfile === profile.id"
              >
                <Icon name="heroicons:trash" class="w-4 h-4 mr-1" />
                Delete
              </UButton>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="profiles.length === 0 && !showAddForm" class="py-12">
        <EmptyState
          icon="heroicons:users"
          title="No profiles found"
          description="Get started by adding your first squad member profile."
          action-text="Add Profile"
          @action="showAddForm = true"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Use the admin layout
definePageMeta({
  layout: 'admin'
})

import type { Profile, CreateProfileData } from '~/types'

const { isAuthenticated, checkSession, makeAuthenticatedRequest } = useAdminAuth()
const { initAOS } = useAnimations()
const toast = useNotivue()

// Check authentication on mount
onMounted(async () => {
  await checkSession()
  if (!isAuthenticated.value) {
    navigateTo('/admin/login')
  }
  initAOS()
})

const { data: profiles, pending, refresh } = useFetch<Profile[]>('/api/profiles', {
  server: false,
  default: () => []
})

const showAddForm = ref(false)
const editingProfile = ref<Profile | null>(null)
const isSubmitting = ref(false)
const deletingProfile = ref<string | null>(null)

const form = ref<CreateProfileData>({
  name: '',
  nickname: '',
  photoUrl: '',
  bio: ''
})

const errors = ref<Record<string, string>>({})

// Validation functions
const validateForm = () => {
  errors.value = {}
  
  if (!form.value.name?.trim()) {
    errors.value.name = 'Name is required'
  }
  
  if (form.value.photoUrl && !isValidUrl(form.value.photoUrl)) {
    errors.value.photoUrl = 'Please enter a valid URL'
  }
  
  return Object.keys(errors.value).length === 0
}

const isValidUrl = (url: string) => {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

const formatDate = (date: Date | string) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  img.style.display = 'none'
}

const editProfile = (profile: Profile) => {
  editingProfile.value = profile
  form.value = {
    name: profile.name,
    nickname: profile.nickname || '',
    photoUrl: profile.photoUrl || '',
    bio: profile.bio || ''
  }
  showAddForm.value = true
  // Scroll to form
  nextTick(() => {
    const formElement = document.querySelector('.glass-card')
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' })
    }
  })
}

const deleteProfile = async (profile: Profile) => {
  if (!confirm(`Are you sure you want to delete ${profile.name}? This action cannot be undone.`)) return

  deletingProfile.value = profile.id
  try {
    await makeAuthenticatedRequest('/api/admin/profile', {
      method: 'DELETE',
      body: { id: profile.id }
    })

    toast.success('Profile deleted successfully!')
    await refresh()
  } catch (error: any) {
    toast.error(error.data?.message || 'Failed to delete profile')
  } finally {
    deletingProfile.value = null
  }
}

const handleSubmit = async () => {
  if (!validateForm()) {
    toast.error('Please fix the errors in the form')
    return
  }

  isSubmitting.value = true
  try {
    const payload = {
      ...form.value,
      id: editingProfile.value?.id
    }

    await makeAuthenticatedRequest('/api/admin/profile', {
      method: 'POST',
      body: payload
    })

    toast.success(editingProfile.value ? 'Profile updated successfully!' : 'Profile created successfully!')
    cancelForm()
    await refresh()
  } catch (error: any) {
    toast.error(error.data?.message || 'Failed to save profile')
  } finally {
    isSubmitting.value = false
  }
}

const cancelForm = () => {
  showAddForm.value = false
  resetForm()
}

const resetForm = () => {
  form.value = {
    name: '',
    nickname: '',
    photoUrl: '',
    bio: ''
  }
  editingProfile.value = null
  errors.value = {}
}

// Watch for form changes to clear errors
watch(form, () => {
  if (Object.keys(errors.value).length > 0) {
    errors.value = {}
  }
}, { deep: true })

onMounted(() => {
  initAOS()
})

// SEO
useHead({
  title: 'Manage Profiles - SquadRank Admin',
  meta: [
    { name: 'description', content: 'Manage squad member profiles in SquadRank.' }
  ]
})
</script>
