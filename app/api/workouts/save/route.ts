import { createClient } from '@supabase/supabase-js';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { authOptions } from '../../../../lib/auth';

// Regular client for user operations
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Service role client for admin operations (bypasses RLS)
const supabaseAdmin = process.env.SUPABASE_SERVICE_ROLE_KEY 
  ? createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
  : null;

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = session.user;

    const workoutData = await request.json();

    // 1. Insert the workout
    const { data: workoutResult, error: workoutError } = await supabase
      .from('workouts')
      .insert({
        user_id: user.id,
        name: workoutData.name,
        description: workoutData.description,
        type: workoutData.type,
        duration: workoutData.duration,
        difficulty: workoutData.difficulty,
      })
      .select()
      .single();

    if (workoutError) {
      console.error('Error creating workout:', workoutError);
      return NextResponse.json({ error: workoutError.message }, { status: 500 });
    }

    // 2. Process each exercise
    for (const exercise of workoutData.exercises) {
      // Check if exercise exists
      let { data: existingExercise } = await supabase
        .from('exercises')
        .select('id')
        .eq('name', exercise.name)
        .single();

      let exerciseId;

      if (!existingExercise) {
        // Create new exercise
        const { data: newExercise, error: exerciseError } = await supabase
          .from('exercises')
          .insert({
            name: exercise.name,
            description: exercise.description,
            target_muscles: exercise.targetMuscles,
            equipment: exercise.equipment,
            difficulty: exercise.difficulty || 'Beginner',
            instructions: exercise.instructions,
            tips: exercise.tips,
            video_url: exercise.videoUrl,
            video_start_time: exercise.videoStartTime,
            video_end_time: exercise.videoEndTime,
          })
          .select()
          .single();

        if (exerciseError) {
          console.error('Error creating exercise:', exerciseError);
          continue;
        }

        exerciseId = newExercise.id;
      } else {
        exerciseId = existingExercise.id;
      }

      // 3. Link exercise to workout using admin client to bypass RLS
      const client = supabaseAdmin || supabase;
      const { error: linkError } = await client
        .from('workout_exercises')
        .insert({
          workout_id: workoutResult.id,
          exercise_id: exerciseId,
          sets: exercise.sets,
          reps: exercise.reps,
          instructions: exercise.instructions,
          tips: exercise.tips,
          target_muscles: exercise.targetMuscles,
          equipment: exercise.equipment,
          video_url: exercise.videoUrl,
          video_start_time: exercise.videoStartTime,
          video_end_time: exercise.videoEndTime,
        });

      if (linkError) {
        console.error('Error linking exercise to workout:', linkError);
      }
    }

    return NextResponse.json({ 
      success: true, 
      workoutId: workoutResult.id 
    });

  } catch (error) {
    console.error('Error saving workout:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
} 