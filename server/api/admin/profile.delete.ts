import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { id } = body

    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Profile ID is required'
      })
    }

    // Delete all scores associated with this profile first
    await prisma.score.deleteMany({
      where: { profileId: id }
    })

    // Delete the profile
    const profile = await prisma.profile.delete({
      where: { id }
    })

    return {
      success: true,
      data: profile
    }
  } catch (error) {
    console.error('Error deleting profile:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to delete profile'
    })
  }
})
