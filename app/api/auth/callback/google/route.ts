import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { SignJWT } from 'jose';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    console.log('Google OAuth callback called');
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');
    
    console.log('Callback params:', { code: !!code, state, error });
    
    // Check for OAuth errors from Google
    if (error) {
      console.error('Google OAuth error:', error);
      return NextResponse.redirect('/auth/signin?error=google_oauth_error');
    }
    
    if (!code) {
      console.error('No authorization code received');
      return NextResponse.redirect('/auth/signin?error=no_code');
    }
    
    // Verify state parameter
    const storedState = request.cookies.get('oauth_state')?.value;
    console.log('State verification:', { received: state, stored: storedState });
    
    if (!state || !storedState || state !== storedState) {
      console.error('State mismatch');
      return NextResponse.redirect('/auth/signin?error=state_mismatch');
    }
    
    console.log('Exchanging code for tokens...');
    
    // Exchange code for tokens
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        code,
        grant_type: 'authorization_code',
        redirect_uri: `${process.env.NEXTAUTH_URL}/api/auth/callback/google`,
      }),
    });
    
    const tokens = await tokenResponse.json();
    console.log('Token response status:', tokenResponse.status);
    
    if (!tokenResponse.ok) {
      console.error('Token exchange failed:', tokens);
      return NextResponse.redirect('/auth/signin?error=token_exchange');
    }
    
    console.log('Getting user info...');
    
    // Get user info from Google
    const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        Authorization: `Bearer ${tokens.access_token}`,
      },
    });
    
    const googleUser = await userResponse.json();
    console.log('User info response status:', userResponse.status);
    
    if (!userResponse.ok) {
      console.error('User info fetch failed:', googleUser);
      return NextResponse.redirect('/auth/signin?error=user_info');
    }
    
    console.log('Google user:', { email: googleUser.email, name: googleUser.name });
    
    // Check if user exists in our database
    let user = await prisma.user.findUnique({
      where: { email: googleUser.email }
    });
    
    console.log('Existing user found:', !!user);
    
    // If user doesn't exist, create them
    if (!user) {
      console.log('Creating new user...');
      user = await prisma.user.create({
        data: {
          email: googleUser.email,
          name: googleUser.name,
          provider: 'google',
          googleId: googleUser.id,
        }
      });
    } else if (!user.googleId) {
      console.log('Updating existing user with Google ID...');
      // Update existing user with Google ID
      user = await prisma.user.update({
        where: { id: user.id },
        data: { googleId: googleUser.id }
      });
    }
    
    console.log('Creating session token...');
    
    // Create a NextAuth compatible session token
    const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET);
    const token = await new SignJWT({
      id: user.id,
      email: user.email,
      name: user.name,
      provider: 'google'
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('30d')
      .sign(secret);
    
    console.log('Setting session cookie and redirecting to dashboard...');
    
    // Set the session cookie
    const response = NextResponse.redirect('/dashboard');
    response.cookies.set('next-auth.session-token', token, {
      httpOnly: true,
      secure: false, // Set to true in production
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60 // 30 days
    });
    
    // Clear the state cookie
    response.cookies.delete('oauth_state');
    
    return response;
  } catch (error) {
    console.error('Google OAuth callback error:', error);
    return NextResponse.redirect('/auth/signin?error=callback_error');
  }
}
