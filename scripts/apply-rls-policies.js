const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function applyRLSPolicies() {
  console.log('Applying RLS policies...');

  const policies = [
    // Exercises policies
    `CREATE POLICY IF NOT EXISTS "Authenticated users can insert exercises" ON public.exercises
      FOR INSERT 
      WITH CHECK (auth.role() = 'authenticated');`,
    
    `CREATE POLICY IF NOT EXISTS "Authenticated users can update exercises" ON public.exercises
      FOR UPDATE 
      USING (auth.role() = 'authenticated')
      WITH CHECK (auth.role() = 'authenticated');`,

    // Workouts table RLS
    `ALTER TABLE public.workouts ENABLE ROW LEVEL SECURITY;`,

    `CREATE POLICY IF NOT EXISTS "Users can view their own workouts" ON public.workouts
      FOR SELECT 
      USING (auth.uid() = user_id);`,

    `CREATE POLICY IF NOT EXISTS "Users can insert their own workouts" ON public.workouts
      FOR INSERT 
      WITH CHECK (auth.uid() = user_id);`,

    `CREATE POLICY IF NOT EXISTS "Users can update their own workouts" ON public.workouts
      FOR UPDATE 
      USING (auth.uid() = user_id)
      WITH CHECK (auth.uid() = user_id);`,

    `CREATE POLICY IF NOT EXISTS "Users can delete their own workouts" ON public.workouts
      FOR DELETE 
      USING (auth.uid() = user_id);`,

    // Drop old workout_exercises policies that reference workout_plan_id
    `DROP POLICY IF EXISTS "Workout exercises are viewable by workout plan owner" ON public.workout_exercises;`,
    `DROP POLICY IF EXISTS "Workout exercises are insertable by workout plan owner" ON public.workout_exercises;`,
    `DROP POLICY IF EXISTS "Workout exercises are updatable by workout plan owner" ON public.workout_exercises;`,
    `DROP POLICY IF EXISTS "Workout exercises are deletable by workout plan owner" ON public.workout_exercises;`,

    // New workout_exercises policies for workout_id
    `CREATE POLICY IF NOT EXISTS "Users can view workout exercises for their workouts" ON public.workout_exercises
      FOR SELECT 
      USING (
        EXISTS (
          SELECT 1 FROM public.workouts w
          WHERE w.id = workout_exercises.workout_id
          AND w.user_id = auth.uid()
        )
      );`,

    `CREATE POLICY IF NOT EXISTS "Users can insert workout exercises for their workouts" ON public.workout_exercises
      FOR INSERT 
      WITH CHECK (
        EXISTS (
          SELECT 1 FROM public.workouts w
          WHERE w.id = workout_exercises.workout_id
          AND w.user_id = auth.uid()
        )
      );`,

    `CREATE POLICY IF NOT EXISTS "Users can update workout exercises for their workouts" ON public.workout_exercises
      FOR UPDATE 
      USING (
        EXISTS (
          SELECT 1 FROM public.workouts w
          WHERE w.id = workout_exercises.workout_id
          AND w.user_id = auth.uid()
        )
      )
      WITH CHECK (
        EXISTS (
          SELECT 1 FROM public.workouts w
          WHERE w.id = workout_exercises.workout_id
          AND w.user_id = auth.uid()
        )
      );`,

    `CREATE POLICY IF NOT EXISTS "Users can delete workout exercises for their workouts" ON public.workout_exercises
      FOR DELETE 
      USING (
        EXISTS (
          SELECT 1 FROM public.workouts w
          WHERE w.id = workout_exercises.workout_id
          AND w.user_id = auth.uid()
        )
      );`
  ];

  for (let i = 0; i < policies.length; i++) {
    const policy = policies[i];
    console.log(`Applying policy ${i + 1}/${policies.length}...`);
    
    try {
      const { error } = await supabaseAdmin.rpc('exec_sql', { sql: policy });
      if (error) {
        console.error(`Error applying policy ${i + 1}:`, error);
      } else {
        console.log(`✅ Policy ${i + 1} applied successfully`);
      }
    } catch (err) {
      console.error(`Error applying policy ${i + 1}:`, err);
    }
  }

  console.log('RLS policies application complete!');
}

applyRLSPolicies().catch(console.error); 