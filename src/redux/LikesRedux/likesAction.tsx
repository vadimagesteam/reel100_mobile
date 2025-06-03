import { createAsyncThunk } from '@reduxjs/toolkit';
import axios, { AxiosError } from 'axios';
import { LikeResponseType, LikeBodyType, DeleteLikeParams, GetLikesParams } from './types';
import { getUserInfoAction } from '../AuthRedux/authAction';
import { getOneUserAction } from '../UsersRedux/usersAction';


export const setLikeAction = createAsyncThunk<LikeResponseType, LikeBodyType>(
    'likes/setLike',
    async (likesBodyData, thunkAPI) => {
        const { dataLike, userId } = likesBodyData;
        try {
            const response = await axios.post('/api/reactions', dataLike);

            if (response?.status === 201) {
                thunkAPI.dispatch(getLikesAction({ userId: userId, videoId: dataLike?.video?.id }));
                thunkAPI.dispatch(getUserInfoAction());
                thunkAPI.dispatch(getOneUserAction(userId));
            }
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

export const getLikesAction = createAsyncThunk<LikeResponseType[], GetLikesParams>(
    'likes/getLikes',
    async ({ userId, videoId }, thunkAPI) => {
        try {
            const config = {
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
            };
            const response = await axios.get(`/api/reactions?where[typeField]=Like&where[video][id]=${videoId}`, config);
            // console.log('response --Likes-->', response);
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

export const deleteLikeAction = createAsyncThunk<LikeResponseType, DeleteLikeParams>(
    'likes/setLike',
    async ({ id, userId, videoId }, thunkAPI) => {
        try {
            const response = await axios.delete(`/api/reactions/${id}`);

            if (response?.status === 200) {
                thunkAPI.dispatch(getLikesAction({ userId: userId, videoId: videoId }));
                thunkAPI.dispatch(getUserInfoAction());
                thunkAPI.dispatch(getOneUserAction(userId));
            }
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
