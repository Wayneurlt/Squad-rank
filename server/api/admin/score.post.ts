import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { profileId, categoryId, value } = body

    if (!profileId || !categoryId || value === undefined) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Profile ID, category ID, and value are required'
      })
    }

    if (value < 1 || value > 5) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Score must be between 1 and 5'
      })
    }

    const score = await prisma.score.upsert({
      where: {
        profileId_categoryId: {
          profileId,
          categoryId
        }
      },
      update: {
        value
      },
      create: {
        profileId,
        categoryId,
        value
      }
    })

    return {
      success: true,
      data: score
    }
  } catch (error) {
    console.error('Error saving score:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to save score'
    })
  }
})
