import { serialize } from 'cookie';
import { Response } from 'express';

const clearTokenCookie = (res: Response): void => {
  const expiredCookie = serialize('token', '', {
    httpOnly: true,
    secure: false,
    sameSite: 'lax',
    path: '/',
    expires: new Date(0), 
  });

  res.setHeader('Set-Cookie', expiredCookie);
};

export default clearTokenCookie;
