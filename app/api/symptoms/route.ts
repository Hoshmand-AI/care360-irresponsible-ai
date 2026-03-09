import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { aiService, AIProviderError } from '@/lib/ai'
import prisma from '@/lib/prisma'
import { z } from 'zod'

const symptomSchema = z.object({
  symptoms: z.array(z.string()).min(1, 'At least one symptom is required'),
  duration: z.string().optional(),
  severity: z.string().optional(),
  additionalInfo: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const body = await request.json()
    
    // Validate input
    const result = symptomSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error.errors[0].message },
        { status: 400 }
      )
    }
    
    const { symptoms, duration, severity, additionalInfo } = result.data
    
    // Get user profile for context (if logged in)
    let userContext: any = {}
    if (session?.user?.id) {
      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: {
          dateOfBirth: true,
          sex: true,
          allergies: true,
        },
      })
      
      if (user) {
        if (user.dateOfBirth) {
          const age = Math.floor(
            (Date.now() - user.dateOfBirth.getTime()) / 31557600000
          )
          userContext.age = age
        }
        userContext.sex = user.sex
        userContext.allergies = user.allergies
      }
    }
    
    // Analyze symptoms with AI service
    const analysis = await aiService.analyzeSymptoms({
      symptoms,
      duration,
      severity,
      additionalInfo,
      ...userContext,
    })
    
    // Save to database if user is logged in
    let savedCheck = null
    if (session?.user?.id) {
      savedCheck = await prisma.symptomCheck.create({
        data: {
          userId: session.user.id,
          symptoms,
          duration,
          severity,
          additionalInfo,
          urgencyLevel: analysis.urgencyLevel,
          possibleCauses: analysis.possibleCauses,
          recommendations: analysis.recommendations,
          otcSuggestions: analysis.otcSuggestions,
          warningSignsToWatch: analysis.warningSignsToWatch,
        },
      })
    }
    
    return NextResponse.json({
      success: true,
      data: {
        id: savedCheck?.id,
        ...analysis,
      },
    })
  } catch (error) {
    console.error('Symptom analysis error:', error)
    
    if (error instanceof AIProviderError) {
      return NextResponse.json(
        { success: false, error: `AI service error: ${error.message}` },
        { status: error.statusCode || 500 }
      )
    }
    
    return NextResponse.json(
      { success: false, error: 'Failed to analyze symptoms' },
      { status: 500 }
    )
  }
}

// Get user's symptom check history
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    const checks = await prisma.symptomCheck.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
      take: 20,
    })
    
    return NextResponse.json({
      success: true,
      data: checks,
    })
  } catch (error) {
    console.error('Get symptom history error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to get history' },
      { status: 500 }
    )
  }
}
