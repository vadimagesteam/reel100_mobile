import { useState, useCallback, useMemo } from 'react';
import { format } from 'date-fns';
import { colors } from '../../theme/colors';

export const useCalendarModal = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(() => format(new Date(), 'yyyy-MM-dd'));
  const [tempDate, setTempDate] = useState(selectedDate);

  const open = useCallback(() => {
    setTempDate(selectedDate);
    setIsVisible(true);
  }, [selectedDate]);

  const cancel = useCallback(() => {
    setIsVisible(false);
  }, []);

  const confirm = useCallback(() => {
    setSelectedDate(tempDate);
    setIsVisible(false);
  }, [tempDate]);

  const marked = useMemo(() => {
    const dateToMark = isVisible ? tempDate : selectedDate;

    return {
      [dateToMark]: {
        selected: true,
        selectedColor: colors.blue,
        selectedTextColor: colors.white,
      },
    };
  }, [selectedDate, tempDate, isVisible]);

  return {
    isVisible,
    selectedDate,
    tempDate,
    open,
    cancel,
    confirm,
    setTempDate,
    marked,
  };
};
