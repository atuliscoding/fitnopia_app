import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../lib/auth';
import { supabaseAdmin } from '../../../lib/supabase-admin';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const {
      session_id,
      workout_exercise_id,
      exercise_name,
      sets_completed,
      reps_completed,
      weight_used,
      duration_seconds,
      difficulty_rating,
      notes
    } = await request.json();

    // Get user ID
    const { data: userData, error: userError } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('email', session.user.email)
      .single();

    if (userError || !userData) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Insert exercise performance record
    const { data, error } = await supabaseAdmin
      .from('exercise_performance')
      .insert({
        user_id: userData.id,
        session_id,
        workout_exercise_id,
        exercise_name,
        sets_completed: sets_completed || 0,
        reps_completed: reps_completed || 0,
        weight_used: weight_used || 0,
        duration_seconds: duration_seconds || 0,
        difficulty_rating,
        notes: notes || ''
      })
      .select()
      .single();

    if (error) {
      console.error('Error saving exercise performance:', error);
      return NextResponse.json({ error: 'Failed to save exercise performance' }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error in exercise performance API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('session_id');
    const limit = parseInt(searchParams.get('limit') || '50');

    // Get user ID
    const { data: userData, error: userError } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('email', session.user.email)
      .single();

    if (userError || !userData) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    let query = supabaseAdmin
      .from('exercise_performance')
      .select('*')
      .eq('user_id', userData.id)
      .order('completed_at', { ascending: false })
      .limit(limit);

    if (sessionId) {
      query = query.eq('session_id', sessionId);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching exercise performance:', error);
      return NextResponse.json({ error: 'Failed to fetch exercise performance' }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error in exercise performance API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 