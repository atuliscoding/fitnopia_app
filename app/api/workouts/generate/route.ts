import { NextResponse } from 'next/server';
import { generateWorkoutPlan, validateWorkoutPlan } from '../../../../lib/gemini';
import { saveGeneratedWorkout } from '../../../../lib/db';
import { WorkoutPreferences } from '../../../../lib/gemini';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../lib/auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let preferences: WorkoutPreferences;
    try {
      const body = await request.json();
      // Handle both direct preferences and nested preferences structure
      preferences = body.preferences || body;
    } catch (error) {
      console.error('Error parsing request body:', error);
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      );
    }

    // No validation needed - all WorkoutPreferences fields are optional
    // The generateWorkoutPlan function will use defaults if values are missing

    // Generate workout plan
    let workoutPlan;
    try {
      workoutPlan = await generateWorkoutPlan(preferences);
      console.log('Generated workout plan:', JSON.stringify(workoutPlan, null, 2));

      // Validate the workout plan before saving
      if (!validateWorkoutPlan(workoutPlan)) {
        console.error('Generated workout plan failed validation');
        return NextResponse.json(
          {
            error: 'Generated workout plan is invalid',
            workout: workoutPlan // Include the invalid workout for debugging
          },
          { status: 500 }
        );
      }
    } catch (error) {
      console.error('Error generating workout plan:', error);
      return NextResponse.json(
        { 
          error: 'Failed to generate workout plan',
          details: error instanceof Error ? error.message : 'Unknown error',
          preferences // Include the preferences that were used
        },
        { status: 500 }
      );
    }

    // Save the workout plan to the database
    let savedWorkout;
    try {
      savedWorkout = await saveGeneratedWorkout(workoutPlan, session.user.id, session.user);
    } catch (error) {
      console.error('Error saving workout:', error);
      return NextResponse.json(
        { 
          error: 'Failed to save workout plan',
          details: error instanceof Error ? error.message : 'Unknown error',
          workout: workoutPlan // Return the generated workout even if saving failed
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      workout: workoutPlan,
      savedWorkoutId: savedWorkout.id
    });
  } catch (error) {
    console.error('Unhandled error in workout generation:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 