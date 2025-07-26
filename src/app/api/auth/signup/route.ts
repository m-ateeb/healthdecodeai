import { NextResponse } from 'next/server'
import connectDB from '@/lib/db'
import User from '@/models/User'
import { hashPassword } from '@/lib/hash'
import { generateToken } from '@/lib/auth'

export async function POST(req: Request) {
  try {
    console.log('Signup attempt - Environment check:', {
      hasMongoUri: !!process.env.MONGODB_URI,
      hasJwtSecret: !!process.env.JWT_SECRET,
      nodeEnv: process.env.NODE_ENV
    })
    
    await connectDB()
    const { firstName, lastName, email, password } = await req.json()
    
    console.log('Signup attempt for email:', email)

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
      firstName,
      lastName,
      email, 
      password: hashedPassword 
    })

    // Generate token
    const token = generateToken({ 
      userId: user._id.toString(), // Use userId instead of id, and convert to string
      email: user.email,
      name: user.name 
    })

    // Set cookie
    const response = NextResponse.json({ 
      message: 'User created successfully', 
      user: {
        id: user._id,
        name: user.name,
        firstName: user.firstName || firstName,
        lastName: user.lastName || lastName,
        email: user.email
      }
    })

    response.cookies.set('token', token, {
      httpOnly: true,
      secure: false, // Set to false for development (localhost)
      sameSite: 'lax', // Change to 'lax' for better localhost compatibility
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/',
      domain: undefined // Don't set domain for localhost
    })

    return response
  } catch (error) {
    console.error('Signup error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : 'UnknownError',
      error: error
    })
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
