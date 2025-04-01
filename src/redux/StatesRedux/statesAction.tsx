import { createAsyncThunk } from '@reduxjs/toolkit';
import axios, { AxiosError } from 'axios';

export const getStatesAction = createAsyncThunk<any>(
    'states/getStates',
    async (_, thunkAPI) => {
        try {
            const config = {
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
            };
            const response = await axios.get('/api/states', config);

            // console.log('response-->States ->', JSON.stringify(response?.data, null, 2));

            return response?.data;
        } catch (error) {
            // console.log('-getStatesAction-->', error?.response?.data);
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
