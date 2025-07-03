import { createSlice } from "@reduxjs/toolkit/react";
import type { User } from "../UserPage";

type State = {
    selectedUser: User | null,
    showUserEditAlertSuccessBool: boolean
};

const initialState: State = {
    selectedUser: null,
    showUserEditAlertSuccessBool: false
};

const userSlicer = createSlice({
    name: "user",
    initialState,
    reducers: {
        setSelectedUser(state, action) {
            state.selectedUser = action.payload;
        },
        showUserEditAlertSuccess(state) {
            state.showUserEditAlertSuccessBool = true;
        },
        hideUserEditAlertSuccess(state) {
            state.showUserEditAlertSuccessBool = false;
        }
    }
})

export const userReducer = userSlicer.reducer;
export const { setSelectedUser, showUserEditAlertSuccess, hideUserEditAlertSuccess } = userSlicer.actions;