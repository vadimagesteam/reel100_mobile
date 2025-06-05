import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FollowsState } from './types';
import { getFollowAction, setFollowAction } from './followsActions';

const initialState: FollowsState = {
    loading: false,
    followData: [],
    error: null,
};

export const followsSlice = createSlice({
    name: 'follows',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            // get Follows
            .addCase(getFollowAction.pending, state => {
                state.loading = true;
            })
            .addCase(
                getFollowAction.fulfilled,
                (state, action: PayloadAction<any>) => {
                    state.loading = false;
                    state.followData = action?.payload;
                },
            )
            .addCase(
                getFollowAction.rejected,
                (state, action: PayloadAction<any>) => {
                    state.loading = false;
                    state.error = action.payload;
                },
            )
            // set Follows
            .addCase(setFollowAction.pending, state => {
                state.loading = true;
            })
            .addCase(
                setFollowAction.fulfilled,
                (state) => {
                    state.loading = false;

                },
            )
            .addCase(
                setFollowAction.rejected,
                (state, action: PayloadAction<any>) => {
                    state.loading = false;
                    state.error = action.payload;
                },
            );

    },
});

// export const { } = followsSlice.actions;

export default followsSlice.reducer;
