import { PrismaClient } from '@prisma/client'

declare global {
  var prisma: PrismaClient | undefined
}

const client = global.prisma || new PrismaClient()
if (process.env.NODE_ENV === 'development') global.prisma = client

export default client

// Note: Using Workout and Meal based on your current prisma client import
// Make sure these match your actual Prisma schema model names
export async function addWorkout(description: string, date?: string) {
  const workoutDate = date ? new Date(date) : new Date();
  workoutDate.setHours(0, 0, 0, 0); // Set to start of day to make it a proper date
  
  return await client.workout.create({
    data: {
      date: workoutDate,
      description,
      createdAt: new Date(),
    }
  });
}

export async function getAllWorkouts() {
  return await client.workout.findMany({
    orderBy: [
      { date: 'desc' },
      { createdAt: 'desc' }
    ]
  });
}

export async function getRecentWorkouts(days: number = 7) {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);
  cutoffDate.setHours(0, 0, 0, 0);
  
  return await client.workout.findMany({
    where: {
      date: {
        gte: cutoffDate
      }
    },
    orderBy: [
      { date: 'desc' },
      { createdAt: 'desc' }
    ]
  });
}

export async function addMeal(description: string, date?: string) {
  const mealDate = date ? new Date(date) : new Date();
  mealDate.setHours(0, 0, 0, 0); // Set to start of day to make it a proper date
  
  return await client.meal.create({
    data: {
      date: mealDate,
      description,
      createdAt: new Date(),
    }
  });
}

export async function getAllMeals() {
  return await client.meal.findMany({
    orderBy: [
      { date: 'desc' },
      { createdAt: 'desc' }
    ]
  });
}

export async function deleteWorkout(id: string) {
  try {
    await client.workout.delete({
      where: { id }
    });
    return true;
  } catch (error) {
    console.error('Error deleting workout:', error);
    return false;
  }
}

export async function deleteMeal(id: string) {
  try {
    await client.meal.delete({
      where: { id }
    });
    return true;
  } catch (error) {
    console.error('Error deleting meal:', error);
    return false;
  }
}

export async function getRecentMeals(days: number = 7) {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);
  cutoffDate.setHours(0, 0, 0, 0);
  
  return await client.meal.findMany({
    where: {
      date: {
        gte: cutoffDate
      }
    },
    orderBy: [
      { date: 'desc' },
      { createdAt: 'desc' }
    ]
  });
}