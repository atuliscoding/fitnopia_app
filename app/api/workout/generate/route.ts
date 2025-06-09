import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/auth.config';
import { supabase } from '../../../../lib/supabase-client';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('fitness_level, fitness_goal')
      .eq('id', session.user.id)
      .single();

    if (profileError) {
      console.error('Error fetching user profile:', profileError);
      return NextResponse.json({ error: 'Failed to fetch user profile' }, { status: 500 });
    }

    const { data: exercises, error: exercisesError } = await supabase
      .from('exercises')
      .select('*')
      .eq('difficulty', profile.fitness_level)
      .eq('category', profile.fitness_goal)
      .limit(5);

    if (exercisesError) {
      console.error('Error fetching exercises:', exercisesError);
      return NextResponse.json({ error: 'Failed to fetch exercises' }, { status: 500 });
    }

    const workout = {
      name: `${profile.fitness_goal} Workout`,
      description: `A ${profile.fitness_level} level workout focusing on ${profile.fitness_goal}`,
      exercises: exercises.map(exercise => ({
        exercise_id: exercise.id,
        sets: 3,
        reps: 12,
        weight: 0,
        rest_time: 60,
        notes: '',
      })),
    };

    return NextResponse.json(workout);
  } catch (error) {
    console.error('Error generating workout:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 