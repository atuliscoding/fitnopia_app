import { NextResponse } from 'next/server';
import { generateWorkoutPlan } from '../../../../lib/gemini';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Check if Google API key is available
    if (!process.env.GOOGLE_API_KEY) {
      return NextResponse.json(
        { error: 'Google API key not configured for workout generation' },
        { status: 503 }
      );
    }

    const workout = await generateWorkoutPlan({
      duration: '30 minutes',
      difficulty: 'Intermediate',
      type: 'Strength Training',
      targetMuscles: ['Upper Body', 'Core'],
      equipment: ['Dumbbells', 'Bodyweight']
    });

    return NextResponse.json(workout);
  } catch (error) {
    console.error('Error generating workout:', error);
    return NextResponse.json(
      { error: 'Failed to generate workout' },
      { status: 500 }
    );
  }
} 