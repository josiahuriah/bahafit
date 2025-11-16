import { NextRequest, NextResponse } from 'next/server'
import { createUser } from '@/lib/db/models/user'
import { z } from 'zod'

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  role: z.enum(['user', 'business_owner', 'event_organizer']).optional(),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    // Validate input
    const validationResult = registerSchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: validationResult.error.format(),
        },
        { status: 400 }
      )
    }

    const { name, email, password, role } = validationResult.data

    // Create user
    const user = await createUser({
      name,
      email,
      password,
      role: role || 'user',
    })

    return NextResponse.json(
      {
        message: 'User created successfully',
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('Registration error:', error)

    if (error.message.includes('already exists')) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to create user. Please try again.' },
      { status: 500 }
    )
  }
}
