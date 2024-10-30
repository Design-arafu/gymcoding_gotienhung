import bcrypt from 'bcryptjs';
import NextAuth, { NextAuthConfig } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google'

import dbConnect from './dbConnect';
import UserModel from './models/UserModel';
import { signInWithOauth, getUserByEmail } from './actions/auth.action';

export const config: NextAuthConfig = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    }),
    CredentialsProvider({
      credentials: {
        email: {
          type: 'email',
        },
        password: {
          type: 'password',
        },
      },
      async authorize(credentials) {
        await dbConnect();
        if (credentials === null) return null;

        const user = await UserModel.findOne({ email: credentials.email });

        if (user) {
          const isMatch = await bcrypt.compare(
            credentials.password as string,
            user.password,
          );
          if (isMatch) {
            return user;
          }
        }
        return null;
      },
    }),
  ],
  // custom pages for sign in and register
  pages: {
    signIn: '/signin',
    newUser: '/register',
    error: '/error',
  },
  callbacks: {
    async signIn({ account, profile }) {
      if ( account?.provider === 'google' && profile ) {
        return await signInWithOauth({ account, profile })
      }
      return true
    },
    async jwt({ trigger, session, token }: any) {
      if (token.email) {

        const user = await getUserByEmail({ email: token.email })

        token.user = {
          _id: user._id,
          email: user.email,
          name: user.name,
          isAdmin: user.isAdmin,
          provider: user.provider
        };
      }
      if (trigger === 'update' && session) {
        token.user = {
          ...token.user,
          email: session.user.email,
          name: session.user.name,
          isAdmin: session.user.isAdmin,
          provider: session.user.provider
        };
      }
      return token;
    },
    session: async ({ session, token }: any) => {
      if (token) {
        session = {
          ...session,
          user: {
            ...session.user,
            _id: token.user._id,
            email: token.user.email,
            isAdmin: token.user.isAdmin,
            provider: token.user.provider
          },
        }
      }
      return session;
    },
  },
};

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth(config);
