'use client';

import {
  IconCarrot
} from "@tabler/icons-react"

interface StatCardProps {
    label: string;
    value: string | number;
    icon?: string;
}

function StatCard({ label, value, icon }: StatCardProps) {
    return (
        <div className="bg-white border rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm text-gray-600 mb-1">{label}</p>
                    <p className="text-3xl font-bold">{value}</p>
                </div>
                {icon && <span className="text-4xl">{icon}</span>}
            </div>
        </div>
    );
}

interface StatsData {
    totalWorkouts: number;
    totalMeals: number;
    workoutsThisWeek: number;
    mealsThisWeek: number;
    lastWorkoutDate: string | null;
    lastMealDate: string | null;
}

interface StatsDashboardProps {
    stats: StatsData;
}

export default function StatsDashboard({ stats }: StatsDashboardProps) {
    return (
        <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Your Stats</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatCard
                    label="Total Workouts"
                    value={stats.totalWorkouts}
                    icon="💪"
                />
                <StatCard
                    label="Total Meals"
                    value={stats.totalMeals}
                    icon="🍽️"
                />
                <StatCard
                    label="This Week's Workouts"
                    value={stats.workoutsThisWeek}
                    icon="📅"
                />
                <StatCard
                    label="This Week's Meals"
                    value={stats.mealsThisWeek}
                    icon="IconCarrot"
                />
                <StatCard
                    label="Last Workout"
                    value={stats.lastWorkoutDate || 'None yet'}
                    icon="🏋️"
                />
                <StatCard
                    label="Last Meal"
                    value={stats.lastMealDate || 'None yet'}
                    icon="🍴"
                />
            </div>
        </div>
    );
}