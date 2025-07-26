import { parse } from 'cookie';
import { validateToken } from '../authService/tokenCreateValidate.js';
const authenticationToken = (req, res, next) => {
    try {
        let token;
        if (req.headers.cookie) {
            const parsedCookies = parse(req.headers.cookie);
            token = parsedCookies.token;
        }
        if (!token && req.headers.authorization?.startsWith('Bearer ')) {
            token = req.headers.authorization.split(' ')[1];
        }
        if (!token) {
            console.warn(" No token found");
            res.status(401).json({ error: 'No token found. Please login.' });
            return;
        }
        const userPayload = validateToken(token);
        if (!userPayload) {
            console.warn(" Invalid or expired token");
            res.status(401).json({ error: 'Invalid or expired token.' });
            return;
        }
        req.user = userPayload;
        next();
    }
    catch (error) {
        console.error(' Auth middleware error:', error.message);
        res.status(500).json({ error: 'Authentication failed.' });
    }
};
export default authenticationToken;
