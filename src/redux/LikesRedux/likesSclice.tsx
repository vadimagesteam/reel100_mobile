import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { LikeResponseType, LikesState } from './types';
import { getLikesAction } from './likesAction';


const initialState: LikesState = {
    loading: false,
    likesData: [],
    error: null,
};

export const likesSlice = createSlice({
    name: 'likes',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            // get Follows
            .addCase(getLikesAction.pending, state => {
                state.loading = true;
            })
            .addCase(
                getLikesAction.fulfilled,
                (state, action: PayloadAction<LikeResponseType[]>) => {
                    state.loading = false;
                    state.likesData = action?.payload;
                },
            )
            .addCase(
                getLikesAction.rejected,
                (state, action: PayloadAction<any>) => {
                    state.loading = false;
                    state.error = action.payload;
                },
            );

    },
});

// export const { } = likesSlice.actions;

export default likesSlice.reducer;
