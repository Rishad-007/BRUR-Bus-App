import { MapPin, Navigation } from "lucide-react";
// import type { BusStop } from "../types/bus";
import { isBusAvailableToday, getLimitedSchedule } from "../utils/timeUtils";

// Mock function to retrieve special conditions
const getSpecialConditionsForRoute = () => {
  // This function should fetch or map the special conditions for the given route
  // For now, returning an empty object as a placeholder
  return {};
};

interface TimelineMapProps {
  stops: Array<{ Time: string; Stopage: string }>;
  selectedStopIndex: number | null;
  onStopSelect: (index: number) => void;
  routeName?: string;
}

export default function TimelineMap({ stops, selectedStopIndex, onStopSelect, routeName }: TimelineMapProps) {
  const today = new Date().toLocaleDateString("en-US", { weekday: "long" });

  const specialConditions = getSpecialConditionsForRoute(); // Adjusted to match the updated function signature

  const { available, message } = isBusAvailableToday(today, specialConditions);
  const limitedSchedule = getLimitedSchedule(today, specialConditions);

  if (!available) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center">
          <Navigation className="w-5 h-5 mr-2 text-university-600" />
          Route Timeline
        </h3>
        <p className="text-sm text-red-600">{message}</p>
      </div>
    );
  }

  if (limitedSchedule.length > 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center">
          <Navigation className="w-5 h-5 mr-2 text-university-600" />
          Limited Schedule for Today
        </h3>
        <ul className="list-disc pl-6">
          {limitedSchedule.map((schedule, index) => (
            <li key={index} className="text-sm text-gray-700">
              {schedule.time} - {schedule.route} (Additional Stops:{" "}
              {schedule.additionalStops.join(", ")})
            </li>
          ))}
        </ul>
      </div>
    );
  }

  if (!stops || stops.length === 0) return null;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center">
        <Navigation className="w-5 h-5 mr-2 text-university-600" />
        Route Timeline
      </h3>
      {routeName && <p className="text-sm text-gray-600 mb-4">{routeName}</p>}

      {/* Scrollable container */}
      <div className="relative max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-university-300 scrollbar-track-gray-100">
        {/* Timeline line */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-300"></div>

        <div className="space-y-4 pr-2">
          {stops.map((stop, index) => {
            const isSelected = selectedStopIndex === index;
            const isLast = index === stops.length - 1;

            return (
              <div
                key={index}
                className="relative flex items-center cursor-pointer group"
                onClick={() => onStopSelect(index)}
              >
                {/* Timeline dot */}
                <div
                  className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center border-4 transition-all duration-200 ${
                    isSelected
                      ? "bg-university-500 border-university-600 shadow-lg scale-110"
                      : "bg-white border-gray-300 group-hover:border-university-400 group-hover:scale-105"
                  }`}
                >
                  <MapPin
                    className={`w-5 h-5 ${
                      isSelected
                        ? "text-white"
                        : "text-gray-500 group-hover:text-university-600"
                    }`}
                  />
                </div>

                {/* Stop info */}
                <div
                  className={`ml-4 flex-1 p-3 rounded-lg transition-all duration-200 ${
                    isSelected
                      ? "bg-university-50 border-2 border-university-200 shadow-md"
                      : "bg-gray-50 border border-gray-200 group-hover:bg-university-25 group-hover:border-university-100 group-hover:shadow-sm"
                  }`}
                >
                  <h4
                    className={`font-medium ${
                      isSelected
                        ? "text-university-800"
                        : "text-gray-800 group-hover:text-university-700"
                    }`}
                  >
                    {stop.Stopage}
                  </h4>
                  <p
                    className={`text-sm ${
                      isSelected
                        ? "text-university-600"
                        : "text-gray-500 group-hover:text-university-500"
                    }`}
                  >
                    {stop.Time}
                  </p>
                </div>

                {/* Connection line to next stop */}
                {!isLast && (
                  <div
                    className={`absolute left-6 top-12 w-0.5 h-4 ${
                      isSelected ? "bg-university-500" : "bg-gray-300"
                    }`}
                  ></div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <p className="text-xs text-gray-600 text-center">
          Tap any stop to view arrival times • Scroll to see all stops
        </p>
      </div>
    </div>
  );
}
