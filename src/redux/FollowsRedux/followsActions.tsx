import AsyncStorage from '@react-native-async-storage/async-storage';
import { createAsyncThunk } from '@reduxjs/toolkit';
import axios, { AxiosError } from 'axios';

export const setFollowAction = createAsyncThunk<any, void>(
    'follows/setFollow',
    async (dataFollow, thunkAPI) => {

        console.log('---data follow-->', dataFollow);
        console.log('---data dataFollow?.who?.id-->', dataFollow?.who?.id);
        try {
            // const token = await AsyncStorage.getItem('@token');
            // console.log('token--->', token);
            // const config = {
            //     headers: {
            //         Accept: 'application/json',
            //         'Content-Type': 'application/json',
            //         Authorization: `Bearer ${token}`,
            //     },
            // };
            const response = await axios.post(`/api/follows?who[id]=${dataFollow?.who?.id}&whom[id]=${dataFollow?.whom?.id}`, dataFollow);
            console.log('response--setFollowAction--->>', response);
            thunkAPI.dispatch(getFollowAction());
            return response?.data;
        } catch (error) {
            console.log('response--setFollowAction--->>', error?.response?.data);
            if (error instanceof AxiosError) {
                if (error.response && error.response.data) {
                    return thunkAPI.rejectWithValue(error.response.data);
                } else {
                }
            }
        }
    },
);

export const getFollowAction = createAsyncThunk<any, void>(
    'follows/getFollow',
    async (_, thunkAPI) => {
        try {
            const token = await AsyncStorage.getItem('@token');

            console.log('token--->', token);
            const config = {
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            };
            const response = await axios.get('/api/follows', config);
            console.log('response--getFollowAction--->>', response);
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

export const unFollowAction = createAsyncThunk<any, void>(
    'follows/unFollow',
    async (id, thunkAPI) => {
        try {
            const response = await axios.delete(`/api/follows/${id}`);

            console.log('response--unFollowAction--->>', response);
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
