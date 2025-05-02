import AsyncStorage from '@react-native-async-storage/async-storage';
import { createAsyncThunk } from '@reduxjs/toolkit';
import axios, { AxiosError } from 'axios';
import { ONBOARDING_ROUTES } from '../../navigation/routes';
import { ForgotPassType, LoginDataType, RegisterDataType, ResetPassType, ResendVerifyUserType, VerifyUserType } from './types';
import { CommonActions } from '@react-navigation/native';
import { clearErrors, setIsAuth } from './authSlice';
import { Alert } from 'react-native';

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

            if (response?.status === 201) {
                const statusData = {
                    email: registerData.username,
                    status: 'STATUS_PENDING',
                };
                await AsyncStorage.setItem('@statusRegister', JSON.stringify(statusData));
                navigation.navigate(ONBOARDING_ROUTES.VERIFY_EMAIL_SCREEN, { email: registerData.username });
                thunkAPI.dispatch(clearErrors());
            }

            return response?.data;
        } catch (error) {
            if (error instanceof AxiosError) {
                if (error.response && error.response.data) {
                    if (error.response.data?.statusCode === 401) {
                        Alert.alert(
                            'Registration faliled',
                            'This account is already registered. Please check your email and enter the verification code to confirm your email address.',
                            [
                                {
                                    text: 'OK',
                                    onPress: () => navigation.navigate(ONBOARDING_ROUTES.VERIFY_EMAIL_SCREEN, { email: registerData.username }),
                                },
                            ],
                        );
                    }
                    return thunkAPI.rejectWithValue(error.response.data);
                } else {
                }
            }
        }
    },
);

export const userVerifyAction = createAsyncThunk<any, VerifyUserType>(
    'auth/verifyUser',
    async (dataVerify, thunkAPI) => {
        const { verifyEmailData } = dataVerify;
        try {
            const config = {
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
            };
            const response = await axios.post('/api/verifyUser', verifyEmailData, config);

            if (response?.status === 201 && response?.data?.accessToken) {
                await AsyncStorage.setItem('@token', response.data.accessToken);
                await AsyncStorage.setItem('@isVerified', JSON.stringify(true));
                axios.defaults.headers.common.Authorization = `Bearer ${response.data.accessToken}`;

                thunkAPI.dispatch(setIsAuth(true));
                thunkAPI.dispatch(clearErrors());
                await AsyncStorage.removeItem('@statusRegister');
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

export const resendUserVerifyAction = createAsyncThunk<any, ResendVerifyUserType>(
    'auth/resendVerifyUser',
    async (dataVerify, thunkAPI) => {
        const { resendVerifyEmailData } = dataVerify;
        try {
            const config = {
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
            };
            const response = await axios.post('/api/resendVerificationCode', resendVerifyEmailData, config);

            if (response?.status === 201) {
                Alert.alert(
                    'Сode resent',
                    'Please check your email and enter the verification code to confirm your email address.',
                    [
                        {
                            text: 'OK',
                            onPress: () => true,
                        },
                    ],
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
        const { dataLogin, navigation } = dataSignIn;
        try {
            const config = {
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
            };
            const response = await axios.post('/api/login', dataLogin, config);

            // console.log('-userLoginAction-->', response?.data);

            if (response?.status === 201) {
                const isVerified = await AsyncStorage.getItem('@isVerified');
                if (JSON.parse(isVerified) !== true) {
                    Alert.alert(
                        'Please verify your email before logging in.',
                        'This account is already registered. Please check your email and enter the verification code to confirm your email address.',
                        [
                            {
                                text: 'OK',
                                onPress: () => navigation.navigate(ONBOARDING_ROUTES.VERIFY_EMAIL_SCREEN, { email: dataLogin.username }),
                            },
                        ],
                    );
                    return thunkAPI.rejectWithValue({
                        message: 'Please verify your email before logging in',
                    });


                }

                await AsyncStorage.setItem('@token', response.data.accessToken);
                axios.defaults.headers.common.Authorization = `Bearer ${response.data.accessToken}`;

                thunkAPI.dispatch(setIsAuth(true));
                thunkAPI.dispatch(clearErrors());
            }

            return response?.data;
        } catch (error) {
            // console.log('-userLoginAction-error->', error);
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

            if (response?.status === 201) {
                navigation.navigate(ONBOARDING_ROUTES.RESET_PASSWORD_SCREEN, { email: forgotPassData.username });
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

            console.log('---resetPasswordAction--->', response?.data);
            if (response?.status === 201) {
                navigation.dispatch(
                    CommonActions.reset({
                        index: 1,
                        routes: [
                            { name: ONBOARDING_ROUTES.WELCOME_SCREEN },
                            { name: ONBOARDING_ROUTES.LOGIN_SCREEN },
                        ],
                    })
                );

                // await AsyncStorage.setItem('@token', response.data.accessToken);
                // axios.defaults.headers.common.Authorization = `Bearer ${response.data.accessToken}`;
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
