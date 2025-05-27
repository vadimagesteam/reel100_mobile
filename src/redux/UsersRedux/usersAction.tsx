import { createAsyncThunk } from '@reduxjs/toolkit';
import axios, { AxiosError } from 'axios';

export const getUsersAction = createAsyncThunk<any, string>(
    'users/getUsers',
    async (query, thunkAPI) => {
        try {
            const config = {
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
            };
            const response = await axios.get(`/api/users?where[any]=${query}`, config);

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

export const getOneUserAction = createAsyncThunk<any, string | undefined>(
    'users/getOneUser',
    async (id, thunkAPI) => {
        try {
            const config = {
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
            };
            const response = await axios.get(`/api/users/${id}`, config);

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
