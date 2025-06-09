import 'dotenv/config';
import { supabaseAdmin } from '../lib/supabase-admin';

const exercises = [
  // Chest exercises
  {
    name: 'Push-ups',
    description: 'A bodyweight exercise that works the chest, shoulders, and triceps',
    muscle_group: 'CHEST',
    equipment: ['bodyweight'],
    difficulty: 'BEGINNER'
  },
  {
    name: 'Bench Press',
    description: 'A compound exercise that targets the chest muscles',
    muscle_group: 'CHEST',
    equipment: ['barbell', 'bench'],
    difficulty: 'INTERMEDIATE'
  },
  {
    name: 'Dumbbell Flyes',
    description: 'An isolation exercise for the chest muscles',
    muscle_group: 'CHEST',
    equipment: ['dumbbells', 'bench'],
    difficulty: 'INTERMEDIATE'
  },

  // Back exercises
  {
    name: 'Pull-ups',
    description: 'A bodyweight exercise that works the back and biceps',
    muscle_group: 'BACK',
    equipment: ['pull-up bar'],
    difficulty: 'INTERMEDIATE'
  },
  {
    name: 'Bent Over Rows',
    description: 'A compound exercise that targets the back muscles',
    muscle_group: 'BACK',
    equipment: ['barbell'],
    difficulty: 'INTERMEDIATE'
  },
  {
    name: 'Lat Pulldowns',
    description: 'A machine exercise that works the latissimus dorsi',
    muscle_group: 'BACK',
    equipment: ['cable machine'],
    difficulty: 'BEGINNER'
  },

  // Legs exercises
  {
    name: 'Squats',
    description: 'A compound exercise that works the entire lower body',
    muscle_group: 'LEGS',
    equipment: ['bodyweight'],
    difficulty: 'BEGINNER'
  },
  {
    name: 'Deadlifts',
    description: 'A compound exercise that works the posterior chain',
    muscle_group: 'LEGS',
    equipment: ['barbell'],
    difficulty: 'INTERMEDIATE'
  },
  {
    name: 'Lunges',
    description: 'A unilateral exercise that works the legs and improves balance',
    muscle_group: 'LEGS',
    equipment: ['bodyweight', 'dumbbells'],
    difficulty: 'BEGINNER'
  },

  // Shoulders exercises
  {
    name: 'Overhead Press',
    description: 'A compound exercise that targets the shoulder muscles',
    muscle_group: 'SHOULDERS',
    equipment: ['barbell', 'dumbbells'],
    difficulty: 'INTERMEDIATE'
  },
  {
    name: 'Lateral Raises',
    description: 'An isolation exercise for the lateral deltoids',
    muscle_group: 'SHOULDERS',
    equipment: ['dumbbells'],
    difficulty: 'BEGINNER'
  },
  {
    name: 'Face Pulls',
    description: 'An exercise that targets the rear deltoids and upper back',
    muscle_group: 'SHOULDERS',
    equipment: ['cable machine'],
    difficulty: 'BEGINNER'
  },

  // Arms exercises
  {
    name: 'Bicep Curls',
    description: 'An isolation exercise for the biceps',
    muscle_group: 'ARMS',
    equipment: ['dumbbells', 'barbell'],
    difficulty: 'BEGINNER'
  },
  {
    name: 'Tricep Extensions',
    description: 'An isolation exercise for the triceps',
    muscle_group: 'ARMS',
    equipment: ['dumbbells', 'cable machine'],
    difficulty: 'BEGINNER'
  },
  {
    name: 'Hammer Curls',
    description: 'A bicep exercise that also works the forearms',
    muscle_group: 'ARMS',
    equipment: ['dumbbells'],
    difficulty: 'BEGINNER'
  },

  // Core exercises
  {
    name: 'Plank',
    description: 'An isometric exercise that works the entire core',
    muscle_group: 'CORE',
    equipment: ['bodyweight'],
    difficulty: 'BEGINNER'
  },
  {
    name: 'Crunches',
    description: 'A basic abdominal exercise',
    muscle_group: 'CORE',
    equipment: ['bodyweight'],
    difficulty: 'BEGINNER'
  },
  {
    name: 'Russian Twists',
    description: 'A rotational exercise that works the obliques',
    muscle_group: 'CORE',
    equipment: ['bodyweight', 'dumbbell'],
    difficulty: 'INTERMEDIATE'
  }
];

async function seedExercises() {
  try {
    const { data, error } = await supabaseAdmin
      .from('exercises')
      .insert(exercises)
      .select();

    if (error) {
      throw error;
    }

    console.log('Successfully seeded exercises:', data.length);
  } catch (error) {
    console.error('Error seeding exercises:', error);
  }
}

seedExercises(); 