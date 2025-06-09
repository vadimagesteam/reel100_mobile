import React, { useCallback } from 'react';
import { SafeAreaView } from 'react-native';
import { colors, positionHelpers } from '../../../../styles';
import CustomHeader from '../../../../components/navigator/CustomHeader';
import { useReduxDispatch } from '../../../../store/store';
import { setMenuModal } from '../../../../redux/ModalsRedux/modalSlice';
import HeaderCalendar from './components/HeaderCalendar';
import CalendarModal from '../../../../components/CalendarModal';
import { useCalendarModal } from './hooks/useCalendarModal';
import MenuModal from '../../../../components/Modals/MenuModal';

const MemoizedTimerHeader = React.memo(CustomHeader);
const MemoizedHeaderCalendar = React.memo(HeaderCalendar);

const GlobalVideoScreen = () => {
    const dispatch = useReduxDispatch();
    const {
        isVisible,
        selectedDate,
        tempDate,
        open,
        cancel,
        confirm,
        setTempDate,
        marked,
    } = useCalendarModal();

    const openMenu = useCallback(() => {
        dispatch(setMenuModal(true));
    }, [dispatch]);

    return (
        <>
            <MemoizedTimerHeader />
            <SafeAreaView style={[positionHelpers.fill, { backgroundColor: colors.black4 }]}>
                <MemoizedHeaderCalendar
                    openMenu={openMenu}
                    markerDate={selectedDate}
                    onCalendar={open}
                />
            </SafeAreaView>

            {/* Modal */}
            <CalendarModal
                isCalendarModal={isVisible}
                marked={marked}
                currentDate={tempDate}
                setVisibleDate={setTempDate}
                onCancelPress={cancel}
                onSubmitPress={confirm}
            />
            {/* MenuModal */}
            <MenuModal onVisible={() => dispatch(setMenuModal(false))} />
        </>
    );
};

export default GlobalVideoScreen;
