import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    // Clear existing data
    await prisma.score.deleteMany()
    await prisma.category.deleteMany()
    await prisma.profile.deleteMany()

    // Create profiles
    const profiles = await prisma.profile.createMany({
      data: [
        {
          name: 'Alex Johnson',
          nickname: 'AJ',
          photoUrl: '/avatars/alex.jpg',
          bio: 'Always the life of the party with incredible humor'
        },
        {
          name: 'Sarah Chen',
          nickname: 'Sare',
          photoUrl: '/avatars/sarah.jpg',
          bio: 'Most reliable friend you can count on anytime'
        },
        {
          name: 'Marcus Rivera',
          nickname: 'Marky',
          photoUrl: '/avatars/marcus.jpg',
          bio: 'Fashion icon with impeccable style sense'
        },
        {
          name: 'Priya Patel',
          nickname: 'Pree',
          photoUrl: '/avatars/priya.jpg',
          bio: 'Creative genius with amazing ideas'
        },
        {
          name: 'Jamal Wright',
          nickname: 'Jams',
          photoUrl: '/avatars/jamal.jpg',
          bio: 'Meme lord and digital culture expert'
        },
        {
          name: 'Emily Davis',
          nickname: 'Em',
          photoUrl: '/avatars/emily.jpg',
          bio: 'Always on time and incredibly organized'
        }
      ]
    })

    // Create categories
    const categories = await prisma.category.createMany({
      data: [
        {
          name: 'Humor',
          slug: 'humor',
          description: 'Brings laughter and joy to the squad',
          weight: 2
        },
        {
          name: 'Reliability',
          slug: 'reliability',
          description: 'Always there when you need them',
          weight: 3
        },
        {
          name: 'Party Energy',
          slug: 'party-energy',
          description: 'Life of the party and energy booster',
          weight: 2
        },
        {
          name: 'Style',
          slug: 'style',
          description: 'Fashion sense and personal style',
          weight: 1
        },
        {
          name: 'Meme Lord',
          slug: 'meme-lord',
          description: 'Master of internet culture and memes',
          weight: 2
        },
        {
          name: 'Timekeeper',
          slug: 'timekeeper',
          description: 'Always punctual and organized',
          weight: 1
        },
        {
          name: 'Creative Spark',
          slug: 'creative-spark',
          description: 'Brings innovative ideas and creativity',
          weight: 2
        },
        {
          name: 'Travel Buddy',
          slug: 'travel-buddy',
          description: 'Perfect companion for adventures',
          weight: 2
        }
      ]
    })

    // Get all created records
    const allProfiles = await prisma.profile.findMany()
    const allCategories = await prisma.category.findMany()

    // Create scores with some intentional patterns for demo
    for (const profile of allProfiles) {
      for (const category of allCategories) {
        let score = Math.floor(Math.random() * 5) + 1
        
        // Create some intentional high scores for demo purposes
        if (profile.nickname === 'AJ' && category.slug === 'humor') score = 5
        if (profile.nickname === 'Sare' && category.slug === 'reliability') score = 5
        if (profile.nickname === 'Marky' && category.slug === 'style') score = 5
        if (profile.nickname === 'Pree' && category.slug === 'creative-spark') score = 5
        if (profile.nickname === 'Jams' && category.slug === 'meme-lord') score = 5
        if (profile.nickname === 'Em' && category.slug === 'timekeeper') score = 5

        await prisma.score.create({
          data: {
            profileId: profile.id,
            categoryId: category.id,
            value: score
          }
        })
      }
    }

    return {
      success: true,
      message: 'Database seeded successfully!'
    }
  } catch (error) {
    console.error('Error seeding database:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to seed database'
    })
  }
})
