import React, { useCallback, useMemo, useState } from 'react';
import { SafeAreaView } from 'react-native';
import { MarkedDates } from 'react-native-calendars/src/types';
import { format } from 'date-fns';
import { colors, positionHelpers } from '../../../../styles';
import CustomHeader from '../../../../components/navigator/CustomHeader';
import { useReduxDispatch } from '../../../../store/store';
import { setMenuModal } from '../../../../redux/ModalsRedux/modalSlice';
import HeaderCalendar from './components/HeaderCalendar';
import CalendarModal from '../../../../components/CalendarModal';

const MemoizedHeaderCalendar = React.memo(HeaderCalendar);

const GlobalVideoScreen = () => {
    const dispatch = useReduxDispatch();

    const [isCalendarModal, setIsCalendarModal] = useState(false);
    const [selectedDate, setSelectedDate] = useState(() => format(new Date(), 'yyyy-MM-dd'));
    const [visibleDate, setVisibleDate] = useState(() => format(new Date(), 'yyyy-MM-dd'));

    const openMenu = useCallback(() => {
        dispatch(setMenuModal(true));
    }, [dispatch]);

    const marked = useMemo(() => {
        const dateToMark = isCalendarModal ? visibleDate : selectedDate;

        return {
            [dateToMark]: {
                selected: true,
                selectedColor: colors.blue,
                selectedTextColor: colors.white,
            },
        };
    }, [selectedDate, visibleDate, isCalendarModal]);

    const openCalendar = () => {
        setVisibleDate(selectedDate); // ⬅️ зберігаємо поточну вибрану дату як стартову точку
        setIsCalendarModal(true);
    };

    const handleCancel = useCallback(() => {
        setIsCalendarModal(false); // не змінюємо selectedDate
    }, []);

    const handleSubmit = useCallback(() => {
        setIsCalendarModal(false);
        setSelectedDate(visibleDate); // ⬅️ підтверджуємо вибір
    }, [visibleDate]);

    return (
        <>
            <CustomHeader title="00:00:00" />
            <SafeAreaView style={[positionHelpers.fill, { backgroundColor: colors.black4 }]}>
                <MemoizedHeaderCalendar
                    openMenu={openMenu}
                    markerDate={selectedDate}
                    onCalendar={openCalendar}
                />
            </SafeAreaView>

            <CalendarModal
                isCalendarModal={isCalendarModal}
                marked={marked}
                currentDate={visibleDate}
                setVisibleDate={setVisibleDate}
                onCancelPress={handleCancel}
                onSubmitPress={handleSubmit}
            />
        </>
    );
};

export default GlobalVideoScreen;
