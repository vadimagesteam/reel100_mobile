import { createAsyncThunk } from '@reduxjs/toolkit';
import axios, { AxiosError } from 'axios';
import { setCustomLoading, setPreviewVideoURL } from './cameraSlice';
import { DASHBOARD_ROUTES } from '../../navigation/routes';
import { getMimeType } from '../../utils/getMimeType';


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

export const getVideosAction = createAsyncThunk<any, void>(
    'camera/getVideos',
    async (_, thunkAPI) => {
        try {
            const response = await axios.get('api/videos');

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

export const getUserVideosAction = createAsyncThunk<any, string>(
    'camera/getUserVideos',
    async (userId, thunkAPI) => {
        try {
            const response = await axios.get(`api/videos?where[user][id]=${userId}`);

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

export const getVideosMeAction = createAsyncThunk<any, string>(
    'camera/getVideosMe',
    async (userId, thunkAPI) => {
        try {
            const response = await axios.get(`api/videos?where[user][id]=${userId}`);
            // &take=${take}&skip=${skip}&orderBy[createdAt]=desc

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
