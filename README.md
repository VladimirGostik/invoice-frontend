# Invoice Frontend

A modern React-based invoice management system with authentication and a responsive layout.

## Features

- **Login System**: Secure authentication with form validation
- **Dashboard**: Overview with statistics and recent invoices
- **Layout System**: Responsive layout with collapsible sidebar navigation
- **Protected Routes**: Route guards for authenticated access
- **Modern UI**: Clean, professional design with smooth animations

## Tech Stack

- React 19.1.1
- Vite 7.1.9
- React Router DOM v7
- Modern CSS with responsive design

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The application will be available at `http://localhost:5173/`

### Build

```bash
npm run build
```

### Lint

```bash
npm run lint
```

## Usage

1. Navigate to the login page
2. Enter any username and password (demo authentication)
3. Explore the dashboard and navigation
4. Use the sidebar to navigate between sections
5. Click the hamburger menu to toggle the sidebar
6. Click logout to end the session

## Project Structure

```
src/
├── components/       # Reusable components (Layout, ProtectedRoute)
├── context/          # React Context for state management (AuthContext)
├── pages/           # Page components (Login, Dashboard, etc.)
├── App.jsx          # Main app component with routing
└── main.jsx         # Application entry point
```
