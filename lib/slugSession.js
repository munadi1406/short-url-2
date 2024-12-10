import { withIronSession } from 'iron-session/next';

const sessionOptions = {
  password: process.env.SESSION_SECRET || 'complex_password_at_least_32_characters_long',
  cookieName: 'myapp_session',
  cookieOptions: {
    maxAge: 1000 * 60 * 60 * 24, // Cookie bertahan 1 hari
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
  },
};

export function withSession(handler) {
  return withIronSession(handler, sessionOptions);
}
