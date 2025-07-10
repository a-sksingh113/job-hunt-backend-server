import { Request, Response, NextFunction } from 'express';
import { parse } from 'cookie';
import { validateToken } from '../authService/tokenCreateValidate';

interface AuthenticatedRequest extends Request {
  user?: any; 
}

const authenticationToken = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  try {
    let token: string | undefined;

  
    if (req.headers.cookie) {
      const parsedCookies = parse(req.headers.cookie);
      token = parsedCookies.token;
    }

  
    if (!token && req.headers.authorization?.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

 
    if (!token) {
      res.status(401).json({ error: 'No token found. Please login.' });
      return;
    }


    const userPayload = validateToken(token);
    if (!userPayload) {
      res.status(401).json({ error: 'Invalid or expired token.' });
      return;
    }

   
    req.user = userPayload;
    next();
  } catch (error: any) {
    console.error('Auth error:', error.message);
    res.status(500).json({ error: 'Authentication failed.' });
  }
};

export default authenticationToken;
