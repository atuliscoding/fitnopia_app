import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { supabase } from '../../../lib/supabase-client';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// GET /api/profile - Get the user's profile
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single();

    if (error) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    return NextResponse.json(profile);
  } catch (error) {
    console.error('Error fetching profile:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    const { full_name, email, current_password, new_password } = data;

    // If password change is requested
    if (current_password && new_password) {
      const { error: passwordError } = await supabase.auth.updateUser({
        password: new_password,
      });

      if (passwordError) {
        return NextResponse.json({ error: 'Failed to update password' }, { status: 500 });
      }
    }

    // Update profile information
    const { error: profileError } = await supabase
      .from('profiles')
      .update({
        full_name: full_name || undefined,
        email: email || undefined,
        updated_at: new Date().toISOString(),
      })
      .eq('id', session.user.id);

    if (profileError) {
      return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}