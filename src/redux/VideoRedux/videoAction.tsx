import { createAsyncThunk } from '@reduxjs/toolkit';
import axios, { AxiosError } from 'axios';
import { api } from '../../lib/api.ts';

// export const getVideoCommentsAction = createAsyncThunk<any, string>(
//     'video/getVideoComments',
//     async ({ videoId, skip, take }, thunkAPI) => {
//         try {
//             const config = {
//                 headers: {
//                     Accept: 'application/json',
//                     'Content-Type': 'application/json',
//                 },
//                 params: { skip, take },
//             };
//             const response = await axios.get(`/api/videos/${videoId}/comments`, config);


//             console.log('getVideoCommentsAction --->', response);

//             return response?.data;
//         } catch (error) {
//             console.log('getVideoCommentsAction --->', error);
//             if (error instanceof AxiosError) {
//                 if (error.response && error.response.data) {
//                     return thunkAPI.rejectWithValue(error.response.data);
//                 } else {
//                 }
//             }
//         }
//     },
// );

export const getOneVideoAction = createAsyncThunk<any, string>(
    'video/getOneVideo',
    async (videoId, thunkAPI) => {
        try {
            const response = await api.get(`/api/videos/${videoId}`);
            console.log('getOneVideoAction --->', response);

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

export const getVideoCommentsAction = createAsyncThunk<any, { videoId: string, userId: string | undefined }>(
    'video/getVideoComments',
    async ({ videoId, userId }, thunkAPI) => {
        try {
            const config = {
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
            };
            const response = await api.get(`/api/videos/${videoId}/comments?where[user][id]=${userId}`, config);
            console.log('->> Comments', response?.data);
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
    async (dataComment, thunkAPI) => {
        const { setNewComment, setReplyToCommentId,
            setReplyingToUser, commentData } = dataComment;
        try {
            const config = {
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
            };
            const response = await api.post('/api/comments', commentData, config);

            if (response?.status === 201) {
                const videoId = commentData?.video?.id;
                thunkAPI.dispatch(getVideoCommentsAction({ videoId, userId: commentData?.user?.id }));
                setNewComment('');
                setReplyToCommentId(null);
                setReplyingToUser(null);
            }
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
