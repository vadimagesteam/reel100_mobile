import { createSlice } from '@reduxjs/toolkit';
import { getSecondsLeftInDay } from '../../utils/formatTime';
import { ClockState } from './types';

const initialState: ClockState = {
    time: getSecondsLeftInDay(),
};

const countdownClockSlice = createSlice({
    name: 'countdownClock',
    initialState,
    reducers: {
        tickAction: (state) => {
            state.time = state.time > 0 ? state.time - 1 : 86400;
        },
        resetClock: (state) => {
            state.time = getSecondsLeftInDay();
        },
    },
});

export const { tickAction, resetClock } = countdownClockSlice.actions;
export default countdownClockSlice.reducer;
