import AsyncStorage from '@react-native-async-storage/async-storage';
import { createAsyncThunk } from '@reduxjs/toolkit';
import axios, { AxiosError } from 'axios';
import { ONBOARDING_ROUTES } from '../../navigation/routes';
import { ForgotPassType, LoginDataType, RegisterDataType, ResetPassType, VerifyUserType } from './types';
import { CommonActions } from '@react-navigation/native';
import { clearErrors, setIsAuth } from './authSlice';

export const userRegisterAction = createAsyncThunk<any, RegisterDataType>(
    'auth/register',
    async (dataSignUp, thunkAPI) => {
        const { registerData, navigation } = dataSignUp;
        try {
            const config = {
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
            };
            const response = await axios.post('/api/register', registerData, config);

            console.log('response --userRegisterAction->', JSON.stringify(response?.data, null, 2));
            if (response?.status === 201) {
                // await AsyncStorage.setItem('@token', response.data.accessToken);
                // axios.defaults.headers.common.Authorization = `Bearer ${response.data.accessToken}`;
                navigation.navigate(ONBOARDING_ROUTES.VERIFY_EMAIL_SCREEN, { email: registerData.username });
                thunkAPI.dispatch(clearErrors());
            }

            return response?.data;
        } catch (error) {
            if (error instanceof AxiosError) {
                if (error.response && error.response.data) {
                    return thunkAPI.rejectWithValue(error.response.data);
                } else {
                    return thunkAPI.rejectWithValue(error.message);
                }
            }
        }
    },
);

export const userVerifyAction = createAsyncThunk<any, VerifyUserType>(
    'auth/verifyUser',
    async (dataVerify, thunkAPI) => {
        const { verifyEmailData, navigation } = dataVerify;
        try {
            const config = {
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
            };
            const response = await axios.post('/api/verifyUser', verifyEmailData, config);

            console.log('response -userVerifyAction-->', JSON.stringify(response?.data, null, 2));
            if (response?.status === 201 && response?.data?.accessToken) {
                // await AsyncStorage.setItem('@token', response.data.accessToken);
                // axios.defaults.headers.common.Authorization = `Bearer ${response.data.accessToken}`;
                navigation.dispatch(
                    CommonActions.reset({
                        index: 1,
                        routes: [
                            { name: ONBOARDING_ROUTES.WELCOME_SCREEN },
                            { name: ONBOARDING_ROUTES.LOGIN_SCREEN },
                        ],
                    })
                );
            }

            return response?.data;
        } catch (error) {
            if (error instanceof AxiosError) {
                if (error.response && error.response.data) {
                    return thunkAPI.rejectWithValue(error.response.data);
                } else {
                    return thunkAPI.rejectWithValue(error.message);
                }
            }
        }
    },
);

export const userLoginAction = createAsyncThunk<any, LoginDataType>(
    'auth/login',
    async (dataSignIn, thunkAPI) => {
        try {
            const config = {
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
            };
            const response = await axios.post('/api/login', dataSignIn, config);

            console.log('response --userLoginAction->', JSON.stringify(response?.data, null, 2));
            if (response?.status === 201) {
                await AsyncStorage.setItem('@token', response.data.accessToken);
                axios.defaults.headers.common.Authorization = `Bearer ${response.data.accessToken}`;
                thunkAPI.dispatch(setIsAuth(true));
                thunkAPI.dispatch(clearErrors());
            }

            return response?.data;
        } catch (error) {
            console.log('-userLoginAction-->', error?.response?.data);
            if (error instanceof AxiosError) {
                if (error.response && error.response.data) {
                    return thunkAPI.rejectWithValue(error.response.data);
                } else {
                    return thunkAPI.rejectWithValue(error.message);
                }
            }
        }
    },
);

export const forgotPasswordAction = createAsyncThunk<any, ForgotPassType>(
    'auth/forgotPass',
    async (dataForgotPass, thunkAPI) => {
        const { forgotPassData, navigation } = dataForgotPass;
        try {
            const config = {
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
            };
            const response = await axios.post('/api/setResetPassword', forgotPassData, config);

            console.log('response -forgotPasswordAction-->', JSON.stringify(response?.data, null, 2));
            if (response?.status === 201) {
                navigation.navigate(ONBOARDING_ROUTES.RESET_PASSWORD_SCREEN, { email: forgotPassData.username });
                thunkAPI.dispatch(clearErrors());
            }

            return response?.data;
        } catch (error) {
            console.log('-forgotPasswordAction-->', error?.response?.data);
            if (error instanceof AxiosError) {
                if (error.response && error.response.data) {
                    return thunkAPI.rejectWithValue(error.response.data);
                } else {
                    return thunkAPI.rejectWithValue(error.message);
                }
            }
        }
    },
);

export const resetPasswordAction = createAsyncThunk<any, ResetPassType>(
    'auth/resetPass',
    async (dataResetPass, thunkAPI) => {
        const { resetPassData, navigation } = dataResetPass;
        try {
            const config = {
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
            };
            const response = await axios.post('/api/resetPassword', resetPassData, config);

            console.log('response -resetPasswordAction-->', JSON.stringify(response?.data, null, 2));
            if (response?.status === 201) {

                thunkAPI.dispatch(clearErrors());
            }

            return response?.data;
        } catch (error) {
            console.log('-resetPasswordAction-->', error?.response?.data);
            if (error instanceof AxiosError) {
                if (error.response && error.response.data) {
                    return thunkAPI.rejectWithValue(error.response.data);
                } else {
                    return thunkAPI.rejectWithValue(error.message);
                }
            }
        }
    },
);
