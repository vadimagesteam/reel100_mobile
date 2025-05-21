import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { VideoState } from './types';
import { createVideoCommentAction, getOneVideoAction, getVideoCommentsAction, getVideoCommentsTwoAction } from './videoAction';


const initialState: VideoState = {
    loading: false,
    videoComments: [],
    oneVideoData: [],
    countComments: null,
    error: null,
};

export const videoSlice = createSlice({
    name: 'video',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            //get one video
            .addCase(getOneVideoAction.pending, state => {
                state.loading = true;
            })
            .addCase(
                getOneVideoAction.fulfilled,
                (state, action: PayloadAction<any>) => {
                    state.loading = false;
                    state.oneVideoData = action?.payload;
                },
            )
            .addCase(
                getOneVideoAction.rejected,
                (state, action: PayloadAction<any>) => {
                    state.loading = false;
                    state.error = action.payload;
                },
            )
            //get video comments all
            .addCase(getVideoCommentsAction.pending, state => {
                state.loading = true;
            })
            .addCase(
                getVideoCommentsAction.fulfilled,
                (state, action: PayloadAction<any>) => {
                    state.loading = false;
                    state.videoComments = action?.payload;
                    state.countComments = action?.payload?.length;
                },
            )
            .addCase(
                getVideoCommentsAction.rejected,
                (state, action: PayloadAction<any>) => {
                    state.loading = false;
                    state.error = action.payload;
                },
            )
            //get video comments all two
            .addCase(getVideoCommentsTwoAction.pending, state => {
                state.loading = false;
            })
            .addCase(
                getVideoCommentsTwoAction.fulfilled,
                (state, action: PayloadAction<any>) => {
                    state.loading = false;
                    state.videoComments = action?.payload;
                    state.countComments = action?.payload?.length;
                },
            )
            .addCase(
                getVideoCommentsTwoAction.rejected,
                (state, action: PayloadAction<any>) => {
                    state.loading = false;
                    state.error = action.payload;
                },
            )
            // Create Comment
            .addCase(createVideoCommentAction.pending, state => {
                state.loading = true;
            })
            .addCase(
                createVideoCommentAction.fulfilled,
                (state) => {
                    state.loading = false;
                },
            )
            .addCase(
                createVideoCommentAction.rejected,
                (state, action: PayloadAction<any>) => {
                    state.loading = false;
                    state.error = action.payload;
                },
            );
    },
});

// export const { } = videoSlice.actions;

export default videoSlice.reducer;
