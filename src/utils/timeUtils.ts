import { format, differenceInMinutes, isBefore } from 'date-fns';
import type { TimeDifference } from '../types/bus';

export const parseTimeString = (timeStr: string): Date => {
  try {
    const today = new Date();
    const [time, period] = timeStr.split(' ');
    const [hours, minutes] = time.split(':').map(Number);
    
    if (isNaN(hours) || isNaN(minutes) || !period) {
      throw new Error('Invalid time format');
    }
    
    let hour24 = hours;
    if (period === 'PM' && hours !== 12) {
      hour24 += 12;
    } else if (period === 'AM' && hours === 12) {
      hour24 = 0;
    }
    
    return new Date(today.getFullYear(), today.getMonth(), today.getDate(), hour24, minutes);
  } catch (error) {
    console.error('Error parsing time string:', error);
    return new Date(); // Return current time as fallback
  }
};

export const formatTime = (date: Date): string => {
  return format(date, 'h:mm a');
};

export const calculateTimeDifference = (targetTime: string): TimeDifference => {
  try {
    const now = new Date();
    const target = parseTimeString(targetTime);
    
    const diffMinutes = differenceInMinutes(target, now);
    const isPast = isBefore(target, now);
    
    const hours = Math.floor(Math.abs(diffMinutes) / 60);
    const minutes = Math.abs(diffMinutes) % 60;
    
    return {
      hours,
      minutes,
      totalMinutes: Math.abs(diffMinutes),
      isPast
    };
  } catch (error) {
    console.error('Error calculating time difference:', error);
    return {
      hours: 0,
      minutes: 0,
      totalMinutes: 0,
      isPast: true
    };
  }
};

export const getNextBusTime = (times: [string, string], currentTime: Date): string | null => {
  const [firstTime, secondTime] = times;
  const first = parseTimeString(firstTime);
  const second = parseTimeString(secondTime);
  
  // If current time is before first time, return first time
  if (isBefore(currentTime, first)) {
    return firstTime;
  }
  
  // If current time is between first and second, return second time
  if (isBefore(currentTime, second)) {
    return secondTime;
  }
  
  // If current time is after both times, return null (no more buses today)
  return null;
};

export const formatTimeDifference = (timeDiff: TimeDifference): string => {
  if (timeDiff.isPast) {
    return `${timeDiff.hours}h ${timeDiff.minutes}m ago`;
  }
  
  if (timeDiff.hours > 0) {
    return `in ${timeDiff.hours}h ${timeDiff.minutes}m`;
  } else {
    return `in ${timeDiff.minutes}m`;
  }
};
