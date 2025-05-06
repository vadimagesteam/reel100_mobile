import { combineReducers } from '@reduxjs/toolkit';

// Reducers
import authReducer from './AuthRedux/authSlice';
import statesReducer from './StatesRedux/statesSlice';
import countdownClockReducer from './CoutdownClockRedux/countdownClockSlice';
import cameraReducer from './CameraRedux/cameraSlice';

const rootReducer = combineReducers({
    auth: authReducer,
    states: statesReducer,
    countdownClock: countdownClockReducer,
    camera: cameraReducer,
});

export default rootReducer;
