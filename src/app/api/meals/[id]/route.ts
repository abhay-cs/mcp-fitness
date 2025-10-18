import { NextResponse } from "next/server";
import { deleteMeal } from "@/app/lib/db";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    if (!id) {
      return NextResponse.json(
        { error: "Meal ID is required" },
        { status: 400 }
      );
    }
    
    const success = await deleteMeal(id);
    
    if (success) {
      return NextResponse.json({ message: "Meal deleted successfully" });
    } else {
      return NextResponse.json(
        { error: "Meal not found" },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error("Error deleting meal:", error);
    return NextResponse.json(
      { error: "Failed to delete meal" },
      { status: 500 }
    );
  }
}