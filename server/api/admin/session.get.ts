import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    const sessionId = getCookie(event, 'admin-session')
    
    if (!sessionId) {
      return {
        success: true,
        isAuthenticated: false
      }
    }

    // Verify admin exists
    const admin = await prisma.admin.findUnique({
      where: { id: sessionId },
      select: { id: true, email: true, name: true }
    })

    return {
      success: true,
      isAuthenticated: !!admin,
      admin: admin || null
    }
  } catch (error) {
    console.error('Session check error:', error)
    return {
      success: false,
      isAuthenticated: false
    }
  }
})
