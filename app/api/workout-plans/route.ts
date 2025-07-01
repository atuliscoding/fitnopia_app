import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { supabase } from '../../../lib/supabase-client';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// GET /api/workout-plans - Get all workout plans for the authenticated user
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: workoutPlans, error } = await supabase
      .from('workout_plans')
      .select('*')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching workout plans:', error);
      return NextResponse.json({ error: 'Failed to fetch workout plans' }, { status: 500 });
    }

    return NextResponse.json(workoutPlans);
  } catch (error) {
    console.error('Error in workout plans API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/workout-plans - Create a new workout plan
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    const { name, description, exercises } = data;

    if (!name || !exercises || !Array.isArray(exercises)) {
      return NextResponse.json({ error: 'Invalid workout plan data' }, { status: 400 });
    }

    const { data: workoutPlan, error } = await supabase
      .from('workout_plans')
      .insert({
        user_id: session.user.id,
        name,
        description,
        exercises,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating workout plan:', error);
      return NextResponse.json({ error: 'Failed to create workout plan' }, { status: 500 });
    }

    return NextResponse.json(workoutPlan, { status: 201 });
  } catch (error) {
    console.error('Error in workout plans API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 