# Project Structure

## Overview
React + MUI + SCSS project with Theme Customizer functionality

## Key Features
- Material-UI (MUI) for component library
- SCSS for styling
- Dark/Light mode toggle
- Theme customization panel with:
  - Primary color selection
  - Sidebar color selection
  - Topbar color selection
  - Layout modes (Default, Boxed, Compact)
  - Font size options (Small, Medium, Large)
  - Theme settings persistence in localStorage

## Project Structure

```
src/
├── Components/
│   ├── AppLayout.jsx          # Main layout component with sidebar and topbar
│   └── ThemeCustomizer/
│       ├── ThemeCustomizer.jsx    # Theme customizer drawer component
│       └── ThemeCustomizer.scss   # Styles for theme customizer
├── Context/
│   └── ThemeContext.jsx       # Theme provider and context
├── Pages/
│   ├── Login.jsx              # Login page
│   └── Dashboard.jsx          # Dashboard page
├── Router.jsx                 # Application routing
├── App.jsx                    # Main App component
├── App.scss                   # App styles
├── main.jsx                   # Entry point
└── index.scss                 # Global styles
```

## Usage

### Theme Customizer
Click the settings button on the right side of the screen to open the theme customizer panel. From there you can:
- Toggle between light and dark mode
- Change primary color
- Change sidebar color
- Change topbar color
- Switch layout modes
- Adjust font size
- Reset all settings to default

### Adding New Pages
1. Create a new page component in `src/Pages/`
2. Add the route in `src/Router.jsx`
3. Import and use in the routing configuration

### Customizing Theme
The theme is managed in `src/Context/ThemeContext.jsx`. All settings are automatically saved to localStorage and persist across sessions.

## Technologies
- React 18
- Material-UI (MUI) v5
- React Router v6
- SCSS
- Vite
