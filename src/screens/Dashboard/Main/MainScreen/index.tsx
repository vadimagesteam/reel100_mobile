import React, {useState, useEffect} from 'react';
import {View, SafeAreaView, TouchableOpacity} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import {colors, positionHelpers} from '../../../../styles';
import DropdownMenu from '../../../../components/DropdownMenu';
import {SvgIcon} from '../../../../components/UI';
import {useReduxDispatch} from '../../../../store/store';
import {getStatesAction} from '../../../../redux/StatesRedux/statesAction';
import {requestLocationPermission, getStateFromCoords} from './helpers';
import TabViewVideo from '../../../../components/TabViewVideo';
import CustomHeader from '../../../../components/navigator/CustomHeader';
import {getUserInfoAction} from '../../../../redux/AuthRedux/authAction';
import MenuModal from '../../../../components/Modals/MenuModal';
import {setMenuModal} from '../../../../redux/ModalsRedux/modalSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useSelector} from 'react-redux';

const MemoizedDropdownMenu = React.memo(DropdownMenu);
const MemoizedTabViewVideo = React.memo(TabViewVideo);

const MainScreen = () => {
  const dispatch = useReduxDispatch();
  const statesSelector = useSelector(state => (state as any).states);

  const openMenu = React.useCallback(() => {
    dispatch(setMenuModal(true));
  }, [dispatch]);
  const [selectedState, setSelectedState] = useState<string | null>('FL');
  const [activeTab, setActiveTab] = useState<string>('top_100');
  const [states, setStates] = useState<any[]>([]);

  useEffect(() => {
    dispatch(getStatesAction());
    dispatch(getUserInfoAction());
    (async () => {
      const stateFromStorage = await AsyncStorage.getItem('STATE');
      if (stateFromStorage) {
        setSelectedState(stateFromStorage);
      }
    })();
  }, []);

  useEffect(() => {
    const statesData = statesSelector.statesData;
    if (statesData) {
      setStates(statesData);
    }
  }, [statesSelector]);

  useEffect(() => {
    const getUserLocation = async () => {
      const hasPermission = await requestLocationPermission();
      if (!hasPermission) {
        console.warn('Location permission denied');
        return;
      }

      Geolocation.getCurrentPosition(
        async position => {
          const {latitude, longitude} = position.coords;

          const state = await getStateFromCoords(latitude, longitude);
          if (state) {
            setSelectedState(prevState => prevState ?? state);
          } else {
            console.log('Can not get state from Nominatim');
          }
        },
        async error => {
          console.log('Geolocation error:', error);
        },
        {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
      );
    };

    getUserLocation();
  }, []);

  useEffect(() => {
    if (selectedState) {
      AsyncStorage.setItem('STATE', selectedState);
    }
  }, [selectedState]);

  return (
    <>
      <CustomHeader title="00:00:00" />
      <SafeAreaView
        style={[positionHelpers.fill, {backgroundColor: colors.black4}]}>
        <View
          style={[
            positionHelpers.ph16,
            positionHelpers.mt10,
            positionHelpers.rowFillCenter,
          ]}>
          <MemoizedDropdownMenu
            data={states}
            placeholder="Change Country"
            selectedValue={selectedState}
            onSelect={setSelectedState}
          />
          <TouchableOpacity onPress={openMenu}>
            <SvgIcon image="menu" />
          </TouchableOpacity>
        </View>

        {/* TabView for Video */}
        <MemoizedTabViewVideo
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
      </SafeAreaView>

      {/* MenuModal */}
      <MenuModal onVisible={() => dispatch(setMenuModal(false))} />
    </>
  );
};

export default MainScreen;
