import React, { useState, useEffect } from 'react';
import { View, SafeAreaView, TouchableOpacity } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import { colors, positionHelpers } from '../../../../styles';
import DropdownMenu from '../../../../components/DropdownMenu';
import { SvgIcon } from '../../../../components/UI';
import { states } from './mockData';
import {
    RootState,
    useReduxDispatch,
    useReduxSelector,
    // useReduxSelector
} from '../../../../store/store';
import { getStatesAction } from '../../../../redux/StatesRedux/statesAction';
import { requestLocationPermission, getStateFromCoords } from './helpers';
import TabViewVideo from '../../../../components/TabViewVideo';
import CustomHeader from '../../../../components/navigator/CustomHeader';
import { getUserInfoAction } from '../../../../redux/AuthRedux/authAction';
import { getVideosAction } from '../../../../redux/CameraRedux/cameraActions';
import MenuModal from '../../../../components/Modals/MemuModal';
// import { DASHBOARD_ROUTES } from '../../../../navigation/routes';
import { setMenuModal } from '../../../../redux/ModalsRedux/modalSlice';

const MainScreen = () => {
    const dispatch = useReduxDispatch();
    const { videos } = useReduxSelector((state: RootState) => state?.camera);
    const [selectedState, setSelectedState] = useState<string | null>(null);
    const [_, setSelectedAutoState] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<string>('top_100');


    useEffect(() => {
        dispatch(getStatesAction());
        dispatch(getUserInfoAction());
        dispatch(getVideosAction());
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
                        console.log('Не вдалося отримати штат через Nominatim');
                    }
                },
                async (error) => {
                    console.log('Geolocation error:', error);
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
                        placeholder="Change Country"
                        selectedValue={selectedState}
                        onSelect={setSelectedState}
                    />
                    <TouchableOpacity
                        onPress={() => dispatch(setMenuModal(true))}
                    >
                        <SvgIcon image="menu" />
                    </TouchableOpacity>
                </View>

                {/* TabView for Video */}
                <TabViewVideo allVideo={videos} activeTab={activeTab} setActiveTab={setActiveTab} />
            </SafeAreaView >

            {/* MenuModal */}
            <MenuModal onVisible={() => dispatch(setMenuModal(false))} />
        </>
    );
};

export default MainScreen;
