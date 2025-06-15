import { createSlice } from "@reduxjs/toolkit/react";
import type { User } from "../components/UserPage";

type State = {
    reloadUserListe: number,
    selectedUser: User | null
};

const initialState: State = {
    reloadUserListe: 0,
    selectedUser: null
};


const userSlicer = createSlice({
    name: "user",
    initialState,
    reducers: {
        reloadUserListe(state) {
            state.reloadUserListe = state.reloadUserListe + 1;
        },
        setSelectedUser(state, action) {
            state.selectedUser = action.payload;
        }
    }
})

export const userReducer = userSlicer.reducer;
export const { reloadUserListe, setSelectedUser } = userSlicer.actions;