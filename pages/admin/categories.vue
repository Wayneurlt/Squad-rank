<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
    <!-- Header -->
    <div class="bg-white dark:bg-slate-800 shadow-sm border-b border-slate-200 dark:border-slate-700">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-6">
          <div>
            <h1 class="text-2xl font-bold text-slate-900 dark:text-slate-100">
              Manage Categories
            </h1>
            <p class="text-slate-600 dark:text-slate-400">
              Add, edit, and manage ranking categories
            </p>
          </div>
          <div class="flex items-center space-x-4">
            <UButton 
              @click="seedData"
              :loading="isSeeding"
              variant="outline"
              size="sm"
              color="blue"
            >
              <Icon name="heroicons:arrow-path" class="w-4 h-4 mr-2" />
              Seed Demo Data
            </UButton>
            <UButton 
              @click="showAddForm = !showAddForm" 
              class="gradient-bg"
              size="lg"
            >
              <Icon :name="showAddForm ? 'heroicons:minus' : 'heroicons:tag'" class="w-5 h-5 mr-2" />
              {{ showAddForm ? 'Cancel' : 'Add New Category' }}
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
      <!-- Add Category Form -->
      <div v-if="showAddForm" class="mb-8">
        <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
          <!-- Form Header -->
          <div class="bg-gradient-to-r from-emerald-500 to-teal-600 px-6 py-4">
            <h2 class="text-xl font-semibold text-white flex items-center">
              <Icon :name="editingCategory ? 'heroicons:pencil' : 'heroicons:tag'" class="w-5 h-5 mr-2" />
              {{ editingCategory ? 'Edit Category' : 'Add New Category' }}
            </h2>
            <p class="text-emerald-100 text-sm mt-1">
              {{ editingCategory ? 'Update the category information below' : 'Create a new ranking category for your squad' }}
            </p>
          </div>
          
          <!-- Form Content -->
          <div class="p-6">
            <form @submit.prevent="handleSubmit" class="space-y-6">
              <!-- Basic Information -->
              <div class="space-y-4">
                <h3 class="text-lg font-medium text-slate-900 dark:text-slate-100 flex items-center">
                  <Icon name="heroicons:information-circle" class="w-5 h-5 mr-2 text-emerald-500" />
                  Basic Information
                </h3>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <UFormGroup label="Category Name" required>
                    <UInput
                      v-model="form.name"
                      placeholder="e.g., Humor, Reliability"
                      required
                      :error="errors.name"
                      size="lg"
                      icon="heroicons:tag"
                    />
                    <template #help>
                      The display name for this category
                    </template>
                  </UFormGroup>

                  <UFormGroup label="URL Slug" required>
                    <UInput
                      v-model="form.slug"
                      placeholder="e.g., humor, reliability"
                      required
                      :error="errors.slug"
                      size="lg"
                      icon="heroicons:link"
                      :disabled="!editingCategory && form.name"
                    />
                    <template #help>
                      <div class="flex items-center space-x-2">
                        <Icon name="heroicons:information-circle" class="w-4 h-4 text-blue-500" />
                        <span v-if="!editingCategory && form.name" class="text-blue-600 dark:text-blue-400">
                          Auto-generated from category name
                        </span>
                        <span v-else>
                          Used in URLs and API calls. Use lowercase letters, numbers, and hyphens only.
                        </span>
                      </div>
                    </template>
                  </UFormGroup>
                </div>
              </div>

              <!-- Category Details -->
              <div class="space-y-4">
                <h3 class="text-lg font-medium text-slate-900 dark:text-slate-100 flex items-center">
                  <Icon name="heroicons:cog-6-tooth" class="w-5 h-5 mr-2 text-emerald-500" />
                  Category Settings
                </h3>
                
                <UFormGroup label="Description">
                  <UTextarea
                    v-model="form.description"
                    placeholder="Describe what this category represents..."
                    :rows="3"
                    size="lg"
                  />
                  <template #help>
                    A brief description of what this category represents and how it's evaluated.
                  </template>
                </UFormGroup>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <UFormGroup label="Weight">
                    <USelect
                      v-model="form.weight"
                      :options="weightOptions"
                      placeholder="Select weight"
                      size="lg"
                    />
                    <template #help>
                      Higher weight means this category has more impact on overall scores.
                    </template>
                  </UFormGroup>

                  <UFormGroup label="Status">
                    <div class="flex items-center space-x-3 p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
                      <UCheckbox
                        v-model="form.active"
                        size="lg"
                      />
                      <div>
                        <label class="text-sm font-medium text-slate-900 dark:text-slate-100">
                          Active Category
                        </label>
                        <p class="text-xs text-slate-500 dark:text-slate-400">
                          Inactive categories won't appear in public leaderboards
                        </p>
                      </div>
                    </div>
                  </UFormGroup>
                </div>
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
                  <Icon :name="editingCategory ? 'heroicons:check' : 'heroicons:plus'" class="w-4 h-4 mr-2" />
                  {{ editingCategory ? 'Update Category' : 'Create Category' }}
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

      <!-- Categories Grid -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div 
          v-for="(category, index) in categories" 
          :key="category.id"
          class="glass-card rounded-2xl p-6 hover:scale-105 transition-all duration-300"
          data-aos="fade-up"
          :data-aos-delay="index * 100"
        >
          <div class="flex items-start justify-between mb-4">
            <div class="w-12 h-12 rounded-2xl flex items-center justify-center"
                 :class="getCategoryColor(category.slug)">
              <Icon :name="getCategoryIcon(category.slug)" class="w-6 h-6 text-white" />
            </div>
            <UBadge 
              :variant="category.active ? 'success' : 'default'"
              size="sm"
            >
              {{ category.active ? 'Active' : 'Inactive' }}
            </UBadge>
          </div>

          <h3 class="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
            {{ category.name }}
          </h3>
          
          <p v-if="category.description" class="text-sm text-slate-600 dark:text-slate-400 mb-4 line-clamp-2">
            {{ category.description }}
          </p>

          <div class="flex items-center justify-between mb-4">
            <div class="text-sm text-slate-500 dark:text-slate-400">
              Weight: <span class="font-semibold">{{ category.weight }}x</span>
            </div>
            <div class="text-sm text-slate-500 dark:text-slate-400">
              Slug: <code class="bg-slate-100 dark:bg-slate-800 px-1 rounded">{{ category.slug }}</code>
            </div>
          </div>

          <!-- Created Date -->
          <p class="text-xs text-slate-500 dark:text-slate-400 mb-4">
            Added {{ formatDate(category.createdAt) }}
          </p>

          <!-- Actions -->
          <div class="flex space-x-2">
            <UButton 
              @click="rankCategory(category)" 
              class="gradient-bg flex-1"
              size="sm"
            >
              <Icon name="heroicons:trophy" class="w-4 h-4 mr-1" />
              Rank
            </UButton>
            <UButton 
              @click="editCategory(category)" 
              variant="outline" 
              size="sm"
              class="flex-1"
            >
              <Icon name="heroicons:pencil" class="w-4 h-4 mr-1" />
              Edit
            </UButton>
            <UButton 
              @click="toggleCategory(category)" 
              :variant="category.active ? 'outline' : 'solid'"
              :color="category.active ? 'red' : 'green'"
              size="sm"
              class="flex-1"
              :loading="togglingCategory === category.id"
            >
              <Icon :name="category.active ? 'heroicons:eye-slash' : 'heroicons:eye'" class="w-4 h-4 mr-1" />
              {{ category.active ? 'Hide' : 'Show' }}
            </UButton>
            <UButton 
              @click="deleteCategory(category)" 
              variant="outline" 
              size="sm"
              color="red"
              class="flex-1"
              :loading="deletingCategory === category.id"
            >
              <Icon name="heroicons:trash" class="w-4 h-4 mr-1" />
              Delete
            </UButton>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="categories.length === 0 && !showAddForm" class="py-12">
        <EmptyState
          icon="heroicons:tag"
          title="No categories found"
          description="Get started by adding your first ranking category."
          action-text="Add Category"
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

