import jwt from 'jsonwebtoken';

 export interface UserPayload {
  id: string;
  fullName: string;
  email: string;
  role: 'job_seeker' | 'employer' | 'admin' | 'user';
}

export function createToken(user: UserPayload): string | null {
  try {
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is missing in environment variables');
    }

    const payload: UserPayload = {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
    };

    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });
  } catch (error: any) {
    console.error('Error creating token:', error.message);
    return null;
  }
}

export function validateToken(token: string): UserPayload | null {
  try {
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is missing in environment variables');
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET) as UserPayload;
    return payload;
  } catch (error: any) {
    console.error('Error validating token:', error.message);
    return null;
  }
}
