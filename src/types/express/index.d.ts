import { UserPayload } from "../../authService/tokenCreateValidate.js";

declare global {
  namespace Express {
    interface Request {
      user?: UserPayload;
    }
  }
}

