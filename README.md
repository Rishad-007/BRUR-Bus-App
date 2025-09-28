# BRUR Bus Schedule App

A modern, mobile-first bus schedule web application for Begum Rokeya University, Rangpur. This is the university's first digital bus schedule system, developed by the Begum Rokeya University Debate Forum (BRUDF).

## Features

- 🚌 **Multiple Bus Routes**: Support for different bus routes (Express, Local, Shuttle)
- ⏰ **Real-time Updates**: Live time difference calculations from current time
- 📱 **Mobile-First Design**: Optimized for mobile devices (90% of users)
- 🎯 **Easy Selection**: Simple dropdown menus for bus, time, and stop selection
- 🗺️ **Interactive Timeline Map**: Visual route timeline with scrollable stop selection
- 🔄 **Dual Visits**: Shows both visit times for each stop
- 🏛️ **University Branding**: Official university logo and branding
- 👥 **Powered by BRUDF**: Developed by the Debate Forum with clickable link
- ⚡ **Fast Loading**: Built with Vite for optimal performance
- 📜 **Scrollable Interface**: Vertical scrolling for easy navigation through all stops

## Technology Stack

- **Frontend**: React 19 + TypeScript
- **Styling**: Tailwind CSS
- **Build Tool**: Vite
- **Icons**: Lucide React
- **Time Handling**: date-fns
- **Package Manager**: pnpm

## Development

### Prerequisites

- Node.js (v18 or higher)
- pnpm

### Installation

```bash
# Install dependencies
pnpm install

# Start development server
pnpm run dev

# Build for production
pnpm run build

# Preview production build
pnpm run preview
```

## Deployment on Render

1. Push your code to a GitHub repository
2. Connect your GitHub account to Render
3. Create a new Static Site on Render
4. Configure the following settings:
   - **Build Command**: `pnpm install && pnpm run build`
   - **Publish Directory**: `dist`
   - **Node Version**: 18 or higher

The app will be automatically deployed and available at your Render URL.

## Data Structure

The bus schedule data is stored in `src/data/busSchedules.json` with the following structure:

```json
{
  "buses": [
    {
      "id": "bus-1",
      "name": "BRUR Express",
      "route": "Campus to City Center",
      "startTimes": ["8:00 AM", "9:10 AM", ...],
      "stops": [
        {
          "id": "stop-1",
          "name": "University Main Gate",
          "times": {
            "8:00 AM": ["8:05 AM", "8:15 AM"],
            ...
          }
        }
      ]
    }
  ]
}
```

## Customization

To add new buses or modify schedules:

1. Edit `src/data/busSchedules.json`
2. Update the TypeScript interfaces in `src/types/bus.ts` if needed
3. The app will automatically reflect the changes

## Mobile Optimization

The app is designed with mobile-first principles:
- Touch-friendly interface
- Optimized for small screens
- Fast loading on mobile networks
- Responsive design that works on all devices
- Vertical scrolling for easy navigation
- Custom scrollbar styling for better UX

## Key Components

### Interactive Timeline Map
- **Visual Route Display**: Shows all bus stops in a connected timeline
- **Scrollable Interface**: Vertical scrolling to view all stops (max 5-6 visible at once)
- **Stop Highlighting**: Selected stop is highlighted with university colors
- **Click to Select**: Users can click on any stop in the timeline to select it
- **Route Information**: Displays the route name above the timeline

### University Branding
- **Official Logo**: University initials (BR) in university colors
- **Professional Header**: Clean design with university name and location
- **Official Badge**: "Official University App" indicator

### Powered By Section
- **BRUDF Attribution**: Clear credit to Begum Rokeya University Debate Forum
- **Clickable Link**: Direct link to BRUDF website (https://brudf.edu.bd)
- **Professional Design**: Gradient background with external link icon

## User Experience

### How to Use the App
1. **Select Bus Route**: Choose from available bus routes (Express, Local, Shuttle)
2. **Pick Departure Time**: Select from 7 available departure times
3. **View Timeline**: See all stops in a visual, scrollable timeline
4. **Select Stop**: Click on any stop in the timeline or use the dropdown
5. **View Times**: See arrival times with real-time countdown
6. **Navigate**: Scroll through the timeline to see all stops

### Timeline Navigation
- **Vertical Scrolling**: Smooth scrolling through all bus stops
- **Visual Indicators**: Map pin icons and connection lines
- **Stop Counter**: Shows current stop number (e.g., "Stop 3 of 8")
- **Highlighted Selection**: Selected stop stands out with university colors
- **Touch Friendly**: Optimized for mobile touch interactions

## License

© 2024 Begum Rokeya University, Rangpur