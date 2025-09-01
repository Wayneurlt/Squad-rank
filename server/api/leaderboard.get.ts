import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    console.log('🔍 Leaderboard API called')

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

    console.log('📊 Found profiles:', profiles.length)

    // Get all active categories
    const categories = await prisma.category.findMany({
      where: { active: true },
      orderBy: { weight: 'desc' }
    })

    console.log('🏷️ Found categories:', categories.length)

    // Create rankings for each category with tier support
    const categoryRankings = categories.map(category => {
      // Get profiles with scores in this category
      const categoryProfiles = profiles
        .filter(profile => {
          const score = profile.scores.find(s => s.categoryId === category.id)
          return score // Include all profiles with any score, even 0
        })
        .map(profile => {
          const score = profile.scores.find(s => s.categoryId === category.id)!
          return {
            profile: {
              id: profile.id,
              name: profile.name,
              nickname: profile.nickname,
              photoUrl: profile.photoUrl,
              bio: profile.bio,
              createdAt: profile.createdAt
            },
            score: score.value,
            categoryId: category.id,
            // Get tier from database
            tier: score.tier
          }
        })
        .sort((a, b) => b.score - a.score)

      console.log(`📈 Category ${category.name}: ${categoryProfiles.length} profiles with scores`)

      // Group profiles by tier
      const tierGroups = {
        S: categoryProfiles.filter(p => p.tier === 'S'),
        A: categoryProfiles.filter(p => p.tier === 'A'),
        B: categoryProfiles.filter(p => p.tier === 'B'),
        C: categoryProfiles.filter(p => p.tier === 'C'),
        D: categoryProfiles.filter(p => p.tier === 'D')
      }

      return {
        category: {
          id: category.id,
          name: category.name,
          slug: category.slug,
          description: category.description,
          weight: category.weight,
          active: category.active,
          createdAt: category.createdAt
        },
        profiles: categoryProfiles,
        totalParticipants: categoryProfiles.length,
        // Use actual tier assignments from database
        tiers: tierGroups
      }
    })

    const result = {
      categories: categoryRankings,
      totalProfiles: profiles.length,
      totalCategories: categories.length
    }

    console.log('✅ Returning result:', result)

    return result

  } catch (error) {
    console.error('❌ Error fetching leaderboard:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch leaderboard data'
    })
  }
})