import type { Category, CreateCategoryData } from '~/types'

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

const { data: categories, pending, refresh } = useFetch<Category[]>('/api/categories', {
  server: false,
  default: () => []
})

const showAddForm = ref(false)
const editingCategory = ref<Category | null>(null)
const isSubmitting = ref(false)
const togglingCategory = ref<string | null>(null)
const deletingCategory = ref<string | null>(null)
const isSeeding = ref(false)

const form = ref<CreateCategoryData & { active: boolean }>({
  name: '',
  slug: '',
  description: '',
  weight: 1,
  active: true
})

const errors = ref<Record<string, string>>({})

const weightOptions = [
  { label: '1x (Low Impact)', value: 1 },
  { label: '2x (Medium Impact)', value: 2 },
  { label: '3x (High Impact)', value: 3 },
  { label: '4x (Very High Impact)', value: 4 },
  { label: '5x (Maximum Impact)', value: 5 }
]

// Validation functions
const validateForm = () => {
  errors.value = {}
  
  if (!form.value.name?.trim()) {
    errors.value.name = 'Name is required'
  }
  
  if (!form.value.slug?.trim()) {
    errors.value.slug = 'Slug is required'
  } else if (!/^[a-z0-9-]+$/.test(form.value.slug)) {
    errors.value.slug = 'Slug must contain only lowercase letters, numbers, and hyphens'
  }
  
  return Object.keys(errors.value).length === 0
}

