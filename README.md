# BRUR Bus Schedule App

A modern, mobile-first bus schedule web application for Begum Rokeya University, Rangpur. This is the university's first digital bus schedule system.

## Features

- 🚌 **Multiple Bus Routes**: Support for different bus routes (Express, Local, Shuttle)
- ⏰ **Real-time Updates**: Live time difference calculations from current time
- 📱 **Mobile-First Design**: Optimized for mobile devices (90% of users)
- 🎯 **Easy Selection**: Simple dropdown menus for bus, time, and stop selection
- 🔄 **Dual Visits**: Shows both visit times for each stop
- ⚡ **Fast Loading**: Built with Vite for optimal performance

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

## License

© 2024 Begum Rokeya University, Rangpur