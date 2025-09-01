import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { id, name, nickname, photoUrl, bio } = body

    if (!name) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Name is required'
      })
    }

    let profile

    if (id) {
      // Update existing profile
      profile = await prisma.profile.update({
        where: { id },
        data: {
          name,
          nickname,
          photoUrl,
          bio
        }
      })
    } else {
      // Create new profile
      profile = await prisma.profile.create({
        data: {
          name,
          nickname,
          photoUrl,
          bio
        }
      })

      // Create default scores for all categories
      const categories = await prisma.category.findMany()
      for (const category of categories) {
        await prisma.score.upsert({
          where: {
            profileId_categoryId: {
              profileId: profile.id,
              categoryId: category.id
            }
          },
          update: {
            value: 1 // Default score
          },
          create: {
            profileId: profile.id,
            categoryId: category.id,
            value: 1 // Default score
          }
        })
      }
    }

    return {
      success: true,
      data: profile
    }
  } catch (error) {
    console.error('Error saving profile:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to save profile'
    })
  }
})
