export interface BusStop {
  id: string;
  name: string;
  times: {
    [startTime: string]: string[]; // Array of times for each start time
  };
}

export interface Bus {
  id: string;
  name: string;
  route: string;
  startTimes: string[];
  stops: BusStop[];
}

export interface BusScheduleData {
  buses: Bus[];
}

export interface TimeDifference {
  hours: number;
  minutes: number;
  totalMinutes: number;
  isPast: boolean;
}

export interface SelectedBusInfo {
  bus: Bus | null;
  startTime: string | null;
  selectedStop: BusStop | null;
}
