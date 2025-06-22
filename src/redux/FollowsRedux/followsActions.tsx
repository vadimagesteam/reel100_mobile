import { createAsyncThunk } from '@reduxjs/toolkit';
import axios, { AxiosError } from 'axios';
import { getOneUserAction } from '../UsersRedux/usersAction';
import { Alert } from 'react-native';
import { api } from '../../lib/api.ts';

export const setFollowAction = createAsyncThunk<any, any>(
    'follows/setFollow',
    async (dataFollow, thunkAPI) => {
        try {
            const response = await api.post('/api/follows', dataFollow);

            console.log('response-setFollowAction-->', response);

            if (response?.status === 201) {
                thunkAPI.dispatch(getFollowAction({ myId: dataFollow?.who?.id, userId: dataFollow?.whom?.id }));
                thunkAPI.dispatch(getOneUserAction(dataFollow?.whom?.id));
            }

            return response?.data;
        } catch (error) {
            console.log('response--setFollowAction--->>', error?.response?.data);
            if (error instanceof AxiosError) {
                const errorData = error.response?.data;

                // Покажи алерт, якщо статус 500
                if (errorData?.statusCode === 500) {
                    Alert.alert(errorData.message);
                }

                if (error.response && error.response.data) {
                    return thunkAPI.rejectWithValue(error.response.data);
                } else {
                }
            }
        }
    },
);

export const getFollowAction = createAsyncThunk<any, { myId: string | undefined, userId: string }>(
    'follows/getFollow',
    async ({ myId, userId }, thunkAPI) => {
        try {
            const config = {
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
            };
            const response = await api.get(`/api/follows?where[who][id]=${myId}&where[whom][id]=${userId}`, config);
            return response?.data;
        } catch (error) {
            if (error instanceof AxiosError) {
                if (error.response && error.response.data) {
                    return thunkAPI.rejectWithValue(error.response.data);
                } else {
                }
            }
        }
    },
);

export const unFollowAction = createAsyncThunk<any, { id: string, myId: string | undefined, userId: string }>(
    'follows/unFollow',
    async ({ id, myId, userId }, thunkAPI) => {
        try {
            const response = await api.delete(`/api/follows/${id}`);

            console.log('response--unFollowAction--->>', response);

            if (response?.status === 200) {
                thunkAPI.dispatch(getFollowAction({ myId: myId, userId: userId }));
                thunkAPI.dispatch(getOneUserAction(userId));
            }

            return response?.data;
        } catch (error) {
            console.log('error--unFollowAction--->>', error?.response?.data);
            if (error instanceof AxiosError) {
                if (error.response && error.response.data) {
                    return thunkAPI.rejectWithValue(error.response.data);
                } else {
                }
            }
        }
    },
);
