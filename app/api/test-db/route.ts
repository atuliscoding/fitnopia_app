import { NextResponse } from 'next/server';
import { getExercises } from '../../../lib/db';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET() {
  try {
    // Try to get all exercises
    const exercises = await getExercises();
    
    return NextResponse.json({
      success: true,
      message: 'Database connection successful',
      data: {
        exerciseCount: exercises.length,
        exercises: exercises
      }
    });
  } catch (error) {
    console.error('Database test error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Database connection failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 