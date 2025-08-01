import { NextResponse } from 'next/server'
import connectDB from '@/lib/db'
import User from '@/models/User'
import { comparePasswords } from '@/lib/hash'
import { generateToken } from '@/lib/auth'

export async function POST(req: Request) {
  try {
    console.log('Login attempt - Environment check:', {
      hasMongoUri: !!process.env.MONGODB_URI,
      hasJwtSecret: !!process.env.JWT_SECRET,
      nodeEnv: process.env.NODE_ENV
    })
    
    await connectDB()
    const { email, password } = await req.json()
    
    console.log('Login attempt for email:', email)

    // Validation
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })
    }

    // Find user
    const user = await User.findOne({ email })
    console.log('User found:', !!user)
    if (!user) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
    }

    // Verify password
    const isValid = await comparePasswords(password, user.password)
    console.log('Password valid:', isValid)
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
    }

    // Generate token
    const token = generateToken({ 
      userId: user._id.toString(), // Use userId instead of id, and convert to string
      email: user.email,
      name: user.name 
    })
    
    console.log('Token generated successfully:', {
      userId: user._id.toString(),
      tokenLength: token.length,
      email: user.email
    })

    // Set cookie and return user data
    const response = NextResponse.json({
      message: 'Login successful',
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
      secure: false, // Set to false for development (localhost)
      sameSite: 'lax', // Change to 'lax' for better localhost compatibility
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/',
      domain: undefined // Don't set domain for localhost
    })

    return response
  } catch (error) {
    console.error('Login error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : 'UnknownError',
      error: error
    })
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
