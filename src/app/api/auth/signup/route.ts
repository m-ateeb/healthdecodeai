import { NextResponse } from 'next/server'
import connectDB from '@/lib/db'
import User from '@/models/User'
import { hashPassword } from '@/lib/hash'
import { generateToken } from '@/lib/auth'

export async function POST(req: Request) {
  try {
    await connectDB()
    const { firstName, lastName, email, password } = await req.json()

    // Validation
    if (!firstName || !lastName || !email || !password) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 })
    }

    if (password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters long' }, { status: 400 })
    }

    // Check if user already exists
    const existing = await User.findOne({ email })
    if (existing) {
      return NextResponse.json({ error: 'User already exists with this email' }, { status: 400 })
    }

    // Hash password and create user
    const hashedPassword = await hashPassword(password)
    const name = `${firstName} ${lastName}`
    
    const user = await User.create({ 
      name, 
      email, 
      password: hashedPassword 
    })

    // Generate token
    const token = generateToken({ 
      id: user._id, 
      email: user.email,
      name: user.name 
    })

    // Set cookie
    const response = NextResponse.json({ 
      message: 'User created successfully', 
      user: {
        id: user._id,
        name: user.name,
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email
      }
    })

    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 // 7 days
    })

    return response
  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
