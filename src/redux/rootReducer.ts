import { combineReducers } from '@reduxjs/toolkit';

// Reducers
import authReducer from './AuthRedux/authSlice';
import statesReducer from './StatesRedux/statesSlice';
import countdownClockReducer from './CoutdownClockRedux/countdownClockSlice';
import cameraReducer from './CameraRedux/cameraSlice';
import usersReducer from './UsersRedux/usersSlice';
import followsReducer from './FollowsRedux/followsSlice';
import videoReducer from './VideoRedux/videoSlice';
import modalsReducer from './ModalsRedux/modalSlice';
import likesReducer from './LikesRedux/likesSclice';

const rootReducer = combineReducers({
    auth: authReducer,
    states: statesReducer,
    countdownClock: countdownClockReducer,
    camera: cameraReducer,
    users: usersReducer,
    follows: followsReducer,
    video: videoReducer,
    modals: modalsReducer,
    likes: likesReducer,
});

export default rootReducer;
