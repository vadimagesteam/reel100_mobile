import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CameraState, VideoItemType } from './types';
import { createVideoAction, getVideosAction } from './cameraActions';

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
        clearVideos(state) {
            state.videosMeData = [];
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
            //Get videos
            .addCase(getVideosAction.pending, state => {
                state.loading = true;
            })
            .addCase(
                getVideosAction.fulfilled,
                (state, action: PayloadAction<VideoItemType[]>) => {
                    state.loading = false;
                    const userId = action.meta.arg.userId;

                    if (userId === state.authUserId) {
                        state.videosMeData = action.payload;
                    } else {
                        state.userVideos = action.payload;
                    }
                },
            )
            .addCase(
                getVideosAction.rejected,
                (state, action: PayloadAction<any>) => {
                    state.loading = false;
                    state.error = action.payload;
                },
            );
    },


});

export const { setCustomLoading, setPreviewVideoURL, clearVideos } = cameraSlice.actions;
export default cameraSlice.reducer;
