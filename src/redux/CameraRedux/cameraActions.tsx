import { createAsyncThunk } from '@reduxjs/toolkit';
import axios, { AxiosError } from 'axios';
import { setCustomLoading, setPreviewVideoURL } from './cameraSlice';
import { DASHBOARD_ROUTES } from '../../navigation/routes';
import { getMimeType } from '../../utils/getMimeType';
import { GetVideosParams } from './types';
import { api } from '../../lib/api.ts';

/** Utility to consistently extract error messages from Axios or unknown sources */
const extractAxiosError = (error: unknown) => {
  if (axios.isAxiosError(error) && error.response?.data) {
    return error.response.data;
  }
  return { message: 'Unexpected error', error };
};

/** Create a new video (metadata), then upload the actual file */
export const createVideoAction = createAsyncThunk<any, any>(
  'camera/createVideo',
  async (dataCreateVideo, thunkAPI) => {
    const { createVideo, file, navigation } = dataCreateVideo;
    thunkAPI.dispatch(setCustomLoading(true));
    try {
      // Step 1: Create the video record (metadata only)
      const response = await api.post('api/videos', createVideo);

      if (response?.status === 201 && response.data?.id) {
        const videoId = response.data.id;

        // Step 2: Prepare file upload
        if (!file) throw new Error('No video file specified.');
        const { type, name } = getMimeType(file);

        // Ensure file URI is always in the correct format
        const fileUri = file.startsWith('file://') ? file : `file://${file}`;

        const formData = new FormData();
        formData.append('file', {
          uri: fileUri,
          type,
          name,
        } as any); // as any required by RN FormData type

        // Step 3: Dispatch file upload action and unwrap for error catching
        await thunkAPI.dispatch(
          uploadVideoAction({ videoId, formData, navigation })
        ).unwrap();
      }

      return response?.data;
    } catch (error) {
      console.error('createVideoAction error:', error);
      return thunkAPI.rejectWithValue(extractAxiosError(error));
    } finally {
      thunkAPI.dispatch(setCustomLoading(false));
    }
  },
);

/** Upload the actual video file to the backend */
export const uploadVideoAction = createAsyncThunk<any, any>(
  'camera/uploadVideo',
  async (payload, thunkAPI) => {
    const { videoId, formData, navigation } = payload;
    thunkAPI.dispatch(setCustomLoading(true));
    try {
      if (!videoId || !formData) throw new Error('Invalid upload parameters.');

      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      };

      // Defensive: Ensure FormData contains a file part
      if (
        !(formData as any)._parts?.some?.(
          (part: any[]) => part[0] === 'file' && part[1]?.uri
        )
      ) {
        throw new Error('FormData missing video file.');
      }

      const response = await api.put(
        `api/videos/${videoId}/file`,
        formData,
        config,
      );

      if (response?.status === 200) {
        thunkAPI.dispatch(setPreviewVideoURL(''));
        thunkAPI.dispatch(getVideosAction({ take: 10, skip: 0, orderBy: {} }));
        // Wait 100ms before navigating to avoid race condition on slow devices
        setTimeout(() => {
          if (navigation?.reset) {
            navigation.reset({
              index: 0,
              routes: [{ name: DASHBOARD_ROUTES.PROFILE_SCREEN }],
            });
          }
        }, 100);
      }

      return response?.data;
    } catch (error) {
      console.error('uploadVideoAction error:', error);
      return thunkAPI.rejectWithValue(extractAxiosError(error));
    } finally {
      thunkAPI.dispatch(setCustomLoading(false));
    }
  },
);

/** Get a paginated list of videos, optionally by user */
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

      const response = await api.get(`api/videos?${queryParams.toString()}`);
      console.log('VIDEOS RESPONSE', response.data);

      return response?.data;
    } catch (error) {
      console.error('getVideosAction error:', error);
      return thunkAPI.rejectWithValue(extractAxiosError(error));
    }
  },
);

/** Get the top videos, only including those with a valid storagePath */
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

      const response = await api.get(`api/videos?${queryParams.toString()}`);

      console.log('Video response: ', response?.data);

      // Only return videos with a valid file storagePath (defensive for backend data)
      const cleanedData = (response?.data || []).filter(
        (video: any) =>
          video?.file &&
          typeof video.file === 'object' &&
          !!video.file.hlsUrl,
      );

      return cleanedData;
    } catch (error) {
      console.error('getVideosTopAction error:', error);
      return thunkAPI.rejectWithValue(extractAxiosError(error));
    }
  },
);

/** Mark video as tracked/watched (etc) */
export const videoTrackAction = createAsyncThunk<any, any>(
  'camera/videoTrack',
  async (videoId, thunkAPI) => {
    try {
      const response = await api.patch(`api/videos/${videoId}/file`);
      return response?.data;
    } catch (error) {
      console.error('videoTrackAction error:', error);
      return thunkAPI.rejectWithValue(extractAxiosError(error));
    }
  },
);