const formatDate = (date: Date | string) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

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

const getCategoryColor = (slug: string) => {
  const colorMap: Record<string, string> = {
    'humor': 'bg-yellow-500',
    'reliability': 'bg-green-500',
    'party-energy': 'bg-red-500',
    'style': 'bg-purple-500',
    'meme-lord': 'bg-blue-500',
    'timekeeper': 'bg-indigo-500',
    'creative-spark': 'bg-pink-500',
    'travel-buddy': 'bg-emerald-500'
  }
  return colorMap[slug] || 'bg-slate-500'
}

const editCategory = (category: Category) => {
  editingCategory.value = category
  form.value = {
    name: category.name,
    slug: category.slug,
    description: category.description || '',
    weight: category.weight,
    active: category.active
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

const toggleCategory = async (category: Category) => {
  togglingCategory.value = category.id
  try {
    await makeAuthenticatedRequest('/api/admin/category', {
      method: 'POST',
      body: {
        id: category.id,
        name: category.name,
        slug: category.slug,
        description: category.description,
        weight: category.weight,
        active: !category.active
      }
    })

    toast.success(`Category ${!category.active ? 'activated' : 'deactivated'} successfully!`)
    await refresh()
  } catch (error: any) {
    toast.error(error.data?.message || 'Failed to update category')
  } finally {
    togglingCategory.value = null
  }
}

const deleteCategory = async (category: Category) => {
  if (!confirm(`Are you sure you want to delete "${category.name}"? This action cannot be undone and will also delete all associated scores.`)) return

  deletingCategory.value = category.id
  try {
    await makeAuthenticatedRequest('/api/admin/category', {
      method: 'DELETE',
      body: { id: category.id }
    })

    toast.success('Category deleted successfully!')
    await refresh()
  } catch (error: any) {
    toast.error(error.data?.message || 'Failed to delete category')
  } finally {
    deletingCategory.value = null
  }
}

const rankCategory = (category: Category) => {
  navigateTo(`/admin/rank/${category.slug}`)
}

const seedData = async () => {
  isSeeding.value = true
  try {
    await makeAuthenticatedRequest('/api/admin/seed', { method: 'POST' })
    toast.success('Demo data seeded successfully!')
    await refresh()
  } catch (error: any) {
    toast.error(error.data?.message || 'Failed to seed data')
  } finally {
    isSeeding.value = false
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
      id: editingCategory.value?.id
    }

    await makeAuthenticatedRequest('/api/admin/category', {
      method: 'POST',
      body: payload
    })

    toast.success(editingCategory.value ? 'Category updated successfully!' : 'Category created successfully!')
    cancelForm()
    await refresh()
  } catch (error: any) {
    toast.error(error.data?.message || 'Failed to save category')
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
    slug: '',
    description: '',
    weight: 1,
    active: true
  }
  editingCategory.value = null
  errors.value = {}
}

// Auto-generate slug from name
watch(() => form.value.name, (newName) => {
  if (newName && !editingCategory.value) {
    form.value.slug = newName
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
  }
})

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
  title: 'Manage Categories - SquadRank Admin',
  meta: [
    { name: 'description', content: 'Manage ranking categories in SquadRank.' }
  ]
})
</script>
