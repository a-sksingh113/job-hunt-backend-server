import jwt from 'jsonwebtoken';
export function createToken(user) {
    try {
        if (!process.env.JWT_SECRET) {
            throw new Error('JWT_SECRET is missing in environment variables');
        }
        const payload = {
            id: user.id,
            fullName: user.fullName,
            email: user.email,
            role: user.role,
        };
        return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });
    }
    catch (error) {
        console.error('Error creating token:', error.message);
        return null;
    }
}
export function validateToken(token) {
    try {
        if (!token || !process.env.JWT_SECRET) {
            throw new Error('Token or secret missing');
        }
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        if (typeof payload === 'object' &&
            payload !== null &&
            'id' in payload &&
            'email' in payload &&
            'fullName' in payload &&
            'role' in payload) {
            return payload;
        }
        else {
            throw new Error('Token payload is not a valid UserPayload');
        }
    }
    catch (error) {
        console.error('Error validating token:', error.message);
        return null;
    }
}
