import OpenAI from 'openai';

if (!process.env.OPENAI_API_KEY) {
  throw new Error('Missing OPENAI_API_KEY environment variable');
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface GeneratedExercise {
  name: string;
  sets: number;
  reps: number;
  instructions: string[];
  tips: string[];
  targetMuscles: string[];
  equipment: string[];
  videoUrl: string;
}

export interface GeneratedWorkout {
  name: string;
  description: string;
  duration: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  type: string;
  exercises: GeneratedExercise[];
}

export interface WorkoutPreferences {
  fitnessLevel: string;
  fitnessGoals: string[];
  workoutDuration: number;
  focusAreas: string[];
  healthConditions: string[];
}

function validateWorkoutPlan(plan: any): plan is GeneratedWorkout {
  if (!plan || typeof plan !== 'object') return false;
  
  // Validate top-level properties
  if (typeof plan.name !== 'string' ||
      typeof plan.description !== 'string' ||
      typeof plan.duration !== 'string' ||
      typeof plan.type !== 'string' ||
      !['Beginner', 'Intermediate', 'Advanced'].includes(plan.difficulty) ||
      !Array.isArray(plan.exercises)) {
    return false;
  }

  // Validate exercises
  return plan.exercises.every((exercise: any) => (
    typeof exercise.name === 'string' &&
    typeof exercise.sets === 'number' &&
    typeof exercise.reps === 'number' &&
    Array.isArray(exercise.instructions) &&
    Array.isArray(exercise.tips) &&
    Array.isArray(exercise.targetMuscles) &&
    Array.isArray(exercise.equipment) &&
    typeof exercise.videoUrl === 'string'
  ));
}

export async function generateWorkoutPlan(preferences: WorkoutPreferences): Promise<GeneratedWorkout> {
  if (!preferences.fitnessLevel || !preferences.fitnessGoals?.length || !preferences.focusAreas?.length) {
    throw new Error('Invalid workout preferences');
  }

  const prompt = `Create a detailed workout plan based on the following preferences:
Fitness Level: ${preferences.fitnessLevel}
Fitness Goals: ${preferences.fitnessGoals.join(', ')}
Duration: ${preferences.workoutDuration} minutes
Focus Areas: ${preferences.focusAreas.join(', ')}
Health Conditions: ${preferences.healthConditions?.join(', ') || 'None'}

Generate a workout plan that includes:
1. Workout name
2. Brief description
3. Total duration
4. Difficulty level
5. Type of workout
6. A list of 6-8 exercises, where each exercise includes:
   - Name
   - Number of sets and reps
   - Detailed instructions (as a list)
   - Form tips (as a list)
   - Target muscles (as a list)
   - Required equipment (as a list)
   - YouTube video URL (use real, high-quality tutorial videos from reputable fitness channels)

Format the response as a JSON object matching this TypeScript interface:
interface GeneratedWorkout {
  name: string;
  description: string;
  duration: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  type: string;
  exercises: Array<{
    name: string;
    sets: number;
    reps: number;
    instructions: string[];
    tips: string[];
    targetMuscles: string[];
    equipment: string[];
    videoUrl: string; // YouTube URL for the exercise tutorial
  }>;
}

Important:
1. Ensure all exercises are appropriate for the user's fitness level and health conditions
2. Include proper warm-up and cool-down exercises
3. Provide clear, step-by-step instructions
4. Include real, existing YouTube video URLs from reputable fitness channels
5. Maintain proper exercise order and progression`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a professional fitness trainer with expertise in creating personalized workout plans. Provide detailed, safe, and effective workout plans based on user preferences. Always return valid JSON that matches the specified interface."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
    });

    if (!completion.choices[0].message.content) {
      throw new Error('No response from OpenAI');
    }

    const workoutPlan = JSON.parse(completion.choices[0].message.content);
    
    if (!validateWorkoutPlan(workoutPlan)) {
      throw new Error('Invalid workout plan format received from OpenAI');
    }

    return workoutPlan;
  } catch (error) {
    console.error('Error generating workout plan:', error);
    if (error instanceof Error) {
      throw new Error(`Failed to generate workout plan: ${error.message}`);
    }
    throw new Error('Failed to generate workout plan');
  }
} 