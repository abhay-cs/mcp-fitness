import { NextResponse } from "next/server";
import { addMeal, getAllMeals } from "@/app/lib/db";

export async function GET() {
    try {
        const meals = await getAllMeals();
        return NextResponse.json({ meals });
    } catch (error) {
        console.error('Error fetching meals:', error);
        return NextResponse.json(
            { error: 'Failed to fetch meals' },
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
        
        // Call addMeal()
        const meal = await addMeal(description, date);
        
        // Return the new meal
        return NextResponse.json({ meal }, { status: 201 });
    } catch (error) {
        console.error('Error adding meal:', error);
        return NextResponse.json(
            { error: 'Failed to add meal' },
            { status: 500 }
        );
    }
}