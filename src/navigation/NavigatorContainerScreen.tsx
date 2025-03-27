import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import Config from 'react-native-config';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useReduxDispatch, useReduxSelector } from '../store/store';
import AuthStack from './Onboarding/AuthStack';
import { onLogout, setIsAuth } from '../redux/AuthRedux/authSlice';
import CustomTabNavigator from './CustomTabNavigator';

axios.defaults.baseURL = Config.APP_API_URL;

const NavigationContainerScreen = () => {
    const dispatch = useReduxDispatch();
    const { isAuth } = useReduxSelector(state => state?.auth);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                // await AsyncStorage.removeItem('@token');
                // dispatch(onLogout());
                const token = await AsyncStorage.getItem('@token');
                if (token) {
                    axios.defaults.headers.common.Authorization = `Bearer ${token}`;
                    dispatch(setIsAuth(true));
                } else {
                    dispatch(setIsAuth(false));
                }
            } catch (error) {
                console.error('Помилка перевірки авторизації:', error);
            }
        };

        checkAuth();
    }, [dispatch]);

    return (
        <NavigationContainer>
            {
                !isAuth ? (
                    <AuthStack />
                ) : (
                    <CustomTabNavigator />
                )
            }
        </NavigationContainer>
    );
};

export default NavigationContainerScreen;
