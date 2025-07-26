import { serialize } from 'cookie';
const clearTokenCookie = (res) => {
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
