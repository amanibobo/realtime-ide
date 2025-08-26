# Nova - Real-time IDE

A modern, real-time IDE built with Next.js, Convex, and Clerk authentication. Features code execution powered by Judge0, collaborative whiteboard, and elegant design.

## Features

- **Real-time Code Editor**: Monaco Editor with syntax highlighting for 10+ programming languages
- **Code Execution**: Powered by [Judge0](https://judge0.com) - supports 60+ programming languages
- **Collaborative Whiteboard**: Draw and sketch ideas with tldraw integration
- **Authentication**: Secure user management with Clerk
- **Real-time Sync**: Documents sync across devices using Convex
- **Modern UI**: Clean, elegant design with dark/light mode support

## Tech Stack

- **Frontend**: Next.js 15, React, TypeScript, Tailwind CSS
- **Backend**: Convex (real-time database)
- **Authentication**: Clerk
- **Code Execution**: Judge0 Community Edition
- **Editor**: Monaco Editor
- **Whiteboard**: tldraw

## Setup Instructions

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd realtime-ide
npm install
```

### 2. Environment Configuration

Create a `.env.local` file in the root directory:

```env
# Convex Configuration
CONVEX_DEPLOYMENT=your_convex_deployment_url
NEXT_PUBLIC_CONVEX_URL=your_convex_url

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

# Judge0 API Configuration
NEXT_PUBLIC_RAPIDAPI_KEY=your_rapidapi_key_here
```

### 3. Judge0 Setup (Code Execution)

To enable code execution, you need a RapidAPI key for Judge0:

1. **Sign up for RapidAPI**: Go to [RapidAPI](https://rapidapi.com) and create a free account
2. **Subscribe to Judge0 CE**: Visit [Judge0 Community Edition](https://rapidapi.com/judge0-official/api/judge0-ce)
3. **Choose a plan**:
   - **Free Plan**: 50 requests/day (perfect for testing)
   - **Basic Plan**: €27/month for 2000 requests/day
   - **Pro Plan**: €54/month for 5000 requests/day
4. **Get your API key**: Copy your `X-RapidAPI-Key` from the dashboard
5. **Add to environment**: Update `NEXT_PUBLIC_RAPIDAPI_KEY` in your `.env.local` file

**Supported Languages**: Python, JavaScript, Java, C++, C, C#, Kotlin, Ruby, Rust, TypeScript, and more!

### 4. Convex Setup

```bash
# Install Convex CLI
npm install -g convex

# Login to Convex
npx convex login

# Deploy your Convex functions
npx convex deploy
```

### 5. Clerk Setup

1. Go to [Clerk Dashboard](https://dashboard.clerk.dev)
2. Create a new application
3. Copy your keys to `.env.local`
4. Configure your domains in Clerk settings

### 6. Run the Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` to see your IDE in action!

## Usage

### Creating a New Space

1. **Sign In**: Use the authentication flow
2. **Create Space**: Click "New Space" from the spaces page
3. **Start Coding**: Write code in the Monaco editor
4. **Execute Code**: Select your programming language and click "Run"
5. **Collaborate**: Use the whiteboard for visual collaboration

### Code Execution

- **Language Selection**: Choose from Python, JavaScript, Java, C++, and more
- **Input/Output**: Provide program input and see execution results
- **Error Handling**: View compilation errors and runtime messages
- **Performance**: See execution time and memory usage

### Features in Detail

- **Real-time Sync**: All changes are automatically saved and synced
- **Whiteboard**: Draw diagrams, flowcharts, or brainstorm ideas
- **Notes**: Take notes alongside your code
- **Search**: Quickly find and navigate between spaces
- **Dark Mode**: Toggle between light and dark themes

## Judge0 Pricing

Based on [Judge0's pricing](https://judge0.com/#pricing):

- **Community Edition**: Free, self-hosted option
- **Shared Cloud Basic**: Free tier with 50 requests/day
- **Shared Cloud Pro**: €27/month with 2000 requests/day
- **Shared Cloud Ultra**: €54/month with 5000 requests/day

For most development and learning purposes, the free tier provides ample usage.

## Development

### Project Structure

```
realtime-ide/
├── app/                    # Next.js app router
│   ├── (main)/            # Main application pages
│   └── (marketing)/       # Landing page
├── components/            # Reusable UI components
│   ├── ui/               # Base UI components
│   └── modals/           # Modal components
├── convex/               # Convex backend functions
├── hooks/                # Custom React hooks
└── lib/                  # Utility functions
```

### Key Components

- **IDE Component**: Monaco editor with Judge0 integration
- **Navigation**: Sidebar with spaces and search
- **Whiteboard**: Collaborative drawing canvas
- **Authentication**: Clerk integration for user management

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For issues and questions:
- Create an issue on GitHub
- Check the [Judge0 documentation](https://ce.judge0.com)
- Visit [Convex docs](https://docs.convex.dev)
- Check [Clerk documentation](https://clerk.dev/docs)
