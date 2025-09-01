import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    // Get all profiles with their scores
    const profiles = await prisma.profile.findMany({
      include: {
        scores: {
          include: {
            category: true
          }
        }
      }
    })

    // Get all active categories
    const categories = await prisma.category.findMany({
      where: { active: true },
      orderBy: { weight: 'desc' }
    })

    // Calculate overall scores and category scores
    const leaderboardRows = profiles.map(profile => {
      const byCategory: Record<string, number> = {}
      let totalWeightedScore = 0
      let totalWeight = 0

      // Calculate scores for each category
      categories.forEach(category => {
        const score = profile.scores.find(s => s.categoryId === category.id)
        const value = score?.value || 0
        byCategory[category.slug] = value
        
        // Add to weighted total
        totalWeightedScore += value * category.weight
        totalWeight += category.weight
      })

      const overallScore = totalWeight > 0 ? totalWeightedScore / totalWeight : 0

      return {
        profile: {
          id: profile.id,
          name: profile.name,
          nickname: profile.nickname,
          photoUrl: profile.photoUrl,
          bio: profile.bio,
          createdAt: profile.createdAt
        },
        overallScore: Math.round(overallScore * 100) / 100,
        byCategory
      }
    })

    // Sort by overall score
    const overall = leaderboardRows.sort((a, b) => b.overallScore - a.overallScore)

    // Create category-specific rankings
    const categoryRankings = categories.map(category => ({
      category: {
        id: category.id,
        name: category.name,
        slug: category.slug,
        description: category.description,
        weight: category.weight,
        active: category.active,
        createdAt: category.createdAt
      },
      top: leaderboardRows
        .sort((a, b) => (b.byCategory[category.slug] || 0) - (a.byCategory[category.slug] || 0))
        .slice(0, 10) // Top 10 for each category
    }))

    return {
      success: true,
      data: {
        overall,
        categories: categoryRankings
      }
    }
  } catch (error) {
    console.error('Error fetching leaderboard:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch leaderboard data'
    })
  }
})
