import { NextResponse } from "next/server";
import { addWorkout, getAllWorkouts } from "@/app/lib/db";

export async function GET() {
    try {
        const allWorkouts = await getAllWorkouts();
        return NextResponse.json({ workouts: allWorkouts });
    } catch (error) {
        console.error('Error fetching workouts:', error);
        return NextResponse.json(
            { error: 'Failed to fetch workouts' },
            { status: 500 }
        )
    }
}

export async function POST(request: Request) {
    try {
        // Get description and date from request body
        const body = await request.json();
        const { description, date } = body;
        
        // Validate description exists
        if (!description || typeof description !== 'string' || description.trim().length === 0) {
            return NextResponse.json(
                { error: "Description is required" },
                { status: 400 }
            );
        }
        
        // Optional date validation
        if (date && isNaN(Date.parse(date))) {
            return NextResponse.json(
                { error: "Invalid date format" },
                { status: 400 }
            );
        }
        
        // Call addWorkout()
        const workout = await addWorkout(description, date);
        
        // Return the new workout
        return NextResponse.json({ workout }, { status: 201 });
    } catch (error) {
        console.error('Error adding workout:', error);
        return NextResponse.json(
            { error: 'Failed to add workout' },
            { status: 500 }
        );
    }
}