'use client'

import { useState, useEffect } from "react"
// Removed db imports since using API calls directly
export default function Home() {
	//state for workouts and meals
	const [meals, setMeals] = useState<any[]>([]);
	const [workouts, setWorkouts] = useState<any[]>([]);

	//state for form inputs
	const [workoutInput, setWorkoutInput] = useState('');
	const [mealInput, setMealInput] = useState('');

	useEffect(() => {
		//load data: Fetch workouts and meals
		const fetchWorkouts = async () => {
			try {
				const response = await fetch('/api/workouts');

				if (!response.ok) {
					throw new Error(`HTTP error! status: ${response.status}`)
				}
				const result = await response.json();
				setWorkouts(result.workouts);
			} catch (error) {

			};
		};

		const fetchMeals = async () => {
			try {
				const response = await fetch('/api/meals');

				if (!response.ok) {
					throw new Error(`HTTP error! status: ${response.status}`)
				}
				const result = await response.json();
				console.log('Meals result:', result);
				setMeals(result.meals);
			} catch (error) {

			};
		};

		fetchWorkouts();
		fetchMeals();

	}, []);

	// Handle workout submission
	const handleAddWorkout = async (e: React.FormEvent) => {
		e.preventDefault();
		// TODO: POST to /api/workouts
		if (!workoutInput.trim()) return;
		try {
			const response = await fetch('/api/workouts', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ description: workoutInput })
			});
			if (!response.ok) {
				throw new Error('failed to add workout');
			}
			setWorkoutInput('')
			// TODO: Refresh workout list
			const workoutRefresh = await fetch('/api/workouts')
			const result = await workoutRefresh.json();
			setWorkouts(result.workouts)
		} catch (error) {
			console.error("Error adding workout:", error);

		}

	};

	// Handle meal submission
	const handleAddMeal = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!mealInput.trim()) return;
		try {
			const response = await fetch('/api/meals', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ description: mealInput })
			});
			if (!response.ok) {
				throw new Error('failed to add meal');
			}

			console.log('Meal added, refreshing list...'); // ADD THIS

			setMealInput('');

			const mealRefresh = await fetch('/api/meals');
			const result = await mealRefresh.json();

			console.log('Fetched meals:', result.meals); // ADD THIS

			setMeals(result.meals);

			console.log('State updated'); // ADD THIS
		} catch (error) {
			console.error("Error adding meal:", error);
		}
	};


	return (
		<div className="min-h-screen p-8">
			<h1 className="text-4xl font-bold mb-8">MCP Fitness</h1>

			{/* Workout Form */}
			<div className="mb-8">
				<h2 className="text-2xl font-bold mb-4">Log Workout</h2>
				<form onSubmit={handleAddWorkout}>
					<div>
						<input
							type="text"
							value={workoutInput}
							onChange={(e) => setWorkoutInput(e.target.value)}
							placeholder="Enter workout log"
							className="border p-2 mr-2"
						/>
						<button type="submit" className="bg-blue-500 text-white px-4 py-2">
							Submit
						</button>
					</div>
				</form>
			</div>

			{/* Meal Form */}
			<div className="mb-8">
				<h2 className="text-2xl font-bold mb-4">Log Meal</h2>
				<form onSubmit={handleAddMeal}>
					<div>
						<input
							type="text"
							value={mealInput}
							onChange={(e) => setMealInput(e.target.value)}
							placeholder="Enter meal log"
							className="border p-2 mr-2"
						/>
						<button type="submit" className="bg-blue-500 text-white px-4 py-2">
							Submit
						</button>
					</div>
				</form>
			</div>

			{/* Display Lists */}
			<div className="grid grid-cols-2 gap-8">
				<div>
					<h2 className="text-2xl font-bold mb-4">Recent Workouts</h2>

					{workouts.length === 0 ? (
						<p>No workouts yet</p>
					) : (
						<ul>
							{workouts.map((workout: any) => (
								<li key={workout.id} className="mb-2 p-2 border">
									<p className="font-bold">{workout.date}</p>
									<p>{workout.description}</p>
								</li>
							))}
						</ul>
					)}
				</div>
				<div>
					<h2 className="text-2xl font-bold mb-4">Recent Meals</h2>
					{/* TODO: Map over meals */}
					{meals?.length === 0 ? (
						<p>No meals yet</p>
					) : (
						<ul>
							{meals.map((meal: any) => (
								<li key={meal.id} className="mb-2 p-2 border">
									<p className="font-bold">{meal.date}</p>
									<p>{meal.description}</p>
								</li>
							))}
						</ul>
					)}
				</div>
			</div>
		</div>
	);
}