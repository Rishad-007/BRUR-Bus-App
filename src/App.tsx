import { useState, useEffect } from "react";

// ...existing code...

// Helper to convert 24h time string (e.g. '17:10') to 12h format with am/pm
function formatTo12Hour(time24: string) {
  const [hourStr, minuteStr] = time24.split(":");
  let hour = parseInt(hourStr, 10);
  const minute = minuteStr.padStart(2, "0");
  const ampm = hour >= 12 ? "pm" : "am";
  hour = hour % 12;
  if (hour === 0) hour = 12;
  return `${hour}:${minute} ${ampm}`;
}

// Helper to get the next upcoming stop and time difference
function getNextStop(schedule: BusScheduleStop[], now: Date) {
  for (let i = 0; i < schedule.length; i++) {
    const stop = schedule[i];
    // Parse 24h time string to Date
    const [h, m] = stop.Time.split(":");
    const stopDate = new Date(now);
    stopDate.setHours(Number(h), Number(m), 0, 0);
    if (stopDate >= now) {
      return { stop, index: i, diff: stopDate.getTime() - now.getTime() };
    }
  }
  // If all times have passed, return null
  return null;
}
import {
  Bus as BusIcon,
  Clock,
  MapPin,
  Navigation,
  ExternalLink,
  Users,
} from "lucide-react";
import busSchedulesData from "./data/busSchedules.json";
import TimelineMap from "./components/TimelineMap";

type BusScheduleStop = {
  Time: string;
  Stopage: string;
};

type BusSchedule = {
  id: string;
  name: string;
  "Start Time": string;
  schedule: BusScheduleStop[];
};

// Helper to extract unique route/trip names from buses
function getUniqueRouteNames(buses: BusSchedule[]) {
  return Array.from(new Set(buses.map((bus) => bus.name)));
}

// Helper to check if a bus is a special trip

interface SelectedBusInfo {
  bus: BusSchedule | null;
  selectedStop: BusScheduleStop | null;
}

