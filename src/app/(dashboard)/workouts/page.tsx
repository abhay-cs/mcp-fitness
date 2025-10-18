"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { IconJumpRope, IconPlus, IconTrash, IconCalendar, IconClock, IconBarbell } from "@tabler/icons-react";
// import { WorkoutLog } from "@/app/lib/db";

export default function WorkoutsPage() {
  const [workouts, setWorkouts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newWorkout, setNewWorkout] = useState({ description: "", date: "" });
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchWorkouts();
  }, []);

  const fetchWorkouts = async () => {
    try {
      const response = await fetch('/api/workouts');
      const data = await response.json();
      // Ensure data.workouts is an array, default to empty array if not
      setWorkouts(data.workouts || []);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching workouts:", error);
      setWorkouts([]); // Ensure we always have an array
      setIsLoading(false);
    }
  };

  const handleAddWorkout = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newWorkout.description.trim()) {
      return;
    }

    try {
      const response = await fetch('/api/workouts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          description: newWorkout.description,
          date: newWorkout.date || new Date().toISOString().split('T')[0],
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setWorkouts([data.workout, ...workouts]); // Add new workout to the top
        setNewWorkout({ description: "", date: "" });
        setShowForm(false);
      } else {
        console.error("Failed to add workout");
      }
    } catch (error) {
      console.error("Error adding workout:", error);
    }
  };

  const handleDeleteWorkout = async (id: string) => {
    try {
      const response = await fetch(`/api/workouts/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setWorkouts(workouts.filter(workout => workout.id !== id));
      } else {
        console.error("Failed to delete workout");
      }
    } catch (error) {
      console.error("Error deleting workout:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="px-4 lg:px-6 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse space-y-8">
            <div className="flex items-center justify-between">
              <div className="h-8 bg-gray-200 rounded w-64"></div>
              <div className="h-10 bg-gray-200 rounded w-32"></div>
            </div>
            
            <div className="grid gap-6 md:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-32 bg-gray-200 rounded-xl p-6"></div>
              ))}
            </div>
            
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-24 bg-gray-200 rounded-xl p-6"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 lg:px-6 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="mb-10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-2">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <div className="p-2 rounded-lg bg-primary/10">
                  <IconBarbell className="h-6 w-6 text-primary" />
                </div>
                <h1 className="text-3xl font-bold tracking-tight">Workout Log</h1>
              </div>
              <p className="text-muted-foreground ml-9">
                Track your exercise routines and fitness progress
              </p>
            </div>
            <Button 
              onClick={() => setShowForm(!showForm)}
              className="h-10 px-4"
            >
              <IconPlus className="mr-2 h-4 w-4" /> 
              {showForm ? "Cancel" : "Add Workout"}
            </Button>
          </div>
        </div>

        {/* Add Workout Form */}
        {showForm && (
          <Card className="mb-8 border-0 shadow-lg bg-gradient-to-br from-primary/5 to-secondary/5">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2">
                <IconBarbell className="h-5 w-5" />
                New Workout
              </CardTitle>
              <CardDescription>Add a new workout to your log</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddWorkout} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="date" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Date
                    </label>
                    <Input
                      id="date"
                      type="date"
                      value={newWorkout.date}
                      onChange={(e) => setNewWorkout({...newWorkout, date: e.target.value})}
                      className="h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="description" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Workout Type
                    </label>
                    <Input
                      id="description"
                      placeholder="e.g., Strength Training, Cardio, Yoga"
                      value={newWorkout.description}
                      onChange={(e) => setNewWorkout({...newWorkout, description: e.target.value})}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="details" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Workout Details
                  </label>
                  <Textarea
                    id="details"
                    placeholder="e.g., 5x5 squats at 225lbs, 30 minutes cardio, etc."
                    value={newWorkout.description}
                    onChange={(e) => setNewWorkout({...newWorkout, description: e.target.value})}
                    rows={4}
                    className="resize-none"
                  />
                  <p className="text-xs text-muted-foreground">
                    Describe your workout in detail: exercises performed, weights, duration, etc.
                  </p>
                </div>
                
                <div className="flex justify-end">
                  <Button type="submit" className="h-11 px-6">
                    <IconPlus className="mr-2 h-4 w-4" />
                    Add Workout
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Stats Summary */}
        <div className="grid gap-6 mb-8 md:grid-cols-3">
          <Card className="border-1 shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Workouts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{workouts.length}</div>
              <p className="text-xs text-muted-foreground mt-1">All time</p>
            </CardContent>
          </Card>
          
          <Card className="border-1 shadow-lg bg-gradient-to-br from-green-50 to-emerald-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">This Week</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {workouts.filter(w => {
                  const workoutDate = new Date(w.date);
                  const weekAgo = new Date();
                  weekAgo.setDate(weekAgo.getDate() - 7);
                  return workoutDate >= weekAgo;
                }).length}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Completed sessions</p>
            </CardContent>
          </Card>
          
          <Card className="border-1 shadow-lg bg-gradient-to-br from-purple-50 to-pink-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Last Workout</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {workouts.length > 0 
                  ? new Date(workouts[0].date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                  : "—"
                }
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {workouts.length > 0 
                  ? new Date(workouts[0].date).toLocaleDateString('en-US', { weekday: 'long' })
                  : "No workouts yet"}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Workouts List */}
        <Card className="border-1 shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2">
              <IconJumpRope className="h-5 w-5" />
              Recent Workouts
            </CardTitle>
            <CardDescription className="mt-1">
              {workouts.length > 0 
                ? "Your most recent workout sessions" 
                : "No workouts logged yet"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {workouts.length === 0 ? (
              <div className="py-12 text-center">
                <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                  <IconJumpRope className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium mb-1">No workouts yet</h3>
                <p className="text-muted-foreground mb-4">
                  Get started by adding your first workout
                </p>
                <Button 
                  onClick={() => setShowForm(true)}
                  className="h-10 px-4"
                >
                  <IconPlus className="mr-2 h-4 w-4" />
                  Add Your First Workout
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {workouts.map((workout, index) => (
                  <div 
                    key={workout.id} 
                    className="p-5 rounded-xl border transition-all hover:shadow-md hover:border-primary/20"
                  >
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="flex items-center gap-1.5 text-muted-foreground">
                            <IconCalendar className="h-3.5 w-3.5" />
                            <span className="text-sm">
                              {new Date(workout.date).toLocaleDateString('en-US', { 
                                weekday: 'short', 
                                month: 'short', 
                                day: 'numeric' 
                              })}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 text-muted-foreground">
                            <IconClock className="h-3.5 w-3.5" />
                            <span className="text-sm">
                              {new Date(workout.createdAt).toLocaleTimeString([], { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              })}
                            </span>
                          </div>
                        </div>
                        
                        <h3 className="text-lg font-semibold mb-1">{workout.description.split('\n')[0]}</h3>
                        
                        {workout.description.split('\n').length > 1 && (
                          <div className="mt-2">
                            {workout.description.split('\n').slice(1).map((line: string, i: number) => (
                              <p key={i} className="text-sm text-muted-foreground mb-1 last:mb-0">
                                {line.trim()}
                              </p>
                            ))}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2 mt-4">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleDeleteWorkout(workout.id)}
                          className="h-8 w-8 p-0 border-transparent hover:border-destructive/50"
                        >
                          <IconTrash className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}