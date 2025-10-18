# Vitals - AI-Powered Fitness Tracker

A modern fitness tracking application with integrated AI assistant capabilities through the Model Context Protocol (MCP). Track your workouts and meals, view your progress, and interact with your fitness data using any MCP-compatible AI assistant.

<!-- ![Vitals Dashboard](./public/screenshot.png) -->

## 🌟 Features

- **📊 Dashboard** - View your fitness stats, weekly progress, and recent activity at a glance
- **💪 Workout Tracking** - Log and manage your workout sessions
- **🍽️ Meal Tracking** - Track your nutrition and meal logs
- **🤖 Platform-Agnostic AI Integration** - Interact with your fitness data using any MCP-compatible AI assistant (Claude, future AI tools)
- **📈 Statistics** - Track total workouts, meals, weekly progress, and activity streaks
- **🎨 Modern UI** - Built with shadcn/ui components and Tailwind CSS
- **☁️ Cloud Database** - PostgreSQL database hosted on Neon

## 🚀 Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - High-quality UI components
- **Tabler Icons** - Beautiful icon library

### Backend
- **Next.js API Routes** - Serverless API endpoints
- **Prisma** - Next-generation ORM
- **PostgreSQL (Neon)** - Cloud-hosted database

### AI Integration
- **Model Context Protocol (MCP)** - Open standard for connecting AI assistants to your data
- **Platform-Agnostic** - Works with any MCP-compatible AI assistant (Claude Desktop, future tools)

## 📦 Installation

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager
- Neon account (for database)
- MCP-compatible AI assistant (e.g., Claude Desktop)

### Setup

1. **Clone the repository**
```bash
git clone https://github.com/abhay-cs/mcp-fitness.git
cd mcp-fitness
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**

Create a `.env` file in the root directory:
```env
DATABASE_URL="postgresql://user:password@ep-xxx.neon.tech/dbname?sslmode=require"
```

4. **Initialize database**
```bash
npx prisma migrate dev --name init
npx prisma generate
```

5. **Run the development server**
```bash
npm run dev
```

Visit `http://localhost:3000` to see the app.

## 🤖 MCP Integration

Vitals uses the **Model Context Protocol (MCP)** - an open standard created by Anthropic that allows AI assistants to securely connect to external data sources and tools. This means Vitals can work with any MCP-compatible AI assistant, not just one specific platform.

### Why MCP?

- **🔓 Open Standard** - Not locked to a single AI provider
- **🔒 Secure** - Your data stays in your control
- **🔮 Future-Proof** - As more AI tools adopt MCP, they'll work with Vitals automatically
- **🛠️ Extensible** - Easy to add new capabilities

### Supported AI Assistants

Currently tested with:
- ✅ **Claude Desktop** (by Anthropic)

Future compatibility (as MCP adoption grows):
- 🔜 Other MCP-enabled AI tools
- 🔜 Custom AI implementations

### Setup with Claude Desktop

1. **Locate your Claude Desktop config file:**
   - macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
   - Windows: `%APPDATA%/Claude/claude_desktop_config.json`

2. **Add the MCP server configuration:**
```json
{
  "mcpServers": {
    "vitals-fitness": {
      "command": "npx",
      "args": [
        "tsx",
        "/FULL/PATH/TO/YOUR/PROJECT/mcp-server/index.ts"
      ]
    }
  }
}
```

Replace `/FULL/PATH/TO/YOUR/PROJECT/` with your actual project path.

3. **Restart Claude Desktop**

### Setup with Other MCP-Compatible Tools

The MCP server runs on stdio transport and can connect to any MCP-compatible client. Refer to your AI assistant's documentation for MCP configuration.

### Available MCP Tools

The Vitals MCP server exposes these tools to any connected AI assistant:

| Tool | Description | Parameters |
|------|-------------|------------|
| `log_workout` | Log a workout session | `description` (required), `date` (optional) |
| `log_meal` | Log a meal | `description` (required), `date` (optional) |
| `get_workouts` | Get recent workouts | `days` (optional, default: 7) |
| `get_meals` | Get recent meals | `days` (optional, default: 7) |
| `get_stats` | Get fitness statistics | none |

### Example Commands

Once configured with an MCP-compatible AI assistant, you can use natural language:

**Log Activities:**
- "Log workout: 5x5 squats at 225lbs"
- "Log meal: Grilled chicken with rice and vegetables"
- "Add yesterday's workout: 30 minute run"

**Query Data:**
- "Show my recent workouts"
- "What meals did I log this week?"
- "Get my fitness stats"
- "Show workouts from the last 14 days"

## 📁 Project Structure
```
vitals-fitness/
├── src/
│   ├── app/
│   │   ├── (dashboard)/
│   │   │   ├── layout.tsx          # Shared layout with sidebar
│   │   │   ├── dashboard/          # Dashboard page
│   │   │   ├── workouts/           # Workouts page
│   │   │   ├── meals/              # Meals page
│   │   │   └── ai-connect/         # AI connections page
│   │   └── api/
│   │       ├── workouts/           # Workout API endpoints
│   │       ├── meals/              # Meal API endpoints
│   │       └── stats/              # Statistics endpoint
│   ├── components/
│   │   ├── ui/                     # shadcn/ui components
│   │   ├── app-sidebar.tsx         # Main navigation sidebar
│   │   └── icons/                  # Custom icon components
│   └── lib/
│       └── db.ts                   # Prisma client and database functions
├── mcp-server/
│   └── index.ts                    # MCP server implementation
├── prisma/
│   └── schema.prisma               # Database schema
└── public/                         # Static assets
```

## 🗄️ Database Schema
```prisma
model Workout {
  id          String   @id @default(uuid())
  date        String
  description String
  createdAt   DateTime @default(now())
}

model Meal {
  id          String   @id @default(uuid())
  date        String
  description String
  createdAt   DateTime @default(now())
}
```

## 🛠️ Development

### Running the app
```bash
npm run dev        # Start Next.js dev server
npm run mcp        # Start MCP server (for testing)
```

### Database operations
```bash
npx prisma studio              # Open Prisma Studio
npx prisma migrate dev         # Create new migration
npx prisma generate            # Generate Prisma Client
```

### Building for production
```bash
npm run build
npm start
```

## 🚀 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variables (DATABASE_URL)
4. Deploy!

**Note:** The MCP server runs locally and connects to your deployed API endpoints.

### Database (Neon)

Database is already hosted on Neon. No additional setup needed.

## 🎯 Roadmap

- [ ] User authentication
- [ ] Multi-user support
- [ ] Exercise library and templates
- [ ] Nutrition macro tracking with AI parsing
- [ ] Progress photos
- [ ] Workout calendar view
- [ ] Export data functionality
- [ ] Mobile app version
- [ ] Integration with fitness wearables
- [ ] Support for additional MCP-compatible AI tools

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is licensed under the MIT License.

## 👨‍💻 Author

**Your Name**
- GitHub: [@yourusername](https://github.com/abhay-cs)
- LinkedIn: [Your Name](https://linkedin.com/in/abhaycs)

## 🙏 Acknowledgments

- [Anthropic](https://anthropic.com) for creating the Model Context Protocol (MCP)
- [shadcn/ui](https://ui.shadcn.com/) for the beautiful components
- [Neon](https://neon.tech) for database hosting
- [Vercel](https://vercel.com) for deployment platform

---

**🌐 Built on Open Standards**

This project uses MCP (Model Context Protocol), an open standard for AI-to-application integration. As more AI tools adopt MCP, Vitals will work with them automatically - no code changes needed.

Built by Abhay Sharma.