#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

const API_BASE_URL = 'http://localhost:3001/api';

const server = new Server(
  {
    name: 'vitals-fitness-tracker',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'log_workout',
        description: 'Log a workout session. Provide a description of the workout (e.g., "5x5 squats at 225lbs", "30 min run").',
        inputSchema: {
          type: 'object',
          properties: {
            description: {
              type: 'string',
              description: 'Description of the workout',
            },
            date: {
              type: 'string',
              description: 'Date in YYYY-MM-DD format (optional, defaults to today)',
            },
          },
          required: ['description'],
        },
      },
      {
        name: 'log_meal',
        description: 'Log a meal. Provide a description of what you ate (e.g., "Grilled chicken with rice and broccoli").',
        inputSchema: {
          type: 'object',
          properties: {
            description: {
              type: 'string',
              description: 'Description of the meal',
            },
            date: {
              type: 'string',
              description: 'Date in YYYY-MM-DD format (optional, defaults to today)',
            },
          },
          required: ['description'],
        },
      },
      {
        name: 'get_workouts',
        description: 'Get recent workouts from the last 7 days.',
        inputSchema: {
          type: 'object',
          properties: {
            days: {
              type: 'number',
              description: 'Number of days to look back (optional, defaults to 7)',
            },
          },
        },
      },
      {
        name: 'get_meals',
        description: 'Get recent meals from the last 7 days.',
        inputSchema: {
          type: 'object',
          properties: {
            days: {
              type: 'number',
              description: 'Number of days to look back (optional, defaults to 7)',
            },
          },
        },
      },
      {
        name: 'get_stats',
        description: 'Get fitness statistics including total workouts, meals, and weekly activity.',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },
    ],
  };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request): Promise<any> => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case 'log_workout': {
        const response = await fetch(`${API_BASE_URL}/workouts`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            description: args?.description,
            date: args?.date,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to log workout');
        }

        const result = await response.json();

        return {
          content: [
            {
              type: 'text',
              text: `✅ Workout logged successfully!\n\n📅 Date: ${result.workout.date}\n💪 Details: ${result.workout.description}`,
            },
          ],
        };
      }

      case 'log_meal': {
        const response = await fetch(`${API_BASE_URL}/meals`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            description: args?.description,
            date: args?.date,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to log meal');
        }

        const result = await response.json();

        return {
          content: [
            {
              type: 'text',
              text: `✅ Meal logged successfully!\n\n📅 Date: ${result.meal.date}\n🍽️ Details: ${result.meal.description}`,
            },
          ],
        };
      }

      case 'get_workouts': {
        const response = await fetch(`${API_BASE_URL}/workouts`);

        if (!response.ok) {
          throw new Error('Failed to fetch workouts');
        }

        const result = await response.json();

        if (result.workouts.length === 0) {
          return {
            content: [
              {
                type: 'text',
                text: '💪 No workouts found yet. Start logging your fitness journey!',
              },
            ],
          };
        }

        const limit = args?.days ? parseInt(args.days as string) : 7;
        const workoutsList = result.workouts
          .slice(0, limit)
          .map((w: any) => `📅 ${w.date}: ${w.description}`)
          .join('\n');

        return {
          content: [
            {
              type: 'text',
              text: `💪 Recent Workouts:\n\n${workoutsList}`,
            },
          ],
        };
      }

      case 'get_meals': {
        const response = await fetch(`${API_BASE_URL}/meals`);

        if (!response.ok) {
          throw new Error('Failed to fetch meals');
        }

        const result = await response.json();

        if (result.meals.length === 0) {
          return {
            content: [
              {
                type: 'text',
                text: '🍽️ No meals found yet. Start tracking your nutrition!',
              },
            ],
          };
        }

        const limit = args?.days ? parseInt(args.days as string) : 7;
        const mealsList = result.meals
          .slice(0, limit)
          .map((m: any) => `📅 ${m.date}: ${m.description}`)
          .join('\n');

        return {
          content: [
            {
              type: 'text',
              text: `🍽️ Recent Meals:\n\n${mealsList}`,
            },
          ],
        };
      }

      case 'get_stats': {
        const response = await fetch(`${API_BASE_URL}/stats`);

        if (!response.ok) {
          throw new Error('Failed to fetch stats');
        }

        const result = await response.json();
        const { stats } = result;

        return {
          content: [
            {
              type: 'text',
              text: `📊 Fitness Stats\n\n💪 Total Workouts: ${stats.totalWorkouts}\n🍽️ Total Meals: ${stats.totalMeals}\n\n📅 This Week:\n  • Workouts: ${stats.workoutsThisWeek}\n  • Meals: ${stats.mealsThisWeek}\n\n🕐 Last Activity:\n  • Last Workout: ${stats.lastWorkoutDate || 'None'}\n  • Last Meal: ${stats.lastMealDate || 'None'}`,
            },
          ],
        };
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    return {
      content: [
        {
          type: 'text',
          text: `❌ Error: ${error instanceof Error ? error.message : String(error)}`,
        },
      ],
    };
  }
});

// Start server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Vitals Fitness MCP Server running on stdio');
}

main().catch((error) => {
  console.error('Server error:', error);
  process.exit(1);
});