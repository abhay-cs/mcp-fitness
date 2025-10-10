import { NextResponse } from "next/server";
import { addMeal, getAllMeals } from "@/app/lib/db";

export async function GET() {
    try {
        const meals = getAllMeals()
        return NextResponse.json({ meals });
    } catch (error) {
        console.log(error);
        return NextResponse.json(
            { error: 'Failed to fetch meals' },
            { status: 500 }
        )
    }
}

export async function POST(request: Request) {
    try {
        // Get description and date from request body
        const body = await request.json()
        const { description, date } = body
        // Validate description exists
        if (!description) {
            return NextResponse.json(
                { error: "Description is required" },
                { status: 400 }
            )
        }
        // Call addWorkout()
        const meal = addMeal(description, date);
        // Return the new workout
        return NextResponse.json({ meal }, { status: 201 })
    } catch (error) {
        // Handle errors
        console.log(error)
        return NextResponse.json(
            { error: 'failed to add meal' },
            { status: 500 }
        )
    }
}