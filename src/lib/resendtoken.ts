// src/lib/token.ts
import jwt from 'jsonwebtoken';

export function generateResetToken(userId: string) {
  return jwt.sign({ id: userId }, process.env.RESET_SECRET!, { expiresIn: '15m' });
}

export function verifyResetToken(token: string): { id: string } | null {
  try {
    return jwt.verify(token, process.env.RESET_SECRET!) as { id: string };
  } catch {
    return null;
  }
}
