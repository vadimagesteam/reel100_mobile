import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useReduxSelector } from '../store/store';
import AuthStack from './Onboarding/AuthStack';
import MainScreen from '../screens/Dashboard/Main';
import Config from 'react-native-config';
import axios from 'axios';

axios.defaults.baseURL = Config.APP_API_URL;

const NavigationContainerScreen = () => {
    const { isAuth } = useReduxSelector(state => state?.auth);

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
