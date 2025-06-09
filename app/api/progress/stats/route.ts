import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../../lib/auth';
import { supabaseAdmin } from '../../../../lib/supabase-admin';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || '30'; // days
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(period));

    // Get user ID
    const { data: userData, error: userError } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('email', session.user.email)
      .single();

    if (userError || !userData) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get workout sessions count
    const { data: sessionsData, error: sessionsError } = await supabaseAdmin
      .from('sessions')
      .select('id, start_time, end_time')
      .eq('user_id', userData.id)
      .gte('start_time', startDate.toISOString())
      .order('start_time', { ascending: true });

    if (sessionsError) {
      console.error('Error fetching sessions:', sessionsError);
      return NextResponse.json({ error: 'Failed to fetch sessions' }, { status: 500 });
    }

    // Get exercise performance data
    const { data: performanceData, error: performanceError } = await supabaseAdmin
      .from('exercise_performance')
      .select('*')
      .eq('user_id', userData.id)
      .gte('completed_at', startDate.toISOString())
      .order('completed_at', { ascending: true });

    if (performanceError) {
      console.error('Error fetching performance data:', performanceError);
      return NextResponse.json({ error: 'Failed to fetch performance data' }, { status: 500 });
    }

    // Get workout feedback data
    const { data: feedbackData, error: feedbackError } = await supabaseAdmin
      .from('workout_feedback')
      .select('*')
      .eq('user_id', userData.id)
      .gte('created_at', startDate.toISOString())
      .order('created_at', { ascending: true });

    if (feedbackError) {
      console.error('Error fetching feedback data:', feedbackError);
      return NextResponse.json({ error: 'Failed to fetch feedback data' }, { status: 500 });
    }

    // Calculate statistics
    const totalWorkouts = sessionsData.length;
    const completedWorkouts = sessionsData.filter(s => s.end_time).length;
    const totalExercises = performanceData.length;
    const averageRating = feedbackData.length > 0 
      ? feedbackData.reduce((sum, f) => sum + f.overall_rating, 0) / feedbackData.length 
      : 0;
    
    // Calculate total workout time
    const totalWorkoutTime = sessionsData
      .filter(s => s.end_time)
      .reduce((total, session) => {
        const start = new Date(session.start_time);
        const end = new Date(session.end_time);
        return total + (end.getTime() - start.getTime());
      }, 0);

    // Group data by day for charts
    const dailyStats: Record<string, { workouts: number; exercises: number; duration: number }> = {};
    
    sessionsData.forEach(session => {
      const date = new Date(session.start_time).toISOString().split('T')[0];
      if (!dailyStats[date]) {
        dailyStats[date] = { workouts: 0, exercises: 0, duration: 0 };
      }
      dailyStats[date].workouts += 1;
      
      if (session.end_time) {
        const duration = new Date(session.end_time).getTime() - new Date(session.start_time).getTime();
        dailyStats[date].duration += duration / (1000 * 60); // convert to minutes
      }
    });

    performanceData.forEach(performance => {
      const date = new Date(performance.completed_at).toISOString().split('T')[0];
      if (!dailyStats[date]) {
        dailyStats[date] = { workouts: 0, exercises: 0, duration: 0 };
      }
      dailyStats[date].exercises += 1;
    });

    // Convert to array for charts
    const chartData = Object.entries(dailyStats).map(([date, stats]) => ({
      date,
      workouts: stats.workouts,
      exercises: stats.exercises,
      duration: stats.duration
    }));

    // Exercise performance trends
    const exerciseTrends: Record<string, Array<{
      date: string;
      sets: number;
      reps: number;
      weight: number;
      difficulty: number;
    }>> = {};
    
    performanceData.forEach(perf => {
      const exerciseName = perf.exercise_name;
      if (!exerciseTrends[exerciseName]) {
        exerciseTrends[exerciseName] = [];
      }
      exerciseTrends[exerciseName].push({
        date: perf.completed_at.split('T')[0],
        sets: perf.sets_completed,
        reps: perf.reps_completed,
        weight: perf.weight_used,
        difficulty: perf.difficulty_rating
      });
    });

    return NextResponse.json({ 
      success: true, 
      data: {
        overview: {
          totalWorkouts,
          completedWorkouts,
          totalExercises,
          averageRating: Math.round(averageRating * 10) / 10,
          totalWorkoutTimeHours: Math.round(totalWorkoutTime / (1000 * 60 * 60) * 10) / 10
        },
        chartData,
        exerciseTrends,
        recentFeedback: feedbackData.slice(-5)
      }
    });
  } catch (error) {
    console.error('Error in progress stats API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 