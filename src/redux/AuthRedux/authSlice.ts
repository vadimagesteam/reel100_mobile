import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthState } from './types';
import { forgotPasswordAction, resetPasswordAction, userLoginAction, userRegisterAction, userVerifyAction } from './authAction';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
        clearErrors(state) {
            state.error = null;
        },
        onLogout: (state: any) => {
            AsyncStorage.removeItem('@token'); // deletes token from storage
            state.loading = false;
            state.isAuth = false;
            state.user = null;
            state.error = null;
        },

    },
    extraReducers: builder => {
        builder
            //Register
            .addCase(userRegisterAction.pending, state => {
                state.loading = true;
            })
            .addCase(
                userRegisterAction.fulfilled,
                (state) => {
                    state.loading = false;
                },
            )
            .addCase(
                userRegisterAction.rejected,
                (state, action: PayloadAction<any>) => {
                    state.loading = false;
                    state.error = action.payload;
                },
            )
            //User Verify
            .addCase(userVerifyAction.pending, state => {
                state.loading = true;
            })
            .addCase(
                userVerifyAction.fulfilled,
                (state) => {
                    state.loading = false;
                },
            )
            .addCase(
                userVerifyAction.rejected,
                (state, action: PayloadAction<any>) => {
                    state.loading = false;
                    state.error = action.payload;
                },
            )
            // Login
            .addCase(userLoginAction.pending, state => {
                state.loading = true;
            })
            .addCase(
                userLoginAction.fulfilled,
                (state) => {
                    state.loading = false;
                },
            )
            .addCase(
                userLoginAction.rejected,
                (state, action: PayloadAction<any>) => {
                    state.loading = false;
                    state.error = action.payload;
                },
            )
            // Forgot Password
            .addCase(forgotPasswordAction.pending, state => {
                state.loading = true;
            })
            .addCase(
                forgotPasswordAction.fulfilled,
                (state) => {
                    state.loading = false;
                },
            )
            .addCase(
                forgotPasswordAction.rejected,
                (state, action: PayloadAction<any>) => {
                    state.loading = false;
                    state.error = action.payload;
                },
            )
            // Reset Password
            .addCase(resetPasswordAction.pending, state => {
                state.loading = true;
            })
            .addCase(
                resetPasswordAction.fulfilled,
                (state) => {
                    state.loading = false;
                },
            )
            .addCase(
                resetPasswordAction.rejected,
                (state, action: PayloadAction<any>) => {
                    state.loading = false;
                    state.error = action.payload;
                },
            );
    },


});

export const { setIsAuth, onLogout, clearErrors } = authSlice.actions;

export default authSlice.reducer;
