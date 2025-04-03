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
import TabViewVideo from '../../../../components/TabViewVideo';

const MainScreen = () => {
    const dispatch = useReduxDispatch();
    // const { statesData } = useReduxSelector(state => state?.states);
    const [selectedState, setSelectedState] = useState<string | null>(null);
    const [_, setSelectedAutoState] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<string>('top_100');


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
                    {/* Dropdown menu(geolocation) */}
                    <DropdownMenu
                        data={states}
                        placeholder="Change Country"
                        selectedValue={selectedState}
                        onSelect={setSelectedState}
                    />
                    <SvgIcon image="eyeShow" color={colors.white} />
                </View>

                {/* TabView for Video */}
                <TabViewVideo activeTab={activeTab} setActiveTab={setActiveTab} />
            </SafeAreaView>
        </>
    );
};

export default MainScreen;
