import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UsersState } from './types';
import { getOneUserAction, getUsersAction } from './usersAction';

const initialState: UsersState = {
    loading: false,
    usersData: [],
    userOneData: [],
    error: null,
};

export const usersSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            //get Users
            .addCase(getUsersAction.pending, state => {
                state.loading = true;
            })
            .addCase(
                getUsersAction.fulfilled,
                (state, action: PayloadAction<any>) => {
                    state.loading = false;
                    state.usersData = action?.payload;
                },
            )
            .addCase(
                getUsersAction.rejected,
                (state, action: PayloadAction<any>) => {
                    state.loading = false;
                    state.error = action.payload;
                },
            )
            //get one user
            .addCase(getOneUserAction.pending, state => {
                state.loading = true;
            })
            .addCase(
                getOneUserAction.fulfilled,
                (state, action: PayloadAction<any>) => {
                    state.loading = false;
                    state.userOneData = action?.payload;
                },
            )
            .addCase(
                getOneUserAction.rejected,
                (state, action: PayloadAction<any>) => {
                    state.loading = false;
                    state.error = action.payload;
                },
            );
    },
});

// export const { } = usersSlice.actions;

export default usersSlice.reducer;
