# Health Monitoring System

A health monitoring system for microservices built with React/TypeScript and NestJS.

## Project Structure

```
.
├── frontend/          # React TypeScript frontend
├── backend/          # NestJS backend
└── .vscode/         # VS Code configuration
```

## Prerequisites

- Node.js (v18 or later)
- npm or yarn
- VS Code (for debugging)

## Setup and Running

### Initial Setup

1. Install all dependencies:
   ```bash
   npm run install:all
   ```

### Development

You can run the entire application (both frontend and backend) in development mode:

```bash
npm run dev
```

This will start:
- Backend at http://localhost:3000
- Frontend at http://localhost:3001

### Running Separately

#### Backend

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Start the development server:
   ```bash
   npm run start:dev
   ```

The backend will be available at http://localhost:3000

#### Frontend

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Start the development server:
   ```bash
   npm start
   ```

The frontend will be available at http://localhost:3001

### Debugging

#### Backend Debugging

1. Using VS Code:
   - Open the project in VS Code
   - Go to the Debug view (Ctrl/Cmd + Shift + D)
   - Select "Debug Backend" from the dropdown
   - Click the green play button or press F5
   - Set breakpoints in your code
   - Use the debug console, watch window, and variable inspector

2. Using Command Line:
   ```bash
   npm run start:backend
   ```

The backend will start in debug mode with hot-reload enabled.

## Features

- Real-time health monitoring of microservices
- WebSocket-based updates for instant status changes
- Dashboard showing all monitored services and their current status
- Form to add new services to monitor
- Color-coded status indicators (green for UP, red for DOWN)
- Automatic health checks every 30 seconds
- REST API endpoints for service management 