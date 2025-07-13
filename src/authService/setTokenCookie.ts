import { serialize } from 'cookie';
import { Response } from 'express';


const setTokenCookie = (res: Response, token: string): void => {
  const cookie = serialize('token', token, {
    httpOnly: true,
    secure: true, 
    sameSite: 'none',
    path: '/',
    maxAge: 60 * 60 * 24, 
  });

  res.setHeader('Set-Cookie', cookie);
};

export default setTokenCookie;
