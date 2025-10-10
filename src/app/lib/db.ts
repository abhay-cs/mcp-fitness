import Database from "better-sqlite3";
import { v4 as uuidv4 } from "uuid"


//types
export interface WorkoutLog {
    id: string;
    date: string;
    description: string;
    created_at: string;
}

export interface MealLog {
    id: string;
    date: string;
    description: string;
    created_at: string;
}

const db = new Database('fitness.db')

db.exec(`
  CREATE TABLE IF NOT EXISTS workouts (
    id TEXT PRIMARY KEY,
    date TEXT NOT NULL,
    description TEXT NOT NULL,
    created_at TEXT NOT NULL
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS meals (
    id TEXT PRIMARY KEY,
    date TEXT NOT NULL,
    description TEXT NOT NULL,
    created_at TEXT NOT NULL
  )
`);


export function addWorkout(description: string, date?: string): WorkoutLog {
    const workoutDate = date || new Date().toISOString().split('T')[0];
    const createdAt = new Date().toISOString();

    const workout = {
        id: uuidv4(), 
        date: workoutDate,
        description,
        created_at: createdAt
    };

    const stmt = db.prepare(
        'INSERT INTO workouts (id, date, description, created_at) VALUES (?, ?, ?, ?)'
    );
    stmt.run(workout.id, workout.date, workout.description, workout.created_at);

    return workout;
}

export function getAllWorkouts(): WorkoutLog[] {
    const stmt = db.prepare(
        'SELECT * FROM workouts ORDER BY date DESC, created_at DESC'
    );
    return stmt.all() as WorkoutLog[];
}


export function getRecentWorkouts(days: number = 7): WorkoutLog[] {

    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    const cutoff = cutoffDate.toISOString().split('T')[0];


    const stmt = db.prepare(
        'SELECT * FROM workouts WHERE date >= ? ORDER BY date DESC, created_at DESC'
    );
    return stmt.all(cutoff) as WorkoutLog[];
}

export function addMeal(description: string, date?: string): MealLog{

    const mealDate = date || new Date().toISOString().split('T')[0];
    const createdAt = new Date().toISOString();

    const meal = {
        id: uuidv4(), 
        date: mealDate,
        description,
        created_at: createdAt
    };

    const stmt = db.prepare(
        'INSERT INTO meals (id, date, description, created_at) VALUES (?, ?, ?, ?)'
    );
    stmt.run(meal.id, meal.date, meal.description, meal.created_at);
    return meal;
}

export function getAllMeals(): MealLog[]{
    const stmt = db.prepare(
        'SELECT * FROM workouts ORDER BY date DESC, created_at DESC'
    )
    return stmt.all() as MealLog[];

}

export function getRecentMeals(days: number = 7): MealLog[] {

    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    const cutoff = cutoffDate.toISOString().split('T')[0];


    const stmt = db.prepare(
        'SELECT * FROM meals WHERE date >= ? ORDER BY date DESC, created_at DESC'
    );
    return stmt.all(cutoff) as MealLog[];
}
console.log('Adding test workout...');
const workout = addWorkout('5x5 squats at 225lbs');
console.log('Workout added:', workout);

const workouts = getAllWorkouts();
console.log('All workouts:', workouts);
export default db;