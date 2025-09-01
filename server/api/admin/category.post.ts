import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { id, name, slug, description, weight, active } = body

    if (!name || !slug) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Name and slug are required'
      })
    }

    let category

    if (id) {
      // Update existing category
      category = await prisma.category.update({
        where: { id },
        data: {
          name,
          slug,
          description,
          weight: weight || 1,
          active: active !== undefined ? active : true
        }
      })
    } else {
      // Create new category
      category = await prisma.category.create({
        data: {
          name,
          slug,
          description,
          weight: weight || 1,
          active: active !== undefined ? active : true
        }
      })

      // Create default scores for all profiles
      const profiles = await prisma.profile.findMany()
      for (const profile of profiles) {
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
      data: category
    }
  } catch (error) {
    console.error('Error saving category:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to save category'
    })
  }
})
