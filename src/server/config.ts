import path from 'path';

export const isProduction = process.env.NODE_ENV === 'production';
export const buildLocation = path.resolve('./dist/src/client');
export const port = process.env.NODE_ENV || isProduction ? 3000 : 3001;
export const fbAppID = process.env.FB_APP_ID || '';
export const fbSecret = process.env.FB_SECRET || '';
export const fbRedirectURI = isProduction
    ? 'https://floraccounting.pohy.eu/login/fb'
    : `https://localhost:3000/login/fb`;
export const fbAPI = 'https://graph.facebook.com/v3.0';
export const jwtSecret = process.env.JWT_SECRET || '';
export const downloadPath = path.resolve('./download');

if (!fbAppID) {
    throw new Error('FB_APP_ID is not set');
}
if (!fbSecret) {
    throw new Error('FB_SECRET is not set');
}

if (!jwtSecret) {
    throw new Error('JWT_SECRET is not set');
}
