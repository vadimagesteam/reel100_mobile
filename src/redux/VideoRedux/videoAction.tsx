import { createAsyncThunk } from '@reduxjs/toolkit';
import axios, { AxiosError } from 'axios';

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
            const response = await axios.post('/api/comments', commentData, config);

            if (response?.status === 201) {
                const videoId = commentData?.video?.id;
                thunkAPI.dispatch(getVideoCommentsAction(videoId));
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
