import { combineReducers } from '@reduxjs/toolkit';

// Reducers
import authReducer from './AuthRedux/authSlice';
import statesReducer from './StatesRedux/statesSlice';
import countdownClockReducer from './CoutdownClockRedux/countdownClockSlice';

const rootReducer = combineReducers({
    auth: authReducer,
    states: statesReducer,
    countdownClock: countdownClockReducer,
});

export default rootReducer;
