import type { AdminSession } from '~/types'

// Global auth state - shared across all components
const globalAuthState = {
  isAuthenticated: false,
  isLoading: false,
  admin: null as any,
  sessionChecked: false
}

export const useAdminAuth = () => {
  const isAuthenticated = ref(globalAuthState.isAuthenticated)
  const isLoading = ref(globalAuthState.isLoading)
  const admin = ref(globalAuthState.admin)

  const checkSession = async () => {
    // Only check session once globally
    if (globalAuthState.sessionChecked) {
      isAuthenticated.value = globalAuthState.isAuthenticated
      admin.value = globalAuthState.admin
      return
    }

    globalAuthState.isLoading = true
    isLoading.value = true

    try {
      const response = await $fetch<{ success: boolean; isAuthenticated: boolean; admin?: any }>('/api/admin/session')
      console.log('Session check response:', response)
      
      globalAuthState.isAuthenticated = response.isAuthenticated
      globalAuthState.admin = response.admin || null
      globalAuthState.sessionChecked = true
      
      isAuthenticated.value = response.isAuthenticated
      admin.value = response.admin || null
    } catch (error) {
      console.error('Session check failed:', error)
      globalAuthState.isAuthenticated = false
      globalAuthState.admin = null
      globalAuthState.sessionChecked = true
      
      isAuthenticated.value = false
      admin.value = null
    } finally {
      globalAuthState.isLoading = false
      isLoading.value = false
    }
  }

  const login = async (email: string, password: string) => {
    globalAuthState.isLoading = true
    isLoading.value = true
    
    try {
      console.log('Attempting login with:', { email })
      const response = await $fetch<{ success: boolean; message: string; admin?: any }>('/api/admin/login', {
        method: 'POST',
        body: { email, password }
      })
      
      console.log('Login response:', response)
      
      if (response.success) {
        // Update global state
        globalAuthState.isAuthenticated = true
        globalAuthState.admin = response.admin
        globalAuthState.sessionChecked = true
        
        // Update local refs
        isAuthenticated.value = true
        admin.value = response.admin
        
        return { success: true, message: response.message, admin: response.admin }
      }
      
      return { success: false, message: 'Authentication failed' }
    } catch (error: any) {
      console.error('Login failed:', error)
      return { 
        success: false, 
        message: error.data?.message || error.message || 'Authentication failed' 
      }
    } finally {
      globalAuthState.isLoading = false
      isLoading.value = false
    }
  }

  const logout = () => {
    // Clear the cookie by setting it to expire
    const cookie = useCookie('admin-session', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 0
    })
    cookie.value = null
    
    // Reset global state
    globalAuthState.isAuthenticated = false
    globalAuthState.admin = null
    globalAuthState.sessionChecked = false
    
    // Update local refs
    isAuthenticated.value = false
    admin.value = null
  }

  const makeAuthenticatedRequest = async <T>(
    url: string, 
    options: any = {}
  ): Promise<T> => {
    return $fetch<T>(url, {
      ...options,
      credentials: 'include' // Include cookies for authentication
    })
  }

  // Don't automatically check session on mount - let pages decide when to check

  return {
    isAuthenticated: readonly(isAuthenticated),
    isLoading: readonly(isLoading),
    admin: readonly(admin),
    checkSession,
    login,
    logout,
    makeAuthenticatedRequest
  }
}
