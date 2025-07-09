import { UserPayload } from '../authService/tokenCreateValidate'; 

declare global {
  namespace Express {
    interface Request {
      user?: UserPayload;
    }
  }
}
