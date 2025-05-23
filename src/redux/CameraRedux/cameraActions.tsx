import { createAsyncThunk } from '@reduxjs/toolkit';
import axios, { AxiosError } from 'axios';
import { setCustomLoading, setPreviewVideoURL } from './cameraSlice';
import { DASHBOARD_ROUTES } from '../../navigation/routes';
import { getMimeType } from '../../utils/getMimeType';
import { GetVideosParams } from './types';


export const createVideoAction = createAsyncThunk<any, any>(
    'camera/createVideo',
    async (dataCreateVideo, thunkAPI) => {
        const { createVideo, file, navigation } = dataCreateVideo;
        thunkAPI.dispatch(setCustomLoading(true));
        try {
            const response = await axios.post('api/videos', createVideo);

            // console.log('response--->', JSON.stringify(response, null, 2));

            if (response?.status === 201) {
                const videoId = response.data.id;

                const formData = new FormData();
                const { type, name } = getMimeType(file);
                formData.append('file', {
                    uri: file.startsWith('file://') ? file : `file://${file}`,
                    type,
                    name,
                });


                await thunkAPI.dispatch(
                    uploadVideoAction({ videoId, formData, navigation })
                );
            }

            return response?.data;
        } catch (error) {
            if (error instanceof AxiosError) {
                if (error.response && error.response.data) {
                    return thunkAPI.rejectWithValue(error.response.data);
                } else {
                }
            }
        } finally {
            thunkAPI.dispatch(setCustomLoading(false));
        }
    },
);

export const uploadVideoAction = createAsyncThunk<any, any>(
    'camera/uploadVideo',
    async (payload, thunkAPI) => {
        const { videoId, formData, navigation } = payload;
        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            };
            const response = await axios.put(`api/videos/${videoId}/file`, formData, config);

            console.log('uploadVideoAction--->', JSON.stringify(response, null, 2));

            if (response?.status === 200) {
                thunkAPI.dispatch(setCustomLoading(false));
                thunkAPI.dispatch(setPreviewVideoURL(''));
                thunkAPI.dispatch(getVideosAction());
                setTimeout(() => {
                    navigation.reset({
                        index: 0,
                        routes: [{ name: DASHBOARD_ROUTES.PROFILE_SCREEN }],
                    });
                }, 100);
            }

            return response?.data;
        } catch (error) {
            if (error instanceof AxiosError) {
                if (error.response && error.response.data) {
                    return thunkAPI.rejectWithValue(error.response.data);
                } else {
                }
            }
        } finally {
            thunkAPI.dispatch(setCustomLoading(false));
        }
    },
);

export const getVideosAction = createAsyncThunk<any, GetVideosParams>(
    'camera/getVideos',
    async (params, thunkAPI) => {
        try {
            const { userId, skip = 0, take = 15, orderBy = {} } = params;

            const queryParams = new URLSearchParams();
            queryParams.append('skip', String(skip));
            queryParams.append('take', String(take));
            Object.entries(orderBy).forEach(([key, value]) => {
                queryParams.append(`orderBy[${key}]`, value);
            });

            if (userId) {
                queryParams.append('where[user][id]', userId);
            }

            const response = await axios.get(`api/videos?${queryParams.toString()}`);

            // console.log('getVideosAction--->', JSON.stringify(response?.data, null, 2));
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

// export const getUserVideosAction = createAsyncThunk<any, GetVideosParams>(
//     'camera/getUserVideos',
//     async (params, thunkAPI) => {
//         try {
//             const { userId, skip = 0, take = 15, orderBy = {}, where = {} } = params;

//             const fullWhere = { ...where, user: { id: userId } };

//             const queryParams = new URLSearchParams();

//             queryParams.append('skip', String(skip));
//             queryParams.append('take', String(take));

//             Object.entries(orderBy).forEach(([key, value]) => {
//                 queryParams.append(`orderBy[${key}]`, value);
//             });

//             Object.entries(fullWhere).forEach(([key, value]) => {
//                 if (typeof value === 'object' && value !== null) {
//                     Object.entries(value).forEach(([subKey, subVal]) => {
//                         queryParams.append(`where[${key}][${subKey}]`, String(subVal));
//                     });
//                 } else {
//                     queryParams.append(`where[${key}]`, String(value));
//                 }
//             });
//             const response = await axios.get(`api/videos?${queryParams.toString()}`);

//             return response?.data;
//         } catch (error) {
//             if (error instanceof AxiosError) {
//                 if (error.response && error.response.data) {
//                     return thunkAPI.rejectWithValue(error.response.data);
//                 } else {
//                 }
//             }
//         }
//     },
// );

// export const getVideosMeAction = createAsyncThunk<any, GetVideosParams>(
//     'camera/getVideosMe',
//     async (params, thunkAPI) => {
//         try {
//             const { userId, skip = 0, take = 15, orderBy = {}, where = {} } = params;

//             const fullWhere = { ...where, user: { id: userId } };

//             const queryParams = new URLSearchParams();

//             queryParams.append('skip', String(skip));
//             queryParams.append('take', String(take));

//             Object.entries(orderBy).forEach(([key, value]) => {
//                 queryParams.append(`orderBy[${key}]`, value);
//             });

//             Object.entries(fullWhere).forEach(([key, value]) => {
//                 if (typeof value === 'object' && value !== null) {
//                     Object.entries(value).forEach(([subKey, subVal]) => {
//                         queryParams.append(`where[${key}][${subKey}]`, String(subVal));
//                     });
//                 } else {
//                     queryParams.append(`where[${key}]`, String(value));
//                 }
//             });

//             const response = await axios.get(`api/videos?${queryParams.toString()}`);

//             return response?.data;
//         } catch (error) {
//             if (error instanceof AxiosError) {
//                 if (error.response && error.response.data) {
//                     return thunkAPI.rejectWithValue(error.response.data);
//                 } else {
//                 }
//             }
//         }
//     },
// );
