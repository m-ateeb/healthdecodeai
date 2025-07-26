import { Resend } from 'resend';
import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { generateResetToken } from '@/lib/resendtoken';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    console.log('Forgot password attempt - Environment check:', {
      hasResendKey: !!process.env.RESEND_API_KEY,
      hasResendFromEmail: !!process.env.RESEND_FROM_EMAIL,
      hasBaseUrl: !!process.env.NEXT_PUBLIC_APP_URL,
      nodeEnv: process.env.NODE_ENV
    })

    await connectDB();
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    console.log('Password reset requested for:', email);

    // Look up user by email
    const user = await User.findOne({ email });

    if (!user) {
      // For security, don't reveal if user exists
      return NextResponse.json({ message: "If an account with that email exists, a reset link has been sent." }, { status: 200 });
    }

    const token = generateResetToken(user._id.toString());
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const resetLink = `${baseUrl}/reset-password?token=${token}`;

    const fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';

    await resend.emails.send({
      from: `HealthDecodeAI <${fromEmail}>`,
      to: user.email,
      subject: 'Reset your HealthDecodeAI password',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Reset Your Password</h2>
          <p>Hello ${user.name},</p>
          <p>We received a request to reset your password for your HealthDecodeAI account.</p>
          <p>Click the button below to reset your password:</p>
          <a href="${resetLink}" style="display: inline-block; background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 16px 0;">Reset Password</a>
          <p>If you didn't request this password reset, please ignore this email.</p>
          <p>This link will expire in 1 hour for security reasons.</p>
          <hr style="margin: 24px 0; border: none; border-top: 1px solid #e5e7eb;">
          <p style="color: #6b7280; font-size: 14px;">Best regards,<br>The HealthDecodeAI Team</p>
        </div>
      `,
    });

    return NextResponse.json({ message: 'Password reset email sent! Check your inbox.' });
  } catch (error) {
    console.error('Forgot password error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : 'UnknownError',
      error: error
    });
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
