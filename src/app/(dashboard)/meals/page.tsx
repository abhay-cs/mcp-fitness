"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { IconAvocado, IconPlus, IconTrash, IconCalendar, IconClock, IconSalad } from "@tabler/icons-react";
// import { MealLog } from "@/lib/db";

export default function MealsPage() {
  const [meals, setMeals] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newMeal, setNewMeal] = useState({ description: "", date: "" });
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchMeals();
  }, []);

  const fetchMeals = async () => {
    try {
      const response = await fetch('/api/meals');
      const data = await response.json();
      // Ensure data.meals is an array, default to empty array if not
      setMeals(data.meals || []);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching meals:", error);
      setMeals([]); // Ensure we always have an array
      setIsLoading(false);
    }
  };

  const handleAddMeal = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMeal.description.trim()) {
      return;
    }

    try {
      const response = await fetch('/api/meals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          description: newMeal.description,
          date: newMeal.date || new Date().toISOString().split('T')[0],
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setMeals([data.meal, ...meals]); // Add new meal to the top
        setNewMeal({ description: "", date: "" });
        setShowForm(false);
      } else {
        console.error("Failed to add meal");
      }
    } catch (error) {
      console.error("Error adding meal:", error);
    }
  };

  const handleDeleteMeal = async (id: string) => {
    try {
      const response = await fetch(`/api/meals/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setMeals(meals.filter(meal => meal.id !== id));
      } else {
        console.error("Failed to delete meal");
      }
    } catch (error) {
      console.error("Error deleting meal:", error);
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
                  <IconSalad className="h-6 w-6 text-primary" />
                </div>
                <h1 className="text-3xl font-bold tracking-tight">Meal Log</h1>
              </div>
              <p className="text-muted-foreground ml-9">
                Track your meals and nutrition habits
              </p>
            </div>
            <Button 
              onClick={() => setShowForm(!showForm)}
              className="h-10 px-4"
            >
              <IconPlus className="mr-2 h-4 w-4" /> 
              {showForm ? "Cancel" : "Add Meal"}
            </Button>
          </div>
        </div>

        {/* Add Meal Form */}
        {showForm && (
          <Card className="mb-8 border-0 shadow-lg bg-gradient-to-br from-primary/5 to-secondary/5">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2">
                <IconSalad className="h-5 w-5" />
                New Meal
              </CardTitle>
              <CardDescription>Add a new meal to your log</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddMeal} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="date" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Date
                    </label>
                    <Input
                      id="date"
                      type="date"
                      value={newMeal.date}
                      onChange={(e) => setNewMeal({...newMeal, date: e.target.value})}
                      className="h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="mealType" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Meal Type
                    </label>
                    <Input
                      id="mealType"
                      placeholder="e.g., Breakfast, Lunch, Dinner, Snack"
                      value={newMeal.description}
                      onChange={(e) => setNewMeal({...newMeal, description: e.target.value})}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="details" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Meal Details
                  </label>
                  <Textarea
                    id="details"
                    placeholder="e.g., Grilled chicken with vegetables, protein shake, etc."
                    value={newMeal.description}
                    onChange={(e) => setNewMeal({...newMeal, description: e.target.value})}
                    rows={4}
                    className="resize-none"
                  />
                  <p className="text-xs text-muted-foreground">
                    Describe your meal: what you ate, portion sizes, calories, etc.
                  </p>
                </div>
                
                <div className="flex justify-end">
                  <Button type="submit" className="h-11 px-6">
                    <IconPlus className="mr-2 h-4 w-4" />
                    Add Meal
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Stats Summary */}
        <div className="grid gap-6 mb-8 md:grid-cols-3">
          <Card className="border-1 shadow-lg bg-gradient-to-br from-green-50 to-emerald-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Meals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{meals.length}</div>
              <p className="text-xs text-muted-foreground mt-1">All time</p>
            </CardContent>
          </Card>
          
          <Card className="border-1 shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">This Week</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {meals.filter(m => {
                  const mealDate = new Date(m.date);
                  const weekAgo = new Date();
                  weekAgo.setDate(weekAgo.getDate() - 7);
                  return mealDate >= weekAgo;
                }).length}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Consumed meals</p>
            </CardContent>
          </Card>
          
          <Card className="border-1 shadow-lg bg-gradient-to-br from-orange-50 to-amber-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Last Meal</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {meals.length > 0 
                  ? new Date(meals[0].date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                  : "—"
                }
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {meals.length > 0 
                  ? new Date(meals[0].date).toLocaleDateString('en-US', { weekday: 'long' })
                  : "No meals yet"}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Meals List */}
        <Card className="border-1 shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2">
              <IconAvocado className="h-5 w-5" />
              Recent Meals
            </CardTitle>
            <CardDescription className="mt-1">
              {meals.length > 0 
                ? "Your most recent meals" 
                : "No meals logged yet"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {meals.length === 0 ? (
              <div className="py-12 text-center">
                <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                  <IconAvocado className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium mb-1">No meals yet</h3>
                <p className="text-muted-foreground mb-4">
                  Get started by adding your first meal
                </p>
                <Button 
                  onClick={() => setShowForm(true)}
                  className="h-10 px-4"
                >
                  <IconPlus className="mr-2 h-4 w-4" />
                  Add Your First Meal
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {meals.map((meal, index) => (
                  <div 
                    key={meal.id} 
                    className="p-5 rounded-xl border transition-all hover:shadow-md hover:border-primary/20"
                  >
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="flex items-center gap-1.5 text-muted-foreground">
                            <IconCalendar className="h-3.5 w-3.5" />
                            <span className="text-sm">
                              {new Date(meal.date).toLocaleDateString('en-US', { 
                                weekday: 'short', 
                                month: 'short', 
                                day: 'numeric' 
                              })}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 text-muted-foreground">
                            <IconClock className="h-3.5 w-3.5" />
                            <span className="text-sm">
                              {new Date(meal.createdAt).toLocaleTimeString([], { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              })}
                            </span>
                          </div>
                        </div>
                        
                        <h3 className="text-lg font-semibold mb-1">{meal.description.split('\n')[0]}</h3>
                        
                        {meal.description.split('\n').length > 1 && (
                          <div className="mt-2">
                            {meal.description.split('\n').slice(1).map((line:any, i:any) => (
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
                          onClick={() => handleDeleteMeal(meal.id)}
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