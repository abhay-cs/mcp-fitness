import { NextResponse } from "next/server";
import { getAllWorkouts, getRecentWorkouts, getAllMeals, getRecentMeals } from "@/app/lib/db";

export async function GET() {
  try {
    // Get all workouts and meals
    const allWorkouts = await getAllWorkouts();
    const allMeals = await getAllMeals();
    
    // Get recent workouts and meals (last 7 days)
    const recentWorkouts = await getRecentWorkouts(7);
    const recentMeals = await getRecentMeals(7);
    
    // Calculate stats
    const stats = {
      totalWorkouts: allWorkouts.length,
      totalMeals: allMeals.length,
      workoutsThisWeek: recentWorkouts.length,
      mealsThisWeek: recentMeals.length,
      lastWorkoutDate: allWorkouts.length > 0 
        ? allWorkouts[0].date 
        : null,
      lastMealDate: allMeals.length > 0 
        ? allMeals[0].date 
        : null,
    };

    return NextResponse.json({ stats });
  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}