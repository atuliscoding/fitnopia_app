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
      overall_rating,
      difficulty_rating,
      enjoyment_rating,
      energy_level_before,
      energy_level_after,
      workout_duration_minutes,
      exercises_completed,
      exercises_skipped,
      favorite_exercise,
      least_favorite_exercise,
      improvements_suggested,
      additional_notes,
      would_repeat
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

    // Insert workout feedback
    const { data, error } = await supabaseAdmin
      .from('workout_feedback')
      .insert({
        user_id: userData.id,
        session_id,
        overall_rating,
        difficulty_rating,
        enjoyment_rating,
        energy_level_before,
        energy_level_after,
        workout_duration_minutes: workout_duration_minutes || 0,
        exercises_completed: exercises_completed || 0,
        exercises_skipped: exercises_skipped || 0,
        favorite_exercise: favorite_exercise || '',
        least_favorite_exercise: least_favorite_exercise || '',
        improvements_suggested: improvements_suggested || '',
        additional_notes: additional_notes || '',
        would_repeat: would_repeat !== undefined ? would_repeat : true
      })
      .select()
      .single();

    if (error) {
      console.error('Error saving workout feedback:', error);
      return NextResponse.json({ error: 'Failed to save workout feedback' }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error in workout feedback API:', error);
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
    const limit = parseInt(searchParams.get('limit') || '20');

    // Get user ID
    const { data: userData, error: userError } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('email', session.user.email)
      .single();

    if (userError || !userData) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const { data, error } = await supabaseAdmin
      .from('workout_feedback')
      .select('*')
      .eq('user_id', userData.id)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching workout feedback:', error);
      return NextResponse.json({ error: 'Failed to fetch workout feedback' }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error in workout feedback API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 