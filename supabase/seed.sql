-- Seed exercises table with common exercises
INSERT INTO public.exercises (
  name, 
  description, 
  target_muscles, 
  equipment, 
  difficulty,
  instructions,
  tips,
  video_url,
  video_start_time,
  video_end_time
) VALUES
-- Chest exercises
(
  'Push-ups',
  'A classic bodyweight exercise that targets chest, shoulders, and triceps',
  ARRAY['Chest', 'Shoulders', 'Triceps', 'Core'],
  ARRAY['None'],
  'Beginner',
  ARRAY[
    'Start in a plank position with hands shoulder-width apart',
    'Lower your body until your chest nearly touches the ground',
    'Push back up to the starting position while maintaining proper form',
    'Keep your core tight and body in a straight line'
  ],
  ARRAY[
    'Keep your elbows at a 45-degree angle',
    'Look at a spot on the ground about a foot in front of you',
    'Breathe steadily throughout the movement'
  ],
  'https://www.youtube.com/watch?v=IODxDxXqqUU',
  15,
  29
),

-- Back exercises
(
  'Dumbbell Rows',
  'A compound exercise that builds back strength and improves posture',
  ARRAY['Back', 'Biceps', 'Shoulders'],
  ARRAY['Dumbbells'],
  'Intermediate',
  ARRAY[
    'Stand with feet shoulder-width apart, holding dumbbells',
    'Hinge at your hips, keeping your back straight',
    'Pull the dumbbells up towards your chest',
    'Lower the weights with control'
  ],
  ARRAY[
    'Keep your back straight throughout the movement',
    'Squeeze your shoulder blades together at the top',
    'Avoid using momentum to lift the weights'
  ],
  'https://www.youtube.com/watch?v=RGrF27tpmQo',
  48,
  60
),

-- Legs exercises
(
  'Squats',
  'A fundamental lower body exercise that builds leg strength and stability',
  ARRAY['Quadriceps', 'Hamstrings', 'Glutes', 'Core'],
  ARRAY['None'],
  'Beginner',
  ARRAY[
    'Stand with feet shoulder-width apart',
    'Lower your body by bending your knees and hips',
    'Keep your chest up and back straight',
    'Push through your heels to return to standing'
  ],
  ARRAY[
    'Keep your knees in line with your toes',
    'Maintain weight in your heels',
    'Go as low as you can while maintaining form'
  ],
  'https://www.youtube.com/watch?v=aclHkVaku9U',
  20,
  35
),

-- Core exercises
(
  'Plank',
  'An isometric core exercise that improves stability and posture',
  ARRAY['Core', 'Shoulders', 'Back'],
  ARRAY['None'],
  'Beginner',
  ARRAY[
    'Start in a forearm plank position',
    'Keep your body in a straight line from head to heels',
    'Engage your core and hold the position',
    'Maintain steady breathing'
  ],
  ARRAY[
    'Keep your hips level with your shoulders',
    'Look at the floor to maintain neutral neck position',
    'Dont let your lower back sag'
  ],
  'https://www.youtube.com/watch?v=v7HozpP2XCE',
  9,
  23
),

-- Shoulder exercises
(
  'Overhead Press',
  'A compound movement that targets the shoulders and upper body',
  ARRAY['Shoulders', 'Triceps'],
  ARRAY['Dumbbells'],
  'Intermediate',
  ARRAY[
    'Stand with feet shoulder-width apart',
    'Hold dumbbells at shoulder height',
    'Press the weights overhead until arms are fully extended',
    'Lower the weights back to shoulder height with control'
  ],
  ARRAY[
    'Keep your core engaged throughout the movement',
    'Avoid arching your back',
    'Breathe out as you press up'
  ],
  'https://www.youtube.com/watch?v=2yJWxtMEPdw',
  19,
  31
);