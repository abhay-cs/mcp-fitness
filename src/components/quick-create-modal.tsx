"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { IconTreadmill, IconBowlChopsticks, IconX } from "@tabler/icons-react";

interface QuickCreateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function QuickCreateModal({ open, onOpenChange }: QuickCreateModalProps) {
  const [activeTab, setActiveTab] = useState<"workout" | "meal">("workout");
  const [workoutDescription, setWorkoutDescription] = useState("");
  const [mealDescription, setMealDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreateWorkout = async () => {
    if (!workoutDescription.trim()) return;

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/workouts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          description: workoutDescription,
          date: new Date().toISOString().split('T')[0],
        }),
      });

      if (response.ok) {
        setWorkoutDescription("");
        onOpenChange(false);
      }
    } catch (error) {
      console.error("Error creating workout:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateMeal = async () => {
    if (!mealDescription.trim()) return;

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/meals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          description: mealDescription,
          date: new Date().toISOString().split('T')[0],
        }),
      });

      if (response.ok) {
        setMealDescription("");
        onOpenChange(false);
      }
    } catch (error) {
      console.error("Error creating meal:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md p-0">
        <DialogHeader className="p-4 pb-2 border-b relative">
          <DialogTitle>
            <span>Quick Create</span>
          </DialogTitle>
        </DialogHeader>

        <div className="p-4">
          {/* Tab selector */}
          <div className="flex border-b mb-4">
            <button
              className={`flex-1 py-2 text-center ${activeTab === "workout" ? "border-b-2 border-primary text-primary font-medium" : "text-muted-foreground"}`}
              onClick={() => setActiveTab("workout")}
            >
              <IconTreadmill className="inline-block mr-2 h-4 w-4" />
              Workout
            </button>
            <button
              className={`flex-1 py-2 text-center ${activeTab === "meal" ? "border-b-2 border-primary text-primary font-medium" : "text-muted-foreground"}`}
              onClick={() => setActiveTab("meal")}
            >
              <IconBowlChopsticks className="inline-block mr-2 h-4 w-4" />
              Meal
            </button>
          </div>

          {/* Tab content */}
          {activeTab === "workout" ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <Input
                  placeholder="Workout description"
                  value={workoutDescription}
                  onChange={(e) => setWorkoutDescription(e.target.value)}
                  className="h-11"
                />
              </div>
              <Button
                onClick={handleCreateWorkout}
                disabled={isSubmitting || !workoutDescription.trim()}
                className="w-full"
              >
                {isSubmitting ? "Creating..." : "Create Workout"}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                <Input
                  placeholder="Meal description"
                  value={mealDescription}
                  onChange={(e) => setMealDescription(e.target.value)}
                  className="h-11"
                />
              </div>
              <Button
                onClick={handleCreateMeal}
                disabled={isSubmitting || !mealDescription.trim()}
                className="w-full"
              >
                {isSubmitting ? "Creating..." : "Create Meal"}
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}