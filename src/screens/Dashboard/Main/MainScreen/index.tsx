import React, { useState, useEffect } from 'react';
import { View, SafeAreaView } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import { colors, positionHelpers } from '../../../../styles';
import CustomHeader from '../../../../navigation/CustomHeader';
import DropdownMenu from '../../../../components/DropdownMenu';
import { SvgIcon } from '../../../../components/UI';
import { states } from './mockData';
import {
    useReduxDispatch,
    // useReduxSelector
} from '../../../../store/store';
import { getStatesAction } from '../../../../redux/StatesRedux/statesAction';
import { requestLocationPermission, getStateFromCoords } from './helpers';

const MainScreen = () => {
    const dispatch = useReduxDispatch();
    const [selectedState, setSelectedState] = useState<string | null>(null);
    const [_, setSelectedAutoState] = useState<string | null>(null);
    // const { statesData } = useReduxSelector(state => state?.states);

    useEffect(() => {
        dispatch(getStatesAction());
    }, []);

    useEffect(() => {
        const getUserLocation = async () => {
            const hasPermission = await requestLocationPermission();
            if (!hasPermission) {
                console.warn('Location permission denied');
                return;
            }

            Geolocation.getCurrentPosition(
                async (position) => {
                    const { latitude, longitude } = position.coords;

                    const state = await getStateFromCoords(latitude, longitude);
                    if (state) {
                        setSelectedAutoState(state);
                        setSelectedState(prevState => prevState ?? state);
                    } else {
                        console.warn('Не вдалося отримати штат через Nominatim');
                    }
                },
                async (error) => {
                    console.error('Geolocation error:', error);
                },
                { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
            );
        };

        getUserLocation();
    }, []);

    return (
        <>
            <CustomHeader title="00:00:00" />
            <SafeAreaView style={[positionHelpers.fill, { backgroundColor: colors.black4 }]} >
                <View style={[positionHelpers.ph16, positionHelpers.mt10, positionHelpers.rowFillCenter]}>
                    <DropdownMenu
                        data={states}
                        placeholder="Select an option"
                        selectedValue={selectedState}
                        onSelect={setSelectedState}
                    />

                    <SvgIcon image="eyeShow" color={colors.white} />
                </View>
                {/* <View>
                    <BodyText></BodyText>
                </View> */}
            </SafeAreaView>
        </>
    );
};

export default MainScreen;
