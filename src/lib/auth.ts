// src/lib/auth.ts
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  console.error('JWT_SECRET environment variable is not set');
  throw new Error('JWT_SECRET is required');
}

export function generateToken(payload: object) {
  return jwt.sign(payload, JWT_SECRET as string, { expiresIn: '7d' });
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET as string);
  } catch (err) {
    return null;
  }
}

/**
 * For use in API routes or server components to extract user info from cookie
 */
export async function getUserFromCookie() {
  const token = (await cookies()).get('token')?.value;
  if (!token) return null;

  const user = verifyToken(token);
  return user || null;
}

/**
 * For use in API routes with NextRequest
 */
export function getUserFromRequest(req: NextRequest) {
  const token = req.cookies.get('token')?.value;
  if (!token) return null;

  const user = verifyToken(token);
  return user || null;
}

/**
 * Enforce auth in server code (API or Server Component)
 * Throws if not authenticated
 */
export function requireAuth() {
  const user = getUserFromCookie();
  if (!user) {
    throw new Error('Unauthorized');
  }
  return user;
}
