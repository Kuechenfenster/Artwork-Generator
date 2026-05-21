<div align="center">
<h1>Artwork Generator</h1>
<p>A high-end, professional artwork management tool designed for HTI Toys.</p>
</div>

## Overview

This application serves as a global project tracking and compliance management system, handling the lifecycle of toy artwork projects and maintaining a centralized, multilingual compliance database for warning texts and safety symbols.

## Tech Stack

- **Framework:** React 19 (Functional components, Hooks)
- **Build Tool:** Vite
- **Language:** TypeScript
- **Styling:** Tailwind CSS (custom Dark Mode UI)
- **Icons:** Material Symbols Outlined
- **Fonts:** Inter (sans-serif)

## Features

- **Dashboard:** High-level overview of all active artwork projects with status indicators and quick actions.
- **Project Detail:** Deep dive into specific projects, displaying metadata, assigned designers, deadlines, attached artwork files, and compliance status.
- **Create Project:** Form interface to initialize new artwork projects with configurable parameters.
- **Warning Database:** Searchable, filterable multilingual compliance database for safety warnings and vector symbols.
- **Translations:** Management of outsourced translation orders for packaging and manuals.

## Getting Started

### Prerequisites

- Node.js (v20 or later recommended)
- npm or yarn
- Docker & Docker Compose (optional, for containerized deployment)

### Local Development

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```

3. Open your browser and navigate to `http://localhost:3000`.

### Production Build

To create an optimized production build:

```bash
npm run build
```

The built files will be in the `dist/` directory.

### Docker Deployment

Build and run the application using Docker Compose:

```bash
docker compose up --build
```

The application will be available at `http://localhost:3000`.

## Project Structure

```
├── components/        # Reusable UI components (Header, Sidebar)
├── pages/             # Main application views (Dashboard, ProjectDetail, etc.)
├── services/          # API and external service integrations
├── types.ts           # TypeScript interfaces and type definitions
├── App.tsx            # Main application component with state-based routing
├── index.tsx          # Application entry point
├── index.html         # HTML template with Tailwind and font imports
├── tailwind.config.js # Tailwind CSS configuration
├── vite.config.ts     # Vite configuration
├── Dockerfile         # Docker image definition
└── docker-compose.yml # Docker Compose configuration
```

## Design System

The application features a sleek, dark-themed industrial UI with the following key colors:

- **Primary Accent:** `#13a4ec` (Bright Blue)
- **Background Light:** `#f6f7f8`
- **Background Dark:** `#101c22`
- **Panel Dark:** `#1a2a32`
- **Border Dark:** `#2d4552`

Custom scrollbar styles and smooth theme transitions are included for a polished user experience.

## License

This project is proprietary and developed for HTI Toys internal use.
