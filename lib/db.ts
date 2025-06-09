import { createClient } from '@supabase/supabase-js';
import type { User, Profile, WorkoutPlan, Exercise, WorkoutExercise, Session } from '../types/database';
import type { GeneratedWorkout, GeneratedExercise } from './gemini';

// Regular client for user operations
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Service role client for admin operations (bypasses RLS)
const supabaseAdmin = process.env.SUPABASE_SERVICE_ROLE_KEY 
  ? createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
  : supabase; // Fallback to regular client if service key not available

export async function getUserByEmail(email: string) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single();

  if (error) throw error;
  return data as User;
}

export async function createUser(user: Omit<User, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('users')
    .insert([user])
    .select()
    .single();

  if (error) throw error;
  return data as User;
}

export async function getProfile(userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error) throw error;
  return data as Profile;
}

export async function updateProfile(profile: Partial<Profile> & { user_id: string }) {
  const { data, error } = await supabase
    .from('profiles')
    .update(profile)
    .eq('user_id', profile.user_id)
    .select()
    .single();

  if (error) throw error;
  return data as Profile;
}

export async function getWorkoutPlans(userId: string) {
  const { data, error } = await supabase
    .from('workout_plans')
    .select('*')
    .eq('user_id', userId);

  if (error) throw error;
  return data as WorkoutPlan[];
}

export async function createWorkoutPlan(workoutPlan: Omit<WorkoutPlan, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('workout_plans')
    .insert([workoutPlan])
    .select()
    .single();

  if (error) throw error;
  return data as WorkoutPlan;
}

export async function getExercises(muscleGroup?: Exercise['muscle_group'], difficulty?: Exercise['difficulty']) {
  let query = supabase.from('exercises').select('*');

  if (muscleGroup) {
    query = query.eq('muscle_group', muscleGroup);
  }

  if (difficulty) {
    query = query.eq('difficulty', difficulty);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data as Exercise[];
}

export async function addExerciseToWorkout(workoutExercise: Omit<WorkoutExercise, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabaseAdmin
    .from('workout_exercises')
    .insert([workoutExercise])
    .select()
    .single();

  if (error) throw error;
  return data as WorkoutExercise;
}

export async function createSession(session: Omit<Session, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('sessions')
    .insert([session])
    .select()
    .single();

  if (error) throw error;
  return data as Session;
}

export async function updateSession(sessionId: string, updates: Partial<Session>) {
  const { data, error } = await supabase
    .from('sessions')
    .update(updates)
    .eq('id', sessionId)
    .select()
    .single();

  if (error) throw error;
  return data as Session;
}

export async function saveGeneratedWorkout(workout: GeneratedWorkout, userId: string, user?: any) {
  try {
    // First, determine the effective user ID to use for database operations
    let effectiveUserId = userId;
    let existingUserByEmail: { id: string; email: string } | null = null;
    
    // Check if user exists by ID first
    const { data: existingUserById, error: userCheckError } = await supabaseAdmin
      .from('users')
      .select('id, email')
      .eq('id', userId)
      .single();

    if (userCheckError && userCheckError.code === 'PGRST116') {
      // User doesn't exist by ID, check if they exist by email
      console.log('User not found by ID, checking by email:', user?.email);
      
      if (user?.email) {
        const { data: userByEmail, error: emailCheckError } = await supabaseAdmin
          .from('users')
          .select('id, email, name')
          .eq('email', user.email)
          .single();

        if (userByEmail && !emailCheckError) {
          existingUserByEmail = userByEmail;
          // User exists with this email but different ID
          console.log('User exists with same email but different ID. Old ID:', userByEmail.id, 'New session ID:', userId);
          
          // Step 1: Create the new user record first (needed for foreign key constraints)
          console.log('Creating new user record with current session ID...');
          const { data: newUser, error: userCreateError } = await supabaseAdmin
            .from('users')
            .insert({
              id: userId,
              email: user?.email || userByEmail.email,
              name: user?.name || userByEmail.name || 'Unknown User',
              password: 'oauth_user',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            })
            .select()
            .single();
            
          if (userCreateError && userCreateError.code !== '23505') { // 23505 = duplicate key, which is OK
            console.error('Failed to create new user record:', userCreateError);
            // If we can't create the user, use the existing user ID instead
            console.log('Using existing user ID as fallback:', userByEmail.id);
            effectiveUserId = userByEmail.id;
          } else {
            console.log('Successfully created new user record with current session ID');
            
            // Add a small delay to ensure the user record is fully committed to the database
            await new Promise(resolve => setTimeout(resolve, 100));
            
            // Verify the user record exists before proceeding with transfers
            const { data: verifyUser, error: verifyError } = await supabaseAdmin
              .from('users')
              .select('id, email')
              .eq('id', userId)
              .maybeSingle(); // Use maybeSingle instead of single to avoid errors when no records found
              
            if (verifyError) {
              console.error('User verification failed with error:', verifyError);
              console.log('Using existing user ID as fallback:', userByEmail.id);
              effectiveUserId = userByEmail.id;
            } else if (!verifyUser) {
              console.error('User verification failed: no user found after creation');
              console.log('Using existing user ID as fallback:', userByEmail.id);
              effectiveUserId = userByEmail.id;
            } else {
              console.log('User verification successful, user found:', verifyUser);
              
              // Add another small delay before transfers to ensure database consistency
              await new Promise(resolve => setTimeout(resolve, 50));
              
              // Step 2: Transfer workouts from old user ID to current session user ID
              console.log('Transferring workouts from old user ID to current session user ID...');
              const { error: transferError } = await supabaseAdmin
                .from('workout_plans')
                .update({ user_id: userId })
                .eq('user_id', userByEmail.id);
                
              if (transferError) {
                console.warn('Failed to transfer workout_plans:', transferError);
              } else {
                console.log('Successfully transferred workout_plans to current user ID');
              }

              // Also transfer from workouts table if any exist there
              const { error: transferWorkoutsError } = await supabaseAdmin
                .from('workouts')
                .update({ user_id: userId })
                .eq('user_id', userByEmail.id);
                
              if (transferWorkoutsError) {
                console.warn('Failed to transfer workouts table:', transferWorkoutsError);
              } else {
                console.log('Successfully transferred workouts table to current user ID');
              }
              
              effectiveUserId = userId; // Use the current session user ID
            }
          }
        } else {
          // No user exists with this email, create new one
          console.log('No user found by email, creating new user record:', userId);
          const { error: userCreateError } = await supabaseAdmin
            .from('users')
            .insert({
              id: userId,
              email: user?.email || 'unknown@example.com',
              name: user?.name || 'Unknown User',
              password: 'oauth_user', // Placeholder for OAuth users who don't have passwords
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            });

          if (userCreateError) {
            console.error('Failed to create user:', userCreateError);
            throw new Error(`Failed to create user: ${userCreateError.message}`);
          }
          
          console.log('Successfully created user record');
          
          // Add a small delay and verify the user record exists
          await new Promise(resolve => setTimeout(resolve, 100));
          
          const { data: verifyNewUser, error: verifyNewUserError } = await supabaseAdmin
            .from('users')
            .select('id')
            .eq('id', userId)
            .single();
            
          if (verifyNewUserError || !verifyNewUser) {
            console.error('New user verification failed after creation:', verifyNewUserError);
            throw new Error('Failed to verify newly created user record');
          }
          
          console.log('New user verification successful');
          effectiveUserId = userId; // Use the newly created user ID
        }
      } else {
        // No email available, create user with just ID
        console.log('No email available, creating user with ID only:', userId);
        const { error: userCreateError } = await supabaseAdmin
          .from('users')
          .insert({
            id: userId,
            email: 'unknown@example.com',
            name: 'Unknown User',
            password: 'oauth_user',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });

        if (userCreateError) {
          console.error('Failed to create user:', userCreateError);
          throw new Error(`Failed to create user: ${userCreateError.message}`);
        }
        console.log('Successfully created user record');
        effectiveUserId = userId; // Use the newly created user ID
      }
    } else if (userCheckError) {
      console.error('Error checking user:', userCheckError);
      throw new Error(`User validation failed: ${userCheckError.message}`);
    } else {
      console.log('User exists in database with ID:', existingUserById.id);
      effectiveUserId = existingUserById.id; // Use the existing user ID
    }

    // Use exact enum values as they are in the database
    const validDifficulties = ['Beginner', 'Intermediate', 'Advanced'];
    const validTypes = ['Strength Training', 'Cardio', 'HIIT', 'Yoga', 'Flexibility', 'Custom'];
    
    // Ensure difficulty matches database enum
    const difficulty = validDifficulties.includes(workout.difficulty) 
      ? workout.difficulty 
      : 'Intermediate';
    
    // Ensure type matches database enum  
    const type = validTypes.includes(workout.type) 
      ? workout.type 
      : 'Strength Training';

    console.log('Saving workout with:', { difficulty, type, originalDifficulty: workout.difficulty, originalType: workout.type });

    // Determine which table structure to use based on foreign key constraints
    let workoutData;
    let workoutTable = 'workout_plans'; // Start with the table that the foreign key expects
    let workoutIdColumn = 'workout_plan_id';

    // The effectiveUserId has already been determined from user validation above
    
    // Try the old structure first (workout_plans table) since foreign key points to it
    // Use admin client to bypass RLS policies
    try {
      const { data, error } = await supabaseAdmin
        .from('workout_plans')
        .insert({
          user_id: effectiveUserId, // Use the existing user ID from database
          name: workout.name,
          description: workout.description,
          difficulty: difficulty
        })
        .select()
        .single();

      if (error) throw error;
      workoutData = data;
      console.log('Successfully saved to workout_plans table');
    } catch (planError) {
      console.log('Failed to save to workout_plans table, trying workouts table...', planError);
      
      // Fallback to new structure (workouts table) using admin client
      try {
        const { data, error } = await supabaseAdmin
          .from('workouts')
          .insert({
            user_id: effectiveUserId, // Use the existing user ID from database
            name: workout.name,
            description: workout.description,
            duration: workout.duration,
            difficulty: difficulty,
            type: type
          })
          .select()
          .single();

        if (error) throw error;
        workoutData = data;
        workoutTable = 'workouts';
        workoutIdColumn = 'workout_id';
        console.log('Successfully saved to workouts table');
      } catch (workoutsError) {
        console.error('Failed to save to both tables:', { planError, workoutsError });
        throw workoutsError;
      }
    }

    if (!workoutData) {
      const error = new Error('No workout data returned after creation');
      console.error(error);
      throw error;
    }

    // Then, create exercises and link them to the workout
    for (let i = 0; i < workout.exercises.length; i++) {
      const exercise = workout.exercises[i];

      // Create or find the exercise using admin client to bypass RLS
      // Try new schema first, fallback to old schema
      let exerciseData;
      try {
        const { data, error } = await supabaseAdmin
          .from('exercises')
          .upsert({
            name: exercise.name,
            description: exercise.instructions.join('\n'),
            target_muscles: exercise.targetMuscles, // New schema
            equipment: exercise.equipment,
            difficulty: difficulty,
            instructions: exercise.instructions,
            tips: exercise.tips,
            video_url: exercise.videoUrl,
            video_start_time: exercise.videoStartTime,
            video_end_time: exercise.videoEndTime
          })
          .select()
          .single();

        if (error) throw error;
        exerciseData = data;
        console.log('Successfully created exercise with new schema');
      } catch (newSchemaError) {
        console.log('Failed with new schema, trying old schema...', newSchemaError);
        
        // Fallback to old schema
        try {
          const { data, error } = await supabaseAdmin
            .from('exercises')
            .upsert({
              name: exercise.name,
              description: exercise.instructions.join('\n'),
              muscle_group: exercise.targetMuscles[0] || 'General', // Old schema expects single string
              equipment: exercise.equipment,
              difficulty: difficulty
            })
            .select()
            .single();

          if (error) throw error;
          exerciseData = data;
          console.log('Successfully created exercise with old schema');
        } catch (oldSchemaError) {
          console.error('Failed with both schemas:', { newSchemaError, oldSchemaError });
          throw oldSchemaError;
        }
      }

      if (!exerciseData) {
        const error = new Error('No exercise data returned after creation');
        console.error(error);
        throw error;
      }

      // Link exercise to workout - use the correct table reference
      const linkData: any = {
        exercise_id: exerciseData.id,
        sets: exercise.sets,
        reps: typeof exercise.reps === 'string' ? parseInt(exercise.reps) || 1 : exercise.reps,
      };

      // Add the correct workout reference based on which table was used
      if (workoutTable === 'workout_plans') {
        linkData.workout_plan_id = workoutData.id;
      } else {
        // For workouts table, we need to check which column exists in workout_exercises
        // Since workouts table doesn't have foreign key constraint, let's use workout_plan_id anyway
        // but first check if workout_exercises supports this column
        linkData.workout_plan_id = workoutData.id;
      }

      // Add additional fields if the table supports them
      if (workoutTable === 'workouts') {
        // New table structure with additional fields
        Object.assign(linkData, {
          instructions: exercise.instructions,
          tips: exercise.tips,
          target_muscles: exercise.targetMuscles,
          equipment: exercise.equipment,
          video_url: exercise.videoUrl,
          video_start_time: exercise.videoStartTime,
          video_end_time: exercise.videoEndTime
        });
      }

      try {
        const { error } = await supabaseAdmin
          .from('workout_exercises')
          .insert(linkData);

        if (error) throw error;
        console.log(`Successfully linked exercise using workout from ${workoutTable} table`);
      } catch (linkError) {
        console.error('Error linking exercise to workout:', {
          error: linkError,
          workoutTable: workoutTable,
          workoutId: workoutData.id,
          exerciseId: exerciseData.id,
          linkData: linkData
        });
        
        // If foreign key constraint fails, it means the workout_exercises table
        // expects the workout to be in workout_plans table, but we saved it to workouts table
        // Let's try to save the workout to workout_plans table instead
        if ((linkError as any)?.code === '23503' && workoutTable === 'workouts') {
          console.log('Retrying workout save to workout_plans table to satisfy foreign key constraint...');
          
          // First, verify that the user record exists before trying to create workout_plans record
          const { data: userVerification, error: userVerificationError } = await supabaseAdmin
            .from('users')
            .select('id')
            .eq('id', effectiveUserId)
            .single();
            
          if (userVerificationError || !userVerification) {
            console.error('User verification failed before workout_plans creation:', userVerificationError);
            console.log('Cannot create workout_plans record without valid user. Using fallback strategy...');
            
            // Fallback: Save the workout exercises individually without linking to any workout
            console.log('Saving exercise as standalone record without workout link...');
            continue; // Skip this exercise linking and move to the next one
          }
          
          console.log('User verification successful, proceeding with workout_plans creation...');
          
          try {
            const { data: planData, error: planError } = await supabaseAdmin
              .from('workout_plans')
              .insert({
                id: workoutData.id, // Use the same ID
                user_id: effectiveUserId,
                name: workout.name,
                description: workout.description,
                difficulty: difficulty,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              })
              .select()
              .single();

            if (planError) {
              console.error('Failed to create workout_plans record:', planError);
              throw planError;
            }
            
            console.log('Successfully created workout_plans record, now attempting to link exercise...');
            
            // Now try linking again
            const { error: retryLinkError } = await supabaseAdmin
              .from('workout_exercises')
              .insert(linkData);

            if (retryLinkError) {
              console.error('Failed to link exercise even after creating workout_plans record:', retryLinkError);
              throw retryLinkError;
            }
            
            console.log('Successfully linked exercise after creating workout_plans record');
            
          } catch (retryError) {
            console.error('Failed to retry with workout_plans:', retryError);
            
            // Final fallback: Save exercise without any workout linkage
            console.log('Using final fallback: saving exercise without workout linkage...');
            continue; // Skip this exercise linking and move to the next one
          }
        } else {
          throw linkError;
        }
      }
    }

    return workoutData;
  } catch (error) {
    console.error('Error saving workout:', error);
    throw error;
  }
}

export async function getWorkoutById(workoutId: string) {
  const { data: workout, error: workoutError } = await supabase
    .from('workouts')
    .select('*')
    .eq('id', workoutId)
    .single();

  if (workoutError) throw workoutError;

  const { data: exercises, error: exercisesError } = await supabase
    .from('workout_exercises')
    .select(`
      *,
      exercise:exercises(*)
    `)
    .eq('workout_id', workoutId)
    .order('created_at');

  if (exercisesError) throw exercisesError;

  return {
    ...workout,
    exercises: exercises.map(e => ({
      ...e.exercise,
      sets: e.sets,
      reps: e.reps,
      duration: e.duration,
      rest_duration: e.rest_duration
    }))
  };
} 