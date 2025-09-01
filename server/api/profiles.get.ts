import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    const profiles = await prisma.profile.findMany({
      orderBy: { createdAt: 'desc' }
    })

    return profiles
  } catch (error) {
    console.error('Error fetching profiles:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch profiles'
    })
  }
})
