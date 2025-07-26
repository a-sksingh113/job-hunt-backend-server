import { serialize } from 'cookie';
const setTokenCookie = (res, token) => {
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
