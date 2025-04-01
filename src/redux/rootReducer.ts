import { combineReducers } from '@reduxjs/toolkit';

// Reducers
import authReducer from './AuthRedux/authSlice';
import statesReducer from './StatesRedux/statesSlice';

const rootReducer = combineReducers({
    auth: authReducer,
    states: statesReducer,
});

export default rootReducer;
