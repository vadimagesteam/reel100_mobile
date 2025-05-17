import { createAsyncThunk } from '@reduxjs/toolkit';
import axios, { AxiosError } from 'axios';

export const getVideoCommentsAction = createAsyncThunk<any, string>(
    'video/getVideoComments',
    async (videoId, thunkAPI) => {
        try {
            const config = {
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
            };
            const response = await axios.get(`/api/videos/${videoId}/comments`, config);


            console.log('getVideoCommentsAction --->', response);

            return response?.data;
        } catch (error) {
            console.log('getVideoCommentsAction --->', error);
            if (error instanceof AxiosError) {
                if (error.response && error.response.data) {
                    return thunkAPI.rejectWithValue(error.response.data);
                } else {
                }
            }
        }
    },
);

export const createVideoCommentAction = createAsyncThunk<any, any>(
    'video/createVideoComment',
    async ({ videoId, bodyComment }, thunkAPI) => {

        console.log('bodyComment', bodyComment);
        try {
            const config = {
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
            };
            const response = await axios.post(`/api/videos/${videoId}/comments`, bodyComment, config);


            console.log('createVideoCommentAction --->', response);

            return response?.data;
        } catch (error) {
            console.log('createVideoCommentAction --->', error);
            if (error instanceof AxiosError) {
                if (error.response && error.response.data) {
                    return thunkAPI.rejectWithValue(error.response.data);
                } else {
                }
            }
        }
    },
);
