import { combineReducers } from '@reduxjs/toolkit';

// Reducers
import authReducer from './AuthRedux/authSlice';

const rootReducer = combineReducers({
    auth: authReducer,
});

export default rootReducer;
