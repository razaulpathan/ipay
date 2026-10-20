import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { NextRequest, NextResponse } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET || 'ipay_jwt_production_secret_key_2026_super_secure';

export interface UserTokenPayload {
  userId: string;
  phone: string;
  role: 'USER';
}

export interface AdminTokenPayload {
  adminId: string;
  username: string;
  role: 'SUPER_ADMIN' | 'SUPPORT_AGENT' | 'FINANCE_OPERATOR';
}

export function signUserToken(payload: UserTokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function signAdminToken(payload: AdminTokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });
}

export function verifyToken(token: string): any {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return null;
  }
}

export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, 10);
}

export async function comparePassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}

export function extractAuthToken(req: NextRequest): string | null {
  const authHeader = req.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }

  // Also check cookies (for web admin)
  const cookieToken = req.cookies.get('ipay_token')?.value;
  if (cookieToken) return cookieToken;

  const adminCookie = req.cookies.get('ipay_admin_token')?.value;
  if (adminCookie) return adminCookie;

  return null;
}

export function getUserFromRequest(req: NextRequest): UserTokenPayload | null {
  const token = extractAuthToken(req);
  if (!token) return null;
  const decoded = verifyToken(token);
  if (decoded && decoded.role === 'USER') {
    return decoded as UserTokenPayload;
  }
  return null;
}

export function getAdminFromRequest(req: NextRequest): AdminTokenPayload | null {
  const token = extractAuthToken(req);
  if (!token) return null;
  const decoded = verifyToken(token);
  if (decoded && (decoded.role === 'SUPER_ADMIN' || decoded.role === 'FINANCE_OPERATOR' || decoded.role === 'SUPPORT_AGENT')) {
    return decoded as AdminTokenPayload;
  }
  return null;
}
