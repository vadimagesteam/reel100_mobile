import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CameraState, VideoItemType } from './types';
import { createVideoAction, getVideosAction, getVideosTopAction } from './cameraActions';

const initialState: CameraState = {
    loading: false,
    customLoading: false,
    videos: [],
    videosTop100: [],
    userVideos: [],
    videosMeData: [],
    prewievVideoUrl: '',

    loadingTopTab: false,
    page: 1,
    hasMore: true,
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

        resetVideos(state) {
            state.videos = [];
            state.page = 1;
            state.hasMore = true;
        },
        appendVideos(state, action: PayloadAction<VideoItemType[]>) {
            state.videos.push(...action.payload);
        },
        setPage(state, action: PayloadAction<number>) {
            state.page = action.payload;
        },
        setHasMore(state, action: PayloadAction<boolean>) {
            state.hasMore = action.payload;
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
            //Get Top100 videos
            .addCase(getVideosTopAction.pending, (state) => {
                state.loadingTopTab = true;
            })
            .addCase(getVideosTopAction.fulfilled, (state, action: PayloadAction<VideoItemType[]>) => {
                state.loadingTopTab = false;
                const PAGE_SIZE = 5;
                const newVideos = action.payload || [];
                if (state.page === 1) {
                    state.videosTop100 = newVideos;
                } else {
                    state.videosTop100 = [...state.videosTop100, ...newVideos];
                }
                state.hasMore = newVideos.length === PAGE_SIZE;
                state.page += 1;
            })
            .addCase(getVideosTopAction.rejected, (state) => {
                state.loadingTopTab = false;
            });
    },


});

export const { setCustomLoading, setPreviewVideoURL, clearVideos, resetVideos, appendVideos, setPage, setHasMore } = cameraSlice.actions;
export default cameraSlice.reducer;
