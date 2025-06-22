import React from 'react';
import { View, Modal, StyleSheet, Platform } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { MarkedDates } from 'react-native-calendars/src/types';
import { colors, positionHelpers } from '../../../styles';
import { BodyText, ButtonDefault } from '../UI';
import ButtonGradient from '../ButtonGradient';

interface CalendarModalProps {
    isCalendarModal: boolean;
    marked: any;
    currentDate: string;
    setVisibleDate: (date: string) => void;
    onCancelPress: () => void;
    onSubmitPress: () => void;
}

const CalendarModal = ({
    isCalendarModal,
    marked,
    currentDate,
    setVisibleDate,
    onCancelPress,
    onSubmitPress,
}: CalendarModalProps) => {
    return (
        <Modal transparent={true} visible={isCalendarModal}>
            <View style={[positionHelpers.fill, positionHelpers.justifyCenter, { backgroundColor: colors.blackOpacity40 }]}>
                <View style={cs.modalView}>
                    <Calendar
                        current={currentDate} // ⬅️ календар відкривається на вибраний місяць
                        markedDates={marked}
                        onDayPress={(day) => setVisibleDate(day.dateString)}
                        theme={{
                            calendarBackground: colors.black1,
                            arrowColor: colors.blue,
                            monthTextColor: colors.white,
                            textMonthFontWeight: '500',
                            dayTextColor: colors.white,
                            todayTextColor: colors.blue1,
                        }}
                    />

                    <View style={[positionHelpers.rowFillCenter, cs.containerButtons, positionHelpers.mt15]}>
                        <ButtonDefault
                            hitSlop={{ top: 8, left: 8, bottom: 8, right: 8 }}
                            buttoStyles={[cs.buttonStyle, cs.button]}
                            onPress={onCancelPress}>
                            <BodyText fontWeight="400" fontSize={14} color={colors.white}>Cancel</BodyText>
                        </ButtonDefault>
                        <ButtonGradient
                            hitSlop={{ top: 8, left: 8, bottom: 8, right: 8 }}
                            title="Confirm"
                            marginText={10}
                            buttonStyles={[cs.buttonBlueStyle, cs.button]}
                            onPress={onSubmitPress}>
                            <BodyText fontWeight="600" fontSize={11} color={colors.green}>Submit</BodyText>
                        </ButtonGradient>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const cs = StyleSheet.create({
    modalView: {
        marginBottom: 30,
        marginHorizontal: 27,
        backgroundColor: colors.black1,
        ...Platform.select({
            ios: {
                shadowColor: colors.blackOpacity35,
                shadowOffset: { width: 1, height: 1 },
                shadowOpacity: 1,
                elevation: 1,
            },
            android: {
                elevation: 1,
            },
        }),
        borderRadius: 16,

    },
    containerButtons: {
        paddingHorizontal: 28,
        marginBottom: 26,
    },
    button: {
        padding: 0,
        paddingVertical: 13,
        minWidth: 125,
    },
    buttonStyle: {
        borderColor: colors.silver1,
        borderWidth: 1,
        padding: 18,
        borderRadius: 3,
        alignItems: 'center',
    },
    buttonBlueStyle: {
        marginBottom: 0,
        paddingTop: 13,
    },
});

export default CalendarModal;
