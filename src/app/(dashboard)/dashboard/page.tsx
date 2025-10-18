"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { IconJumpRope, IconAvocado, IconBarbell, IconHome2,IconCirclePlusFilled } from '@tabler/icons-react';
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
export default function DashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [recentWorkouts, setRecentWorkouts] = useState<any[]>([]);
  const [recentMeals, setRecentMeals] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch stats
        const statsResponse = await fetch('/api/stats');
        const statsData = await statsResponse.json();
        setStats(statsData.stats || null);

        // Fetch recent workouts (last 5)
        const workoutsResponse = await fetch('/api/workouts');
        const workoutsData = await workoutsResponse.json();
        setRecentWorkouts(workoutsData.workouts?.slice(0, 5) || []);

        // Fetch recent meals (last 5)
        const mealsResponse = await fetch('/api/meals');
        const mealsData = await mealsResponse.json();
        setRecentMeals(mealsData.meals?.slice(0, 5) || []);
      } catch (error) {
        console.error('Error fetching data:', error);
        setStats(null);
        setRecentWorkouts([]);
        setRecentMeals([]);
      }
    };

    fetchData();
  }, []);

  if (!stats) return (
    <div className="px-4 lg:px-6 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-gray-200 rounded w-64"></div>

          <div className="h-48 bg-gray-200 rounded-xl"></div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="h-64 bg-gray-200 rounded-xl"></div>
            <div className="h-64 bg-gray-200 rounded-xl"></div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="px-4 lg:px-6 py-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Welcome Section */}
        <div className="mb-10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-2">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <div className="p-2 rounded-lg bg-primary/10">
                  <IconHome2 className="h-6 w-6 text-primary" />
                </div>
                <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
              </div>
              <p className="text-muted-foreground ml-9">
                Track your fitness journey.
              </p>
            </div>
            <Button
              // onClick={() => setShowForm(!showForm)}
              className="h-10 px-4"
            >
              <IconCirclePlusFilled className="mr-2 h-4 w-4" />
              {/* {showForm ? "Cancel" : "Add Meal"} */}
              {"Quick Log"}
            </Button>
          </div>
        </div>

        {/* Activity Summary Card */}
        <Card className="border-1 shadow-lg bg-gradient-to-br from-indigo-50 to-purple-50">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-primary/10">
                <IconBarbell className="h-5 w-5 text-primary" />
              </div>
              Activity Summary
            </CardTitle>
            <CardDescription className="mt-1">Your fitness activity at a glance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-3">
              <div className="flex flex-col">
                <div className="text-sm text-muted-foreground mb-1">Last Workout</div>
                <div className="text-lg font-semibold">
                  {stats?.lastWorkoutDate || "No workouts yet"}
                </div>
              </div>

              <div className="flex flex-col">
                <div className="text-sm text-muted-foreground mb-1">Last Meal</div>
                <div className="text-lg font-semibold">
                  {stats?.lastMealDate || "No meals yet"}
                </div>
              </div>

              <div className="flex flex-col">
                <div className="text-sm text-muted-foreground mb-3">Weekly Progress</div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Workouts</span>
                      <span className="font-semibold">{stats?.workoutsThisWeek}/7</span>
                    </div>
                    <Progress value={(stats?.workoutsThisWeek / 7) * 100} className="h-2 bg-gray-200" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Meals</span>
                      <span className="font-semibold">{stats?.mealsThisWeek}/21</span>
                    </div>
                    <Progress value={(stats?.mealsThisWeek / 21) * 100} className="h-2 bg-gray-200" />
                  </div>

                  <div className="text-xs text-muted-foreground pt-2 border-t border-muted">
                    {/* {stats?.workoutsThisWeek + stats?.mealsThisWeek} total activities this week */}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity Section */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Recent Workouts */}
          <Card className="border-1 shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2">
                <IconJumpRope className="h-5 w-5 text-primary" />
                Recent Workouts
              </CardTitle>
              <CardDescription className="mt-1">Your latest training sessions</CardDescription>
            </CardHeader>
            <CardContent>
              {recentWorkouts.length === 0 ? (
                <div className="py-8 text-center">
                  <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
                    <IconJumpRope className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    No workouts logged yet
                  </p>
                </div>
              ) : (
                <div className="space-y-5">
                  {recentWorkouts.map((workout, index) => (
                    <div key={workout.id} className="pb-5 last:pb-0">
                      {index > 0 && <Separator className="my-2" />}
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">
                            {new Date(workout.date).toLocaleDateString('en-US', {
                              weekday: 'short',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </span>
                          <Badge variant="default" className="bg-primary/10 text-primary hover:bg-primary/10 text-xs px-2.5 py-0.5">
                            Workout
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {workout.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Meals */}
          <Card className="border-1 shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2">
                <IconAvocado className="h-5 w-5 text-primary" />
                Recent Meals
              </CardTitle>
              <CardDescription className="mt-1">Your latest nutrition logs</CardDescription>
            </CardHeader>
            <CardContent>
              {recentMeals.length === 0 ? (
                <div className="py-8 text-center">
                  <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
                    <IconAvocado className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    No meals logged yet
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentMeals.map((meal, index) => (
                    <div key={meal.id} className="pb-1 last:pb-0">
                      {index > 0 && <Separator className="my-2" />}
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">
                            {new Date(meal.date).toLocaleDateString('en-US', {
                              weekday: 'short',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </span>
                          <Badge variant="outline" className="text-xs px-2.5 py-0.5 border-green-200 text-green-700 dark:text-green-300">
                            Meal
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {meal.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}