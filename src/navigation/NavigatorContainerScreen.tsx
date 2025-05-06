import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { hideSplash } from 'react-native-splash-view';
import Config from 'react-native-config';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useReduxDispatch, useReduxSelector } from '../store/store';
import AuthStack from './Onboarding/AuthStack';
import { onLogout, setIsAuth, setStatusRegister, setUserID } from '../redux/AuthRedux/authSlice';
import CustomTabNavigator from './CustomTabNavigator';
import { tickAction } from '../redux/CoutdownClockRedux/countdownClockSlice';

axios.defaults.baseURL = Config.APP_API_URL;

const TimerStarter = () => {
    const dispatch = useReduxDispatch();

    useEffect(() => {
        const interval = setInterval(() => {
            dispatch(tickAction());
        }, 1000);
        return () => clearInterval(interval);
    }, [dispatch]);

    return null;
};

const NavigationContainerScreen = () => {
    const dispatch = useReduxDispatch();
    const { isAuth, isStatus } = useReduxSelector(state => state?.auth);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                // // await AsyncStorage.removeItem('@token');
                // dispatch(onLogout());
                // AsyncStorage.removeItem('@isVerified');
                // AsyncStorage.removeItem('@statusRegister');
                const userID: any = await AsyncStorage.getItem('@userId');
                dispatch(setUserID(userID));
                const token = await AsyncStorage.getItem('@token');
                const isVerified = await AsyncStorage.getItem('@isVerified');
                const statusRegister = await AsyncStorage.getItem('@statusRegister');
                const parsedStatusData = statusRegister ? JSON.parse(statusRegister) : null;

                if (parsedStatusData?.status === 'STATUS_PENDING') {
                    dispatch(setStatusRegister(parsedStatusData));
                } else {
                    if (token && JSON.parse(isVerified) === true) {
                        axios.defaults.headers.common.Authorization = `Bearer ${token}`;
                        dispatch(setIsAuth(true));
                    } else {
                        dispatch(setIsAuth(false));
                    }
                }
            } catch (error) {
                console.error('Помилка перевірки авторизації:', error);
            }
        };

        checkAuth();
    }, [dispatch]);

    useEffect(() => {
        setTimeout(() => {
            hideSplash();
        }, 1000);
    }, []);

    return (
        <>
            <TimerStarter />
            <NavigationContainer>
                {
                    !isAuth ? (
                        <AuthStack checkStatus={isStatus?.status} />
                    ) : (
                        <CustomTabNavigator />
                    )
                }
            </NavigationContainer>
        </>
    );
};

export default NavigationContainerScreen;
