import { Request, Response, NextFunction } from 'express';
import { parse } from 'cookie';
import { validateToken } from '../authService/tokenCreateValidate';

const authenticationToken = (req: Request, res: Response, next: NextFunction): void => {
  try {
    let token: string | undefined;

    console.log(" Incoming request headers:", req.headers);

    // Check cookies
    if (req.headers.cookie) {
      const parsedCookies = parse(req.headers.cookie);
      token = parsedCookies.token;
      console.log(" Token from cookie:", token);
    }

    // Check Authorization header (Bearer token)
    if (!token && req.headers.authorization?.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
      console.log(" Token from Authorization header:", token);
    }

    // Token not found
    if (!token) {
      console.warn(" No token found");
      res.status(401).json({ error: 'No token found. Please login.' });
      return;
    }

    // Validate token
    const userPayload = validateToken(token);
    if (!userPayload) {
      console.warn(" Invalid or expired token");
      res.status(401).json({ error: 'Invalid or expired token.' });
      return;
    }

    console.log(" Token validated, user:", userPayload);

    // Assign to req.user (custom typing must be in place)
    req.user = userPayload;

    next();
  } catch (error: any) {
    console.error(' Auth middleware error:', error.message);
    res.status(500).json({ error: 'Authentication failed.' });
  }
};

export default authenticationToken;
