# Multi-Day Process Manager 🍞

A simple dashboard for scheduling and executing multi-day, timing-sensitive processes like sourdough bread-making, painting projects, and other multi-step activities.

## Features

- **Simple GUI**: Clean, intuitive interface for managing processes
- **Process Presets**: Pre-configured templates for common multi-day processes (starting with sourdough bread)
- **Flexible Scheduling**: Adjust start times and automatically calculate all subsequent steps
- **Built-in Timers**: Track progress through each step with real-time countdowns
- **Alarms & Notifications**: Get notified when it's time for the next step
- **Progress Tracking**: Visual progress bars and step completion tracking
- **Persistent Storage**: All scheduled processes are saved locally

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Usage

1. **Schedule a Process**: Click "Schedule Process" to create a new process from a preset
2. **Preview Timeline**: Use "Preview Schedule" to see all steps with calculated times
3. **Monitor Progress**: View active processes on the Dashboard
4. **Complete Steps**: Mark steps as complete as you progress through the process
5. **Enable Notifications**: Allow browser notifications to get alerts for time-sensitive steps

## Current Presets

### Classic Sourdough Bread
A complete 48-hour sourdough bread-making process including:
- Starter feeding
- Autolyse
- Bulk fermentation with stretch and folds
- Cold proof
- Baking

## Technology Stack

- **React**: UI framework
- **Vite**: Build tool and dev server
- **LocalStorage**: For data persistence
- **Web Notifications API**: For browser notifications

## Future Enhancements

- Additional process templates (painting, fermenting, etc.)
- Custom process creation
- Export/import presets
- Mobile app version
- Cloud sync

## License

MIT 
