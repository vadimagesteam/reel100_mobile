import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useReduxDispatch, useReduxSelector } from '../store/store';
import AuthStack from './Onboarding/AuthStack';
import MainScreen from '../screens/Dashboard/Main';
import Config from 'react-native-config';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setIsAuth } from '../redux/AuthRedux/authSlice';

axios.defaults.baseURL = Config.APP_API_URL;

const NavigationContainerScreen = () => {
    const dispatch = useReduxDispatch();
    const { isAuth } = useReduxSelector(state => state?.auth);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                // await AsyncStorage.removeItem('@token');
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
                    <MainScreen />
                )
            }
        </NavigationContainer>
    );
};

export default NavigationContainerScreen;
