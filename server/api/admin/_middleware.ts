import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  // Skip authentication for login and session endpoints
  if (event.node.req.url?.includes('/admin/login') || event.node.req.url?.includes('/admin/session')) {
    return
  }

  try {
    const sessionId = getCookie(event, 'admin-session')
    
    if (!sessionId) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Unauthorized - No session found'
      })
    }

    // Verify admin exists
    const admin = await prisma.admin.findUnique({
      where: { id: sessionId }
    })

    if (!admin) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Unauthorized - Invalid session'
      })
    }

    // Add admin info to event context for use in other handlers
    event.context.admin = admin
  } catch (error) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized'
    })
  }
})
