import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../lib/auth';
import { supabaseAdmin } from '../../../../lib/supabase-admin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('=== WORKOUT DEBUG INFO ===');
    console.log('Current session user:', {
      id: session.user.id,
      email: session.user.email,
      name: session.user.name
    });

    // Check all users with this email
    const { data: allUsersWithEmail, error: usersError } = await supabaseAdmin
      .from('users')
      .select('id, email, name, created_at')
      .eq('email', session.user.email);

    console.log('All users with this email:', allUsersWithEmail);

    // Check workout_plans for current user
    const { data: currentUserWorkoutPlans, error: currentWorkoutPlansError } = await supabaseAdmin
      .from('workout_plans')
      .select('id, name, user_id, created_at')
      .eq('user_id', session.user.id);

    console.log('Workout plans for current user ID:', currentUserWorkoutPlans);

    // Check workouts table for current user
    const { data: currentUserWorkouts, error: currentWorkoutsError } = await supabaseAdmin
      .from('workouts')
      .select('id, name, user_id, created_at')
      .eq('user_id', session.user.id);

    console.log('Workouts for current user ID:', currentUserWorkouts);

    // Check workout_plans for all users with same email
    let allWorkoutsByEmail: Array<{
      userId: string;
      userCreatedAt: string;
      workoutPlans: any[];
      workouts: any[];
    }> = [];
    
    if (allUsersWithEmail) {
      for (const user of allUsersWithEmail) {
        const { data: userWorkoutPlans } = await supabaseAdmin
          .from('workout_plans')
          .select('id, name, user_id, created_at')
          .eq('user_id', user.id);

        const { data: userWorkouts } = await supabaseAdmin
          .from('workouts')
          .select('id, name, user_id, created_at')
          .eq('user_id', user.id);

        if ((userWorkoutPlans && userWorkoutPlans.length > 0) || (userWorkouts && userWorkouts.length > 0)) {
          allWorkoutsByEmail.push({
            userId: user.id,
            userCreatedAt: user.created_at,
            workoutPlans: userWorkoutPlans || [],
            workouts: userWorkouts || []
          });
        }
      }
    }

    console.log('All workouts by users with same email:', allWorkoutsByEmail);

    return NextResponse.json({
      debug: {
        currentSession: {
          id: session.user.id,
          email: session.user.email,
          name: session.user.name
        },
        allUsersWithEmail: allUsersWithEmail || [],
        currentUserWorkoutPlans: currentUserWorkoutPlans || [],
        currentUserWorkouts: currentUserWorkouts || [],
        allWorkoutsByEmail: allWorkoutsByEmail,
        summary: {
          totalUsersWithEmail: allUsersWithEmail?.length || 0,
          currentUserWorkoutPlansCount: currentUserWorkoutPlans?.length || 0,
          currentUserWorkoutsCount: currentUserWorkouts?.length || 0,
          totalWorkoutsByAllUsers: allWorkoutsByEmail.reduce((sum, user) => 
            sum + (user.workoutPlans?.length || 0) + (user.workouts?.length || 0), 0)
        }
      }
    });
  } catch (error) {
    console.error('Debug endpoint error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 