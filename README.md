# Dashboard UI

A modern dashboard interface built with React and Vite.

## Features

- Real-time chat interface with AI agent integration
- Task management and visualization
- Git integration and change tracking
- Responsive design with dark/light theme support
- Component-based architecture

## Project Structure

```
src/
├── components/     # Reusable UI components
├── utils/         # Utility functions and helpers
├── styles/        # Global styles and CSS
└── App.jsx        # Main application component
```

## Development

### Prerequisites

- Node.js (v16 or higher)
- npm (v8 or higher)

### Installation

```bash
npm install
```

### Running the Development Server

```bash
npm run dev
```

The development server will start at `http://localhost:5173`

### Environment Variables

Create a `.env` file in the root directory to configure environment-specific settings:

```env
# Backend API URL
VITE_BACKEND_URL=http://localhost:3001
```

### Building for Production

```bash
npm run build
```

This will create a `dist` folder with the optimized production build.

## Backend Integration

This frontend is designed to work with a backend server that provides chat functionality via the `/api/chat` endpoint. The backend should be running on port 3001 by default, but this can be configured via the `VITE_BACKEND_URL` environment variable.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT