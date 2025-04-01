import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getStatesAction } from './statesAction';
import { StatesState } from './types';


const initialState: StatesState = {
    loading: false,
    statesData: [],
    error: null,
};

export const statesSlice = createSlice({
    name: 'states',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            //get States
            .addCase(getStatesAction.pending, state => {
                state.loading = true;
            })
            .addCase(
                getStatesAction.fulfilled,
                (state, action: PayloadAction<any>) => {
                    state.loading = false;
                    state.statesData = action?.payload;
                },
            )
            .addCase(
                getStatesAction.rejected,
                (state, action: PayloadAction<any>) => {
                    state.loading = false;
                    state.error = action.payload;
                },
            );
    },


});

export const { } = statesSlice.actions;

export default statesSlice.reducer;
