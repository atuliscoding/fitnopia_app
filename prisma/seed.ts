import { PrismaClient, type Difficulty } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

const exercises = [
  {
    id: uuidv4(),
    name: 'Push-ups',
    description: 'A classic bodyweight exercise that targets chest, shoulders, and triceps',
    videoUrl: 'https://cdn.fitnopia.com/exercises/pushups.mp4',
    category: ['strength', 'bodyweight'],
    equipment: ['none'],
    difficulty: 'BEGINNER' as Difficulty,
    muscleGroups: ['chest', 'shoulders', 'triceps'],
  },
  {
    id: uuidv4(),
    name: 'Squats',
    description: 'A fundamental lower body exercise that builds leg strength and stability',
    videoUrl: 'https://cdn.fitnopia.com/exercises/squats.mp4',
    category: ['strength', 'bodyweight'],
    equipment: ['none'],
    difficulty: 'BEGINNER' as Difficulty,
    muscleGroups: ['quadriceps', 'hamstrings', 'glutes'],
  },
  {
    id: uuidv4(),
    name: 'Plank',
    description: 'An isometric core exercise that improves stability and posture',
    videoUrl: 'https://cdn.fitnopia.com/exercises/plank.mp4',
    category: ['core', 'bodyweight'],
    equipment: ['none'],
    difficulty: 'BEGINNER' as Difficulty,
    muscleGroups: ['core', 'shoulders'],
  },
  // Add more exercises here...
];

async function main() {
  console.log('Start seeding exercises...');

  for (const exercise of exercises) {
    const result = await prisma.exercise.upsert({
      where: { id: exercise.id },
      update: exercise,
      create: exercise,
    });
    console.log(`Created exercise: ${result.name}`);
  }

  console.log('Seeding completed.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 