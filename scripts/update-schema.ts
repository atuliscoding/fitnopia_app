import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error('Missing required environment variables');
  process.exit(1);
}

// Create Supabase client with service role key
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function updateSchema() {
  console.log('🔄 Starting schema update...');

  try {
    // Create or update exercises table
    console.log('\n📝 Updating exercises table...');
    const { error: exercisesError } = await supabase
      .from('exercises')
      .insert({
        name: 'Push-ups',
        description: 'A classic bodyweight exercise that targets chest, shoulders, and triceps',
        target_muscles: ['Chest', 'Shoulders', 'Triceps', 'Core'],
        equipment: ['None'],
        difficulty: 'Beginner',
        instructions: [
          'Start in a plank position with hands shoulder-width apart',
          'Lower your body until your chest nearly touches the ground',
          'Push back up to the starting position while maintaining proper form',
          'Keep your core tight and body in a straight line'
        ],
        tips: [
          'Keep your elbows at a 45-degree angle',
          'Look at a spot on the ground about a foot in front of you',
          'Breathe steadily throughout the movement'
        ],
        video_url: 'https://www.youtube.com/watch?v=IODxDxXqqUU',
        video_start_time: 15,
        video_end_time: 29
      })
      .select();

    if (exercisesError) {
      console.error('Error updating exercises table:', exercisesError);
      throw exercisesError;
    }
    console.log('✅ Exercises table updated');

    // Create or update workouts table
    console.log('\n📝 Updating workouts table...');
    const { error: workoutsError } = await supabase
      .from('workouts')
      .insert({
        name: 'Sample Workout',
        description: 'A sample workout to test the schema',
        type: 'Strength Training',
        duration: '30 minutes',
        difficulty: 'Beginner',
        user_id: 'test'
      })
      .select();

    if (workoutsError && !workoutsError.message.includes('violates foreign key constraint')) {
      console.error('Error updating workouts table:', workoutsError);
      throw workoutsError;
    }
    console.log('✅ Workouts table updated');

    // Create or update workout_exercises table
    console.log('\n📝 Updating workout_exercises table...');
    const { error: workoutExercisesError } = await supabase
      .from('workout_exercises')
      .insert({
        workout_id: 'test',
        exercise_id: 'test',
        sets: 3,
        reps: 10,
        instructions: [
          'Start in a plank position with hands shoulder-width apart',
          'Lower your body until your chest nearly touches the ground'
        ],
        tips: [
          'Keep your elbows at a 45-degree angle',
          'Look at a spot on the ground about a foot in front of you'
        ],
        target_muscles: ['Chest', 'Shoulders', 'Triceps'],
        equipment: ['None'],
        video_url: 'https://www.youtube.com/watch?v=example',
        video_start_time: 0,
        video_end_time: 30
      })
      .select();

    if (workoutExercisesError && !workoutExercisesError.message.includes('violates foreign key constraint')) {
      console.error('Error updating workout_exercises table:', workoutExercisesError);
      throw workoutExercisesError;
    }
    console.log('✅ Workout exercises table updated');

    console.log('\n✨ Schema update completed successfully!');
  } catch (error) {
    console.error('❌ Error updating schema:', error);
    process.exit(1);
  }
}

// Run the update
updateSchema();