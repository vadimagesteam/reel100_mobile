import React from 'react';
import { StyleSheet, View } from 'react-native';
import { BodyText } from '../UI';
import { useReduxSelector } from '../../store/store';
import { formatClockTime } from '../../utils/formatTime';
import { colors, positionHelpers } from '../../styles';

const CountdownClockHeader = () => {
    const time = useReduxSelector((state) => state.countdownClock.time);

    return (
        <View style={[positionHelpers.center, positionHelpers.ph16, styles.container]}>
            <BodyText style={styles.text}>
                &#9203; <BodyText style={[styles.timer]}>{formatClockTime(time)}</BodyText>  &#9203;
            </BodyText>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        // backgroundColor: '#222831',
        paddingVertical: 10,
        borderRadius: 10,
        elevation: 4,

        marginLeft: 28,
    },
    text: {
        color: '#fff',
        fontSize: 16,
    },
    timer: {
        fontWeight: 'bold',
        fontSize: 18,
        color: colors.blue2,
        fontVariant: ['tabular-nums'],
    },
});

export default CountdownClockHeader;


