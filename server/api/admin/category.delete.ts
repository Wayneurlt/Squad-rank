import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { id } = body

    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Category ID is required'
      })
    }

    // Delete all scores associated with this category first
    await prisma.score.deleteMany({
      where: { categoryId: id }
    })

    // Delete the category
    const category = await prisma.category.delete({
      where: { id }
    })

    return {
      success: true,
      data: category
    }
  } catch (error) {
    console.error('Error deleting category:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to delete category'
    })
  }
})
