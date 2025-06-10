import { createAsyncThunk } from '@reduxjs/toolkit';
import axios, { AxiosError } from 'axios';
import { setCustomLoading, setPreviewVideoURL } from './cameraSlice';
import { DASHBOARD_ROUTES } from '../../navigation/routes';
import { getMimeType } from '../../utils/getMimeType';
import { GetVideosParams } from './types';
import AsyncStorage from '@react-native-async-storage/async-storage';


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

                const state = await AsyncStorage.getItem('STATE');

                await axios.post(`api/videos/${videoId}/states`, [state]);

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
            const { userId, skip = 0, take, orderBy = {} } = params;

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

export const getVideosTopAction = createAsyncThunk<any, GetVideosParams>(
    'camera/getVideosTop100',
    async (params, thunkAPI) => {
        try {
            const { skip = 0, take, orderBy = {} } = params;

            const queryParams = new URLSearchParams();
            queryParams.append('skip', String(skip));
            queryParams.append('take', String(take));
            Object.entries(orderBy).forEach(([key, value]) => {
                queryParams.append(`orderBy[${key}]`, value);
            });

            const response = await axios.get(`api/videos?${queryParams.toString()}`);

            const cleanedData = (response?.data || []).filter(
                (video: any) => video?.file != null && typeof video.file === 'object' && !!video.file.storagePath
            );

            return cleanedData;
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


export const videoTrackAction = createAsyncThunk<any, any>(
    'camera/videoTrack',
    async (videoId, thunkAPI) => {
        try {
            const response = await axios.patch(`api/videos/${videoId}/file`);

            console.log('uploadVideoAction--->', JSON.stringify(response, null, 2));

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
