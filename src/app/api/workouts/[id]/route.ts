import { NextResponse } from "next/server";
import { deleteWorkout } from "@/app/lib/db";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    if (!id) {
      return NextResponse.json(
        { error: "Workout ID is required" },
        { status: 400 }
      );
    }
    
    const success = await deleteWorkout(id);
    
    if (success) {
      return NextResponse.json({ message: "Workout deleted successfully" });
    } else {
      return NextResponse.json(
        { error: "Workout not found" },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error("Error deleting workout:", error);
    return NextResponse.json(
      { error: "Failed to delete workout" },
      { status: 500 }
    );
  }
}