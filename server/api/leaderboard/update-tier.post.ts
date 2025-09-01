import { prisma } from '~/server/database'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { profileId, categoryId, tier } = body

    if (!profileId || !categoryId || !tier) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Missing required fields: profileId, categoryId, tier'
      })
    }

    // Update the score record with the tier assignment
    const updatedScore = await prisma.score.update({
      where: {
        profileId_categoryId: {
          profileId,
          categoryId
        }
      },
      data: {
        tier: tier
      }
    })

    console.log(`🎯 Tier Update: Profile ${profileId} in Category ${categoryId} assigned to ${tier} tier`)

    // Return success response
    return {
      success: true,
      message: `Profile assigned to ${tier} tier successfully`,
      data: {
        profileId,
        categoryId,
        tier,
        updatedScore
      }
    }

  } catch (error) {
    console.error('❌ Error updating tier:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to update tier assignment'
    })
  }
})
