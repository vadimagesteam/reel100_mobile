import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { hideSplash } from 'react-native-splash-view';
import Config from 'react-native-config';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import store, { useReduxDispatch, useReduxSelector } from '../store/store';
import AuthStack from './Onboarding/AuthStack';
import { onLogout, setIsAuth, setStatusRegister } from '../redux/AuthRedux/authSlice';
import CustomTabNavigator from './CustomTabNavigator';
import { tickAction } from '../redux/CoutdownClockRedux/countdownClockSlice';

axios.defaults.baseURL = Config.APP_API_URL;

axios.interceptors.response.use(
    response => response,
    async error => {
        if (error.response?.status === 401) {
            store.dispatch(onLogout());
        }
        return Promise.reject(error);
    }
);

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
