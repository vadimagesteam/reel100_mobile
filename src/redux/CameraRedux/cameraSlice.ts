import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CameraState } from './types';
import { createVideoAction, getUserVideosAction, getVideosAction, getVideosMeAction } from './cameraActions';

const initialState: CameraState = {
    loading: false,
    customLoading: false,
    videos: [],
    userVideos: [],
    videosMeData: [],
    prewievVideoUrl: '',
    error: null,
};

const cameraSlice = createSlice({
    name: 'camera',
    initialState,
    reducers: {
        setCustomLoading(state, action: PayloadAction<boolean>) {
            state.customLoading = action.payload;
            return state;
        },
        setPreviewVideoURL(state, action: PayloadAction<string>) {
            state.prewievVideoUrl = action.payload;
            return state;
        },
    },
    extraReducers: builder => {
        builder
            //createVideo and upload
            .addCase(createVideoAction.pending, state => {
                state.loading = true;
            })
            .addCase(
                createVideoAction.fulfilled,
                (state) => {
                    state.loading = false;
                },
            )
            .addCase(
                createVideoAction.rejected,
                (state, action: PayloadAction<any>) => {
                    state.loading = false;
                    state.error = action.payload;
                },
            )
            //Get vidios
            .addCase(getVideosAction.pending, state => {
                state.loading = true;
            })
            .addCase(
                getVideosAction.fulfilled,
                (state, action: PayloadAction<any>) => {
                    state.loading = false;
                    state.videos = action.payload;
                },
            )
            .addCase(
                getVideosAction.rejected,
                (state, action: PayloadAction<any>) => {
                    state.loading = false;
                    state.error = action.payload;
                },
            )
            //Get vidios
            .addCase(getUserVideosAction.pending, state => {
                state.loading = true;
            })
            .addCase(
                getUserVideosAction.fulfilled,
                (state, action: PayloadAction<any>) => {
                    state.loading = false;
                    state.userVideos = action.payload;
                },
            )
            .addCase(
                getUserVideosAction.rejected,
                (state, action: PayloadAction<any>) => {
                    state.loading = false;
                    state.error = action.payload;
                },
            )
            //Get vidios me
            .addCase(getVideosMeAction.pending, state => {
                state.loading = true;
            })
            .addCase(
                getVideosMeAction.fulfilled,
                (state, action: PayloadAction<any>) => {
                    state.loading = false;
                    state.videosMeData = action.payload;
                },
            )
            .addCase(
                getVideosMeAction.rejected,
                (state, action: PayloadAction<any>) => {
                    state.loading = false;
                    state.error = action.payload;
                },
            );
    },


});

export const { setCustomLoading, setPreviewVideoURL } = cameraSlice.actions;
export default cameraSlice.reducer;
