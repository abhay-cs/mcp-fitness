"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { IconTrendingUp, IconTrendingDown, IconMinus, IconCarrot } from "@tabler/icons-react"
import { useEffect, useState } from "react"

export function SectionCards() {
  const [stats, setStats] = useState<any>(null)

  useEffect(() => {
    fetch('/api/stats')
      .then(res => res.json())
      .then(data => setStats(data.stats))
  }, [])

  if (stats) return <div>Loading...</div>

  const cards = [
    {
      title: "Total Workouts",
      value: stats?.totalWorkouts || "None",
      description: "All time",
      icon: "💪",
    },
    {
      title: "Total Meals",
      value: stats?.totalMeals || "None",
      description: "All time",
      icon: "🍽️",
    },
    {
      title: "This Week's Workouts",
      value: stats?.workoutsThisWeek || "None",
      description: "Last 7 days",
      icon: "📅",
    },
    {
      title: "This Week's Meals",
      value: stats?.mealsThisWeek || "None",
      description: "Last 7 days",
      icon: <IconCarrot className="text-2xl" />,
    },
    {
      title: "Last Workout",
      value: stats?.lastWorkoutDate || "None",
      description: "Most recent",
      icon: "🏋️",
    },
    {
      title: "Last Meal",
      value: stats?.lastMealDate || "None",
      description: "Most recent",
      icon: "🍴",
    },
  ]

  return (
    <div className="grid gap-4 px-4 sm:grid-cols-2 lg:grid-cols-3 lg:px-6">
      {cards.map((card, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {card.title}
            </CardTitle>
            <span className="text-2xl">{card.icon}</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{card.value}</div>
            <p className="text-xs text-muted-foreground">
              {card.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}