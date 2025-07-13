import { serialize } from 'cookie';
import { Response } from 'express';

const clearTokenCookie = (res: Response): void => {
  const expiredCookie = serialize('token', '', {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    path: '/',
    expires: new Date(0), 
  });
  res.setHeader('Set-Cookie', expiredCookie);
};

export default clearTokenCookie;
