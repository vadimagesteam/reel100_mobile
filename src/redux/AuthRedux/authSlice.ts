import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthState } from './types';

const initialState: AuthState = {
    loading: false,
    isAuth: false,
    user: [],
    error: null,
};

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setIsAuth(state, action: PayloadAction<boolean>) {
            state.isAuth = action.payload;
            return state;
        },
        // onLogout: (state: any) => {
        //     AsyncStorage.removeItem('@user'); // deletes token from storage
        //     state.loading = false;
        //     state.isAuth = false;
        //     state.user = null;
        //     state.error = null;
        // },
    },

});

export const { setIsAuth } = authSlice.actions;

export default authSlice.reducer;
