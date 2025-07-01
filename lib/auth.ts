import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import GitHubProvider from 'next-auth/providers/github';
import CredentialsProvider from 'next-auth/providers/credentials';
import { supabase } from './supabase-client';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

if (!process.env.NEXTAUTH_SECRET) {
  throw new Error('Please provide process.env.NEXTAUTH_SECRET');
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: 'openid email profile',
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code'
        }
      },
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
        }
      }
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Please enter your email and password');
        }

        try {
          // Authenticate with Supabase
          const { data, error } = await supabase.auth.signInWithPassword({
            email: credentials.email,
            password: credentials.password,
          });

          if (error || !data.user) {
            throw new Error('Invalid email or password');
          }

          return {
            id: data.user.id,
            email: data.user.email!,
            name: data.user.user_metadata?.full_name || data.user.email,
            image: null,
          };
        } catch (error) {
          if (error instanceof Error) {
            throw new Error(error.message);
          }
          throw new Error('An error occurred during sign in');
        }
      }
    }),
  ],
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      console.log('SignIn callback triggered:', { 
        provider: account?.provider, 
        userEmail: user.email,
        profileSub: (profile as any)?.sub
      });
      
      // Allow OAuth sign-ins and credentials sign-ins
      if (account?.provider === 'google' || account?.provider === 'github') {
        try {
          // Temporarily skip database operations to test OAuth flow
          console.log('OAuth sign-in successful for:', user.email);
          console.log('Database operations skipped for testing');
          return true;
          
          /* Commented out for testing - uncomment when database is fixed
          // Check if user exists in Prisma database
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email! }
          });

          // If user doesn't exist, create them in both Prisma and Supabase
          if (!existingUser) {
            console.log('Creating new user:', user.email);
            // Create user in Prisma
            await prisma.user.create({
              data: {
                email: user.email!,
                name: user.name || profile?.name || '',
                provider: account.provider,
                googleId: account.provider === 'google' ? account.providerAccountId : null,
                githubId: account.provider === 'github' ? account.providerAccountId : null,
              }
            });

            // Create user in Supabase as well for consistency
            try {
              await supabase.auth.admin.createUser({
                email: user.email!,
                password: Math.random().toString(36).slice(-8), // Random password for OAuth users
                email_confirm: true,
                user_metadata: {
                  full_name: user.name || profile?.name || '',
                  provider: account.provider,
                },
              });
            } catch (supabaseError) {
              // If user already exists in Supabase, that's fine
              console.log('User may already exist in Supabase:', supabaseError);
            }
          } else {
            console.log('User already exists:', user.email);
            // Update the provider info if the user signed in with a new provider
            const updateData: any = {};
            if (account.provider === 'google' && !existingUser.googleId) {
              updateData.googleId = account.providerAccountId;
            }
            if (account.provider === 'github' && !existingUser.githubId) {
              updateData.githubId = account.providerAccountId;
            }
            
            if (Object.keys(updateData).length > 0) {
              await prisma.user.update({
                where: { id: existingUser.id },
                data: updateData
              });
            }
          }
          */
          
        } catch (error) {
          console.error('OAuth sign-in error:', error);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
      }
      if (account) {
        token.accessToken = account.access_token;
        token.provider = account.provider;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      console.log('Redirect callback triggered:', { url, baseUrl });
      
      // Always redirect to dashboard after successful OAuth authentication
      if (url.includes('/api/auth/callback/google') || 
          url.includes('/api/auth/callback/github') ||
          url === `${baseUrl}/dashboard` ||
          url === '/dashboard') {
        console.log('Redirecting to dashboard');
        return `${baseUrl}/dashboard`;
      }
      
      // If it's a relative URL, make it absolute
      if (url.startsWith('/')) {
        const fullUrl = `${baseUrl}${url}`;
        console.log('Making relative URL absolute:', fullUrl);
        return fullUrl;
      }
      
      // If it's an absolute URL on the same domain, allow it
      if (url.startsWith(baseUrl)) {
        console.log('Allowing same-domain URL:', url);
        return url;
      }
      
      // Otherwise, redirect to dashboard as default
      console.log('Default redirect to dashboard');
      return `${baseUrl}/dashboard`;
    },
  },
  events: {
    async signIn({ user, account }) {
      console.log('SignIn event triggered:', { 
        user: user?.email, 
        provider: account?.provider 
      });
    },
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: true,
};

export const getAuthSession = async () => {
  const session = await fetch('/api/auth/session');
  return session.json();
};