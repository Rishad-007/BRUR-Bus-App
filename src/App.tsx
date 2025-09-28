import { useState, useEffect } from 'react';
import type { SelectedBusInfo } from './types/bus';
import { calculateTimeDifference, formatTimeDifference } from './utils/timeUtils';
import { Bus as BusIcon, Clock, MapPin, Navigation, ExternalLink, Users } from 'lucide-react';
import busSchedulesData from './data/busSchedules.json';
import TimelineMap from './components/TimelineMap';

function App() {
  const [selectedBusInfo, setSelectedBusInfo] = useState<SelectedBusInfo>({
    bus: null,
    startTime: null,
    selectedStop: null
  });
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    // Also update immediately on mount
    setCurrentTime(new Date());

    return () => clearInterval(timer);
  }, []);

  const handleBusChange = (busId: string) => {
    setIsLoading(true);
    try {
      const bus = busSchedulesData.buses.find(b => b.id === busId);
      setSelectedBusInfo({
        bus: bus || null,
        startTime: null,
        selectedStop: null
      });
    } catch (error) {
      console.error('Error selecting bus:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartTimeChange = (startTime: string) => {
    setSelectedBusInfo(prev => ({
      ...prev,
      startTime,
      selectedStop: null
    }));
  };

  const handleStopChange = (stopId: string) => {
    if (!selectedBusInfo.bus || !selectedBusInfo.startTime) return;
    
    const stop = selectedBusInfo.bus.stops.find(s => s.id === stopId);
    setSelectedBusInfo(prev => ({
      ...prev,
      selectedStop: stop || null
    }));
  };

  const getStopTimes = () => {
    if (!selectedBusInfo.bus || !selectedBusInfo.startTime || !selectedBusInfo.selectedStop) {
      return null;
    }
    
    return selectedBusInfo.selectedStop.times[selectedBusInfo.startTime] || null;
  };

  const stopTimes = getStopTimes();

  return (
    <div className="min-h-screen bg-gradient-to-br from-university-50 to-primary-50">
      {/* Header */}
      <header className="bg-white shadow-lg border-b-4 border-university-500">
        <div className="max-w-md mx-auto px-4 py-6">
          <div className="flex items-center justify-center space-x-3">
            <div className="bg-university-500 p-3 rounded-full">
              <BusIcon className="w-8 h-8 text-white" />
            </div>
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-800">BRUR Bus Schedule</h1>
              <p className="text-sm text-gray-600">Begum Rokeya University, Rangpur</p>
              <div className="mt-2 flex items-center justify-center space-x-2">
                <div className="w-6 h-6 bg-university-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">BR</span>
                </div>
                <span className="text-xs text-gray-500">Official University App</span>
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
                {currentTime.toLocaleTimeString('en-US', { 
                  hour: 'numeric', 
                  minute: '2-digit',
                  hour12: true 
                })}
              </p>
            </div>
          </div>
        </div>

        {/* Bus Selection */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <BusIcon className="w-5 h-5 mr-2 text-university-600" />
            Select Bus
            {isLoading && (
              <div className="ml-2 w-4 h-4 border-2 border-university-500 border-t-transparent rounded-full animate-spin"></div>
            )}
          </h2>
          <select
            value={selectedBusInfo.bus?.id || ''}
            onChange={(e) => handleBusChange(e.target.value)}
            disabled={isLoading}
            aria-label="Select a bus route"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-university-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <option value="">Choose a bus...</option>
            {busSchedulesData.buses.map((bus) => (
              <option key={bus.id} value={bus.id}>
                {bus.name} - {bus.route}
              </option>
            ))}
          </select>
        </div>

        {/* Start Time Selection */}
        {selectedBusInfo.bus && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <Clock className="w-5 h-5 mr-2 text-university-600" />
              Select Departure Time
            </h2>
            <select
              value={selectedBusInfo.startTime || ''}
              onChange={(e) => handleStartTimeChange(e.target.value)}
              aria-label="Select departure time"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-university-500 focus:border-transparent"
            >
              <option value="">Choose departure time...</option>
              {selectedBusInfo.bus.startTimes.map((time) => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Stop Selection */}
        {selectedBusInfo.bus && selectedBusInfo.startTime && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <MapPin className="w-5 h-5 mr-2 text-university-600" />
              Select Bus Stop
            </h2>
            <select
              value={selectedBusInfo.selectedStop?.id || ''}
              onChange={(e) => handleStopChange(e.target.value)}
              aria-label="Select bus stop"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-university-500 focus:border-transparent"
            >
              <option value="">Choose a stop...</option>
              {selectedBusInfo.bus.stops.map((stop) => (
                <option key={stop.id} value={stop.id}>
                  {stop.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Timeline Map */}
        {selectedBusInfo.bus && selectedBusInfo.startTime && (
          <TimelineMap
            stops={selectedBusInfo.bus.stops}
            selectedStopId={selectedBusInfo.selectedStop?.id || null}
            onStopSelect={(stopId) => handleStopChange(stopId)}
            routeName={selectedBusInfo.bus.route}
          />
        )}

        {/* Stop Times Display */}
        {stopTimes && selectedBusInfo.selectedStop && (
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-university-500">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <Navigation className="w-5 h-5 mr-2 text-university-600" />
              {selectedBusInfo.selectedStop.name}
            </h3>
            
            <div className="space-y-4">
              {stopTimes.map((time, index) => {
                const timeDiff = calculateTimeDifference(time);
                const isNext = index === 0 && !timeDiff.isPast;
                
                return (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border-2 ${
                      isNext 
                        ? 'border-university-500 bg-university-50' 
                        : 'border-gray-200 bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-lg font-bold text-gray-800">
                          {time}
                        </p>
                        <p className="text-sm text-gray-600">
                          {index === 0 ? 'First Visit' : 'Second Visit'}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className={`text-sm font-medium ${
                          timeDiff.isPast ? 'text-red-600' : 'text-green-600'
                        }`}>
                          {formatTimeDifference(timeDiff)}
                        </p>
                        {isNext && (
                          <p className="text-xs text-university-600 font-medium">
                            Next Bus
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Powered By Section */}
        <div className="bg-gradient-to-r from-university-500 to-university-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="bg-white/20 p-2 rounded-full">
              <Users className="w-6 h-6" />
            </div>
            <div className="text-center">
              <h3 className="text-lg font-bold">Powered by</h3>
              <p className="text-sm opacity-90">Begum Rokeya University Debate Forum</p>
            </div>
          </div>
          <div className="text-center">
            <a
              href="https://brudf.edu.bd"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors duration-200"
            >
              <span className="text-sm font-medium">Visit BRUDF Website</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
          <p className="text-xs text-center mt-3 opacity-75">
            Developed by the Debate Forum for the University Community
          </p>
        </div>

        {/* Footer */}
        <footer className="text-center py-6">
          <p className="text-sm text-gray-600">
            © 2024 Begum Rokeya University, Rangpur
          </p>
          <p className="text-xs text-gray-500 mt-1">
            First Digital Bus Schedule System
          </p>
        </footer>
      </main>
    </div>
  );
}

export default App;
