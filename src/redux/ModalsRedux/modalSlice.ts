import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ModalsState } from './types';

const initialState: ModalsState = {
    loading: false,
    modalVideoVisible: false,
    modalMenuVisible: false,
};

export const modalsSlice = createSlice({
    name: 'modals',
    initialState,
    reducers: {
        setVideoModal(state, action: PayloadAction<boolean>) {
            state.modalVideoVisible = action.payload;
        },
        setMenuModal(state, action: PayloadAction<boolean>) {
            state.modalMenuVisible = action.payload;
        },
    },
});

export const { setVideoModal, setMenuModal } = modalsSlice.actions;

export default modalsSlice.reducer;
