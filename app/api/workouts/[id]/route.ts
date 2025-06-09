import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../lib/auth';
import { supabaseAdmin } from '../../../../lib/supabase-admin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const workoutId = params.id;
    console.log('Fetching individual workout:', workoutId, 'for user:', session.user.id);

    // Function to fetch workout with a specific user ID
    const fetchWorkoutForUser = async (userId: string) => {
      const { data: workout, error: workoutError } = await supabaseAdmin
        .from('workout_plans')
        .select(`
          id,
          name,
          description,
          difficulty,
          created_at,
          user_id
        `)
        .eq('id', workoutId)
        .eq('user_id', userId)
        .single();

      return { workout, workoutError };
    };

    // First try to fetch with current session user ID
    let { workout, workoutError } = await fetchWorkoutForUser(session.user.id);

    // If not found, check for alternative user IDs with same email
    if (workoutError || !workout) {
      console.log('Workout not found for current user ID, checking alternative user IDs...');
      
      // Check if there's a user with the same email but different ID
      const { data: userByEmail, error: userError } = await supabaseAdmin
        .from('users')
        .select('id')
        .eq('email', session.user.email)
        .neq('id', session.user.id);

      if (!userError && userByEmail && userByEmail.length > 0) {
        console.log('Found alternative user IDs:', userByEmail.map(u => u.id));
        
        // Try to fetch workout for the alternative user ID
        const altResult = await fetchWorkoutForUser(userByEmail[0].id);
        if (!altResult.workoutError && altResult.workout) {
          workout = altResult.workout;
          workoutError = null;
          console.log('Found workout under alternative user ID:', userByEmail[0].id);
        }
      }
    }

    // Also try checking the workouts table as fallback
    if (workoutError || !workout) {
      console.log('Checking workouts table as fallback...');
      
      const { data: workoutFromWorkoutsTable, error: workoutsTableError } = await supabaseAdmin
        .from('workouts')
        .select(`
          id,
          name,
          description,
          difficulty,
          type,
          duration,
          created_at,
          user_id
        `)
        .eq('id', workoutId)
        .single();

      if (!workoutsTableError && workoutFromWorkoutsTable) {
        // Check if this workout belongs to current user or alternative user
        const workoutUserId = workoutFromWorkoutsTable.user_id;
        if (workoutUserId === session.user.id) {
          workout = workoutFromWorkoutsTable;
          workoutError = null;
          console.log('Found workout in workouts table for current user');
        } else {
          // Check if this belongs to alternative user with same email
          const { data: userByEmail } = await supabaseAdmin
            .from('users')
            .select('id')
            .eq('email', session.user.email)
            .eq('id', workoutUserId)
            .single();

          if (userByEmail) {
            workout = workoutFromWorkoutsTable;
            workoutError = null;
            console.log('Found workout in workouts table for alternative user');
          }
        }
      }
    }

    if (workoutError || !workout) {
      console.error('Error fetching workout:', workoutError);
      return NextResponse.json({ error: 'Workout not found' }, { status: 404 });
    }

    console.log('Successfully found workout:', workout.name, 'for user:', workout.user_id);

    // Then get the exercises for this workout
    const { data: exercises, error: exercisesError } = await supabaseAdmin
      .from('workout_exercises')
      .select(`
        id,
        sets,
        reps,
        instructions,
        tips,
        target_muscles,
        equipment,
        video_url,
        video_start_time,
        video_end_time,
        created_at,
        exercises (
          id,
          name,
          description,
          target_muscles,
          equipment,
          difficulty
        )
      `)
      .eq('workout_plan_id', workoutId)
      .order('created_at', { ascending: true });

    if (exercisesError) {
      console.error('Error fetching exercises:', exercisesError);
      // Continue with empty exercises rather than failing
    }

    console.log('Found exercises for workout:', exercises?.length || 0);

    // Transform the data to match our frontend interface
    const transformedExercises = exercises?.map(workoutExercise => {
      // Get the exercise data (it might be nested)
      const exercise = Array.isArray(workoutExercise.exercises) 
        ? workoutExercise.exercises[0] 
        : workoutExercise.exercises;
      
      return {
        id: workoutExercise.id,
        name: exercise?.name || 'Exercise',
        description: exercise?.description || '',
        sets: workoutExercise.sets,
        reps: workoutExercise.reps,
        instructions: workoutExercise.instructions || [],
        tips: workoutExercise.tips || [],
        targetMuscles: workoutExercise.target_muscles || exercise?.target_muscles || [],
        equipment: workoutExercise.equipment || exercise?.equipment || [],
        videoUrl: workoutExercise.video_url || '',
        videoStartTime: workoutExercise.video_start_time,
        videoEndTime: workoutExercise.video_end_time,
      };
    }) || [];

    const transformedWorkout = {
      id: workout.id,
      name: workout.name,
      description: workout.description,
      duration: (workout as any).duration || '30-45 mins', // Use actual duration if available
      difficulty: workout.difficulty,
      type: (workout as any).type || 'Strength Training', // Use actual type if available
      exercises: transformedExercises
    };

    console.log('Returning transformed workout with', transformedExercises.length, 'exercises');
    return NextResponse.json({ workout: transformedWorkout });
  } catch (error) {
    console.error('Unhandled error fetching workout:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 