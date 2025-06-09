import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../lib/auth';
import { supabaseAdmin } from '../../../lib/supabase-admin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('Fetching workouts for user ID:', session.user.id);

    // Get user's saved workouts from database - simplified query first
    const { data: workouts, error } = await supabaseAdmin
      .from('workout_plans')
      .select(`
        id,
        name,
        description,
        difficulty,
        created_at
      `)
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching workouts:', error);
      return NextResponse.json({ error: 'Failed to fetch workouts' }, { status: 500 });
    }

    console.log('Found workouts from workout_plans:', workouts?.length || 0);

    // Also check the workouts table as a fallback
    const { data: workoutsFromWorkoutsTable, error: workoutsTableError } = await supabaseAdmin
      .from('workouts')
      .select(`
        id,
        name,
        description,
        difficulty,
        type,
        duration,
        created_at
      `)
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false });

    if (workoutsTableError) {
      console.error('Error fetching from workouts table:', workoutsTableError);
    } else {
      console.log('Found workouts from workouts table:', workoutsFromWorkoutsTable?.length || 0);
    }

    // If no workouts found in workout_plans, check if user has a different ID in the database
    if (!workouts || workouts.length === 0) {
      console.log('No workouts found for current user ID, checking for user with same email...');
      
      // Check if there's a user with the same email but different ID
      const { data: userByEmail, error: userError } = await supabaseAdmin
        .from('users')
        .select('id')
        .eq('email', session.user.email)
        .neq('id', session.user.id);

      if (!userError && userByEmail && userByEmail.length > 0) {
        console.log('Found user with same email but different ID:', userByEmail.map(u => u.id));
        
        // Try to fetch workouts for the alternative user ID
        const { data: alternativeWorkouts, error: altError } = await supabaseAdmin
          .from('workout_plans')
          .select(`
            id,
            name,
            description,
            difficulty,
            created_at
          `)
          .eq('user_id', userByEmail[0].id)
          .order('created_at', { ascending: false });

        if (!altError && alternativeWorkouts && alternativeWorkouts.length > 0) {
          console.log('Found workouts under alternative user ID:', alternativeWorkouts.length);
          
          // Transform and return these workouts
          const transformedWorkouts = alternativeWorkouts.map(workout => ({
            id: workout.id,
            name: workout.name,
            description: workout.description,
            duration: '30-45 mins',
            difficulty: workout.difficulty,
            type: 'Strength Training',
            exercises: []
          }));

          return NextResponse.json({ workouts: transformedWorkouts });
        }
      }
    }

    // Combine workouts from both tables
    let allWorkouts = [...(workouts || [])];
    
    if (workoutsFromWorkoutsTable && workoutsFromWorkoutsTable.length > 0) {
      const transformedWorkoutsTableData = workoutsFromWorkoutsTable.map(workout => ({
        id: workout.id,
        name: workout.name,
        description: workout.description,
        difficulty: workout.difficulty,
        created_at: workout.created_at
      }));
      allWorkouts = [...allWorkouts, ...transformedWorkoutsTableData];
    }

    // For now, let's return the workouts without exercises
    // We'll fetch exercises separately if needed
    const transformedWorkouts = allWorkouts.map(workout => ({
      id: workout.id,
      name: workout.name,
      description: workout.description,
      duration: '30-45 mins', // Default duration since column doesn't exist
      difficulty: workout.difficulty,
      type: 'Strength Training', // Default type since column doesn't exist
      exercises: [] // Empty for now - will be populated separately
    }));

    console.log('Returning transformed workouts:', transformedWorkouts.length);
    return NextResponse.json({ workouts: transformedWorkouts });
  } catch (error) {
    console.error('Unhandled error fetching workouts:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 