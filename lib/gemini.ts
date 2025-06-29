import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize GoogleGenerativeAI only if API key is available
let genAI: GoogleGenerativeAI | null = null;

if (process.env.GOOGLE_API_KEY) {
  genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
}

export interface GeneratedExercise {
  name: string;
  sets: number;
  reps: number | string;
  instructions: string[];
  tips: string[];
  targetMuscles: string[];
  equipment: string[];
  videoUrl: string;
  videoStartTime?: number;
  videoEndTime?: number;
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
  duration?: string;
  difficulty?: 'Beginner' | 'Intermediate' | 'Advanced';
  type?: 'Strength Training' | 'Cardio' | 'HIIT' | 'Yoga' | 'Flexibility' | 'Custom';
  targetMuscles?: string[];
  equipment?: string[];
}

export function validateWorkoutPlan(plan: any): plan is GeneratedWorkout {
  console.log('Starting validation of workout plan');
  
  if (!plan || typeof plan !== 'object') {
    console.error('Invalid plan:', plan);
    return false;
  }
  
  // Validate top-level properties
  const topLevelValid = {
    name: typeof plan.name === 'string',
    description: typeof plan.description === 'string',
    duration: typeof plan.duration === 'string',
    type: typeof plan.type === 'string',
    difficulty: ['Beginner', 'Intermediate', 'Advanced'].includes(plan.difficulty),
    exercises: Array.isArray(plan.exercises)
  };

  console.log('Top-level validation results:', topLevelValid);

  if (!Object.values(topLevelValid).every(Boolean)) {
    console.error('Invalid top-level properties:', topLevelValid);
    return false;
  }

  // Validate exercises
  if (plan.exercises.length === 0) {
    console.error('No exercises in workout plan');
    return false;
  }

  console.log('Starting validation of exercises');
  const exerciseValidations = plan.exercises.map((exercise: any, index: number) => {
    console.log(`Validating exercise ${index}: ${exercise.name}`);
    
    const exerciseValid = {
      name: typeof exercise.name === 'string',
      sets: typeof exercise.sets === 'number',
      reps: typeof exercise.reps === 'number' || typeof exercise.reps === 'string',
      instructions: Array.isArray(exercise.instructions),
      tips: Array.isArray(exercise.tips),
      targetMuscles: Array.isArray(exercise.targetMuscles),
      equipment: Array.isArray(exercise.equipment),
      videoUrl: typeof exercise.videoUrl === 'string',
      videoStartTime: exercise.videoStartTime === undefined || typeof exercise.videoStartTime === 'number',
      videoEndTime: exercise.videoEndTime === undefined || typeof exercise.videoEndTime === 'number'
    };

    console.log(`Exercise ${index} validation results:`, exerciseValid);

    if (!Object.values(exerciseValid).every(Boolean)) {
      console.error(`Invalid exercise at index ${index}:`, exerciseValid);
      console.error('Exercise data:', exercise);
      return false;
    }

    // Additional array content validation
    const arrayValidations = {
      instructions: exercise.instructions.length > 0,
      tips: exercise.tips.length > 0,
      targetMuscles: exercise.targetMuscles.length > 0,
      equipment: true // Allow empty equipment arrays for bodyweight exercises
    };

    console.log(`Exercise ${index} array validations:`, arrayValidations);

    if (!Object.values(arrayValidations).every(Boolean)) {
      console.error(`Missing required array content in exercise ${index}:`, arrayValidations);
      return false;
    }

    // Validate array contents are strings
    const arrayContentValidations = {
      instructions: exercise.instructions.every((item: any) => typeof item === 'string'),
      tips: exercise.tips.every((item: any) => typeof item === 'string'),
      targetMuscles: exercise.targetMuscles.every((item: any) => typeof item === 'string'),
      equipment: exercise.equipment.every((item: any) => typeof item === 'string')
    };

    console.log(`Exercise ${index} array content validations:`, arrayContentValidations);

    if (!Object.values(arrayContentValidations).every(Boolean)) {
      console.error(`Invalid array content types in exercise ${index}:`, arrayContentValidations);
      return false;
    }

    return true;
  });

  const isValid = exerciseValidations.every(Boolean);
  console.log('Final validation result:', isValid);
  return isValid;
}

export async function generateWorkoutPlan(preferences: WorkoutPreferences = {}) {
  if (!genAI) {
    throw new Error('Google AI not initialized. Please check GOOGLE_API_KEY environment variable.');
  }
  
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

  const prompt = `Generate a detailed workout plan with the following preferences:
${preferences.duration ? `Duration: ${preferences.duration}` : 'Duration: 30 minutes'}
${preferences.difficulty ? `Difficulty: ${preferences.difficulty}` : 'Difficulty: Intermediate'}
${preferences.type ? `Type: ${preferences.type}` : 'Type: Strength Training'}
${preferences.targetMuscles ? `Target Muscles: ${preferences.targetMuscles.join(', ')}` : ''}
${preferences.equipment ? `Available Equipment: ${preferences.equipment.join(', ')}` : ''}

IMPORTANT: Respond with ONLY a valid JSON object. Do not include any text before or after the JSON.

The JSON response must have exactly this structure:
{
  "name": "Workout Name",
  "description": "Brief description of the workout",
  "duration": "30",
  "difficulty": "Intermediate",
  "type": "Strength Training",
  "exercises": [
    {
      "name": "Exercise name",
      "description": "Brief description",
      "sets": 3,
      "reps": 10,
      "instructions": ["Step 1", "Step 2", "Step 3"],
      "tips": ["Tip 1", "Tip 2", "Tip 3"],
      "targetMuscles": ["Muscle 1", "Muscle 2"],
      "equipment": ["Equipment 1"],
      "videoUrl": "https://www.youtube.com/watch?v=example",
      "videoStartTime": 10,
      "videoEndTime": 30
    }
  ]
}

Rules:
1. Use numbers for reps (like 10, 12, 15) for counted exercises
2. Use strings for time-based exercises (like "30 seconds", "1 minute")
3. For bodyweight exercises, use ["None"] in equipment array
4. Include 4-6 exercises
5. Ensure all JSON is properly formatted with no trailing commas
6. Include realistic YouTube video URLs with timestamps
7. CRITICAL: Use EXACT values for difficulty: "Beginner", "Intermediate", or "Advanced"
8. CRITICAL: Use EXACT values for type: "Strength Training", "Cardio", "HIIT", "Yoga", "Flexibility", or "Custom"`;

  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    
    console.log('Raw AI response:', text);
    
    // Clean up the response text
    let cleanText = text.trim();
    
    // Remove any markdown code blocks
    cleanText = cleanText.replace(/```json\s*/g, '').replace(/```\s*/g, '');
    
    // Find the JSON object in the response
    const jsonStart = cleanText.indexOf('{');
    const jsonEnd = cleanText.lastIndexOf('}') + 1;
    
    if (jsonStart === -1 || jsonEnd === 0) {
      throw new Error('No valid JSON found in the response');
    }
    
    const jsonString = cleanText.substring(jsonStart, jsonEnd);
    console.log('Extracted JSON string:', jsonString);

    // Parse and validate the workout data
    const workout = JSON.parse(jsonString);
    console.log('Parsed workout:', workout);
    return workout;
  } catch (error) {
    console.error('Error generating workout:', error);
    throw error;
  }
}

// Test function to verify workout generation with video timestamps
export async function testWorkoutGeneration() {
  const testPreferences: WorkoutPreferences = {
    duration: '30',
    difficulty: 'Intermediate',
    type: 'Strength Training',
    targetMuscles: ['Upper Body', 'Core'],
    equipment: ['Dumbbells', 'Barbell'],
  };

  try {
    const workout = await generateWorkoutPlan(testPreferences);
    console.log('Generated Workout Plan:', JSON.stringify(workout, null, 2));
    return workout;
  } catch (error) {
    console.error('Test Error:', error);
    throw error;
  }
}