function App() {
  const [selectedRoute, setSelectedRoute] = useState<string>("");
  const [selectedTimeBusId, setSelectedTimeBusId] = useState<string>("");
  const [selectedBusInfo, setSelectedBusInfo] = useState<SelectedBusInfo>({
    bus: null,
    selectedStop: null,
  });
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);

  // Prepare route and special trip lists

  const allBuses: BusSchedule[] = busSchedulesData.buses;
  // Get unique route/trip names including special trips
  const routeNames = getUniqueRouteNames(allBuses);

  // Get buses for selected route name
  const busesForSelectedRoute = selectedRoute
    ? allBuses.filter((bus) => bus.name === selectedRoute)
    : [];

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute
    setCurrentTime(new Date());
    return () => clearInterval(timer);
  }, []);

  // Handle route selection
  const handleRouteChange = (routeName: string) => {
    setSelectedRoute(routeName);
    setSelectedTimeBusId("");
    setSelectedBusInfo({ bus: null, selectedStop: null });
  };

  // Handle time selection for route
  const handleTimeChange = (busId: string) => {
    setIsLoading(true);
    try {
      const bus = allBuses.find((b) => b.id === busId);
      setSelectedTimeBusId(busId);
      setSelectedBusInfo({
        bus: bus || null,
        selectedStop: null,
      });
    } catch (error) {
      console.error("Error selecting bus:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Remove special trip selection handler (no longer needed)

  const handleStopChange = (stopIndex: number) => {
    if (!selectedBusInfo.bus) return;
    const stop = selectedBusInfo.bus.schedule[stopIndex];
    setSelectedBusInfo((prev) => ({
      ...prev,
      selectedStop: stop || null,
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-university-50 to-primary-50">
      {/* Header */}
      <header className="bg-white shadow-lg border-b-4 border-university-500">
        <div className="max-w-md mx-auto px-4 py-6">
          <div className="flex flex-col items-center justify-center gap-2">
            <div className="flex items-center justify-center gap-3">
              <img
                src="/logo/logo_University.png"
                alt="University Logo"
                className="bg-white shadow"
                style={{
                  maxWidth: "44px",
                  maxHeight: "44px",
                  width: "auto",
                  height: "auto",
                }}
              />
              <img
                src="/logo/logo brudf.png"
                alt="BRUDF Logo"
                className="bg-white shadow rounded-full border border-university-500"
                style={{ width: "36px", height: "36px", objectFit: "contain" }}
              />
            </div>
            <div className="text-center mt-2">
              <h1 className="text-2xl font-bold text-gray-800">
                BRUR Bus Schedule
              </h1>
              <p className="text-sm text-gray-600">
                Begum Rokeya University, Rangpur
              </p>
              <div className="mt-2 flex items-center justify-center gap-2">
                <span className="text-xs text-gray-500">
                  By Begum Rokeya University Debate Forum (BRUDF)
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Current Time */}
        <div className="bg-white rounded-xl shadow-lg p-4 border-l-4 border-university-500">
          <div className="flex items-center space-x-3">
            <Clock className="w-6 h-6 text-university-600" />
            <div>
              <p className="text-sm text-gray-600">Current Time</p>
              <p className="text-xl font-bold text-gray-800">
                {currentTime.toLocaleTimeString("en-US", {
                  hour: "numeric",
                  minute: "2-digit",
                  hour12: true,
                })}
              </p>
            </div>
          </div>
        </div>

        {/* Bus Selection (Route/Trip and Time) */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <BusIcon className="w-5 h-5 mr-2 text-university-600" />
            Select Route & Time
            {isLoading && (
              <div className="ml-2 w-4 h-4 border-2 border-university-500 border-t-transparent rounded-full animate-spin"></div>
            )}
          </h2>

          {/* Route selection (includes special/library trips) */}
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Select Route/Trip Name
          </label>
          <select
            value={selectedRoute}
            onChange={(e) => handleRouteChange(e.target.value)}
            disabled={isLoading}
            aria-label="Select a route name"
            className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-university-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <option value="">Choose a route/trip...</option>
            {routeNames.map((route) => (
              <option key={route} value={route}>
                {route}
              </option>
            ))}
          </select>

          {/* Time selection for selected route */}
          {selectedRoute && (
            <>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Select Start Time
              </label>
              <select
                value={selectedTimeBusId}
                onChange={(e) => handleTimeChange(e.target.value)}
                disabled={isLoading}
                aria-label="Select a time for the route"
                className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-university-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="">Choose a time...</option>
                {busesForSelectedRoute.map((bus) => (
                  <option key={bus.id} value={bus.id}>
                    {bus["Start Time"] || "Unknown"}
                  </option>
                ))}
              </select>
            </>
          )}
        </div>

        {/* Stop Selection */}
        {selectedBusInfo.bus && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <MapPin className="w-5 h-5 mr-2 text-university-600" />
              Select Bus Stop
            </h2>
            <select
              value={
                selectedBusInfo.selectedStop
                  ? selectedBusInfo.bus.schedule.findIndex(
                      (s) => s === selectedBusInfo.selectedStop
                    )
                  : ""
              }
              onChange={(e) => handleStopChange(Number(e.target.value))}
              aria-label="Select bus stop"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-university-500 focus:border-transparent"
            >
              <option value="">Choose a stop...</option>
              {selectedBusInfo.bus.schedule.map((stop, idx) => (
                <option key={idx} value={idx}>
                  {stop.Stopage} ({formatTo12Hour(stop.Time)})
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Timeline Map */}
        {selectedBusInfo.bus && (
          <TimelineMap
            stops={selectedBusInfo.bus.schedule.map((stop) => ({
              ...stop,
              Time: formatTo12Hour(stop.Time),
            }))}
            selectedStopIndex={
              selectedBusInfo.selectedStop
                ? selectedBusInfo.bus.schedule.findIndex(
                    (s) => s === selectedBusInfo.selectedStop
                  )
                : null
            }
            onStopSelect={handleStopChange}
            routeName={selectedBusInfo.bus.name}
          />
        )}

        {/* Stop Times Display */}
        {selectedBusInfo.selectedStop && (
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-university-500">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <Navigation className="w-5 h-5 mr-2 text-university-600" />
              {selectedBusInfo.selectedStop.Stopage}
            </h3>
            <div className="space-y-4">
              <div className="p-4 rounded-lg border-2 border-university-500 bg-university-50">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-lg font-bold text-gray-800">
                      {formatTo12Hour(selectedBusInfo.selectedStop.Time)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-medium`}>
                      {(() => {
                        // Calculate time difference for this stop
                        const [h, m] =
                          selectedBusInfo.selectedStop.Time.split(":");
                        const stopDate = new Date(currentTime);
                        stopDate.setHours(Number(h), Number(m), 0, 0);
                        const diff = stopDate.getTime() - currentTime.getTime();
                        if (diff < 0) return "Departed";
                        // Format as X min/hours left
                        const mins = Math.round(diff / 60000);
                        if (mins < 60) return `${mins} min left`;
                        const hours = Math.floor(mins / 60);
                        const remMins = mins % 60;
                        return `${hours}h ${remMins}m left`;
                      })()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* Next Upcoming Bus Info */}
        {selectedBusInfo.bus &&
          (() => {
            const next = getNextStop(selectedBusInfo.bus.schedule, currentTime);
            if (!next) return null;
            const mins = Math.round(next.diff / 60000);
            return (
              <div className="bg-green-50 border-l-4 border-green-500 rounded-xl shadow-lg p-4 mb-4">
                <div className="flex items-center space-x-3">
                  <Clock className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="text-sm text-gray-600">Upcoming Bus</p>
                    <p className="text-lg font-bold text-gray-800">
                      {next.stop.Stopage} at {formatTo12Hour(next.stop.Time)}
                    </p>
                    <p className="text-xs text-green-700 mt-1">
                      {mins < 1
                        ? "Arriving now"
                        : mins < 60
                        ? `${mins} min left`
                        : `${Math.floor(mins / 60)}h ${mins % 60}m left`}
                    </p>
                  </div>
                </div>
              </div>
            );
          })()}

        {/* Powered By Section */}
        <div className="bg-gradient-to-r from-university-500 to-university-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex flex-col items-center justify-center mb-4">
            <div className="bg-white/20 p-2 rounded-full mb-2 flex items-center justify-center">
              <Users className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-center">Powered by</h3>
            <p className="text-sm opacity-90 text-center mt-1">
              Begum Rokeya University Debate Forum
            </p>
          </div>
          <div className="flex justify-center">
            <a
              href="https://brudf.onrender.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors duration-200"
            >
              <span className="text-sm font-medium">Visit BRUDF Website</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
          <p className="text-xs text-center mt-3 opacity-75">
            Developed by the BRUDF team for the University Community
          </p>
        </div>

        {/* Footer */}
        <footer className="text-center py-6">
          <p className="text-sm text-gray-600">© 2025 MD. Rishad Nur</p>
          <p className="text-xs text-gray-500 mt-1">
            First Digital Bus Schedule System of Begum Rokeya University,
            Rangpur
          </p>
        </footer>
      </main>
    </div>
  );
}

export default App;
