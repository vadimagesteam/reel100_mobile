import { createAsyncThunk } from '@reduxjs/toolkit';
import axios, { AxiosError } from 'axios';
import { getOneUserAction } from '../UsersRedux/usersAction';

export const setFollowAction = createAsyncThunk<any, any>(
    'follows/setFollow',
    async (dataFollow, thunkAPI) => {
        try {
            const response = await axios.post('/api/follows', dataFollow);

            console.log('response-setFollowAction-->', response);

            if (response?.status === 201) {
                thunkAPI.dispatch(getFollowAction({ myId: dataFollow?.who?.id, userId: dataFollow?.whom?.id }));
                thunkAPI.dispatch(getOneUserAction(dataFollow?.whom?.id));
            }

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

export const getFollowAction = createAsyncThunk<any, { myId: string | undefined, userId: string }>(
    'follows/getFollow',
    async ({ myId, userId }, thunkAPI) => {
        console.log('myId-->', myId, 'userId-->', userId);
        try {
            const config = {
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
            };
            const response = await axios.get(`/api/follows?where[who][id]=${myId}&where[whom][id]=${userId}`, config);
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

export const unFollowAction = createAsyncThunk<any, { id: string, myId: string | undefined, userId: string }>(
    'follows/unFollow',
    async ({ id, myId, userId }, thunkAPI) => {
        try {
            const response = await axios.delete(`/api/follows/${id}`);

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
