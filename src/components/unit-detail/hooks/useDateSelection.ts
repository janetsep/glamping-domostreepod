
import { useState, useEffect } from 'react';
import { addDays, format } from 'date-fns';

interface UseDateSelectionProps {
  startDate?: Date;
  endDate?: Date;
  onStartDateChange: (date: Date | undefined) => void;
  onEndDateChange: (date: Date | undefined) => void;
  requiredDomos?: number;
}

export const useDateSelection = ({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  requiredDomos = 1
}: UseDateSelectionProps) => {
  // Control the open state of the calendar popovers
  const [startCalendarOpen, setStartCalendarOpen] = useState(false);
  const [endCalendarOpen, setEndCalendarOpen] = useState(false);
  
  // Track the month that should be shown in the end date calendar
  const [endDateCalendarMonth, setEndDateCalendarMonth] = useState<Date | undefined>(
    startDate ? addDays(startDate, 1) : undefined
  );
  
  // Update the end date calendar month when start date changes
  useEffect(() => {
    if (startDate) {
      setEndDateCalendarMonth(addDays(startDate, 1));
    }
  }, [startDate]);
  
  // Handle start date selection
  const handleStartDateSelect = (date: Date | undefined) => {
    setStartCalendarOpen(false);
    onStartDateChange(date);
    
    // If selecting a start date that is after or equal to end date, adjust end date
    if (date && endDate && date >= endDate) {
      const newEndDate = addDays(date, 1);
      onEndDateChange(newEndDate);
    }
    
    // After selecting start date, open end date calendar
    if (date) {
      setTimeout(() => {
        setEndCalendarOpen(true);
      }, 100);
    }
  };
  
  // Handle end date selection
  const handleEndDateSelect = (date: Date | undefined) => {
    setEndCalendarOpen(false);
    onEndDateChange(date);
    
    // Log the selection for debugging
    console.log('Selected date range:', {
      start: startDate ? format(startDate, 'yyyy-MM-dd') : 'none',
      end: date ? format(date, 'yyyy-MM-dd') : 'none',
      requiredDomos
    });
  };
  
  return {
    startCalendarOpen,
    setStartCalendarOpen,
    endCalendarOpen,
    setEndCalendarOpen,
    endDateCalendarMonth,
    handleStartDateSelect,
    handleEndDateSelect
  };
};
