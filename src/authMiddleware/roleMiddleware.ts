import { Request, Response, NextFunction } from 'express';
import { UserPayload } from '../authService/tokenCreateValidate.js'; 

const authorizeRoles = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user as UserPayload | undefined;

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized: User not authenticated',
        });
      }

      if (!roles.includes(user.role)) {
        return res.status(403).json({
          success: false,
          message:
            'Unauthorized Access! You are not authorized to access this resource.',
        });
      }

      next();
    } catch (error: any) {
      console.error(`authorizeRoles error: ${error}`);
      res.status(500).json({
        success: false,
        message: `authorizeRoles error: ${error.message || error}`,
      });
    }
  };
};

export default authorizeRoles;
