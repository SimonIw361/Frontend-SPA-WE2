import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";
import { AUTH_URL } from "../../../config/config";

// verwendete Quellen: Folien und Videos von den Vorlesungen
// Quelle zu createSlice https://redux-toolkit.js.org/api/createSlice
// Quelle zu createAsyncThunk https://redux-toolkit.js.org/api/createAsyncThunk
// Quelle zu ?? https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Nullish_coalescing
// Quelle zu btoa: https://developer.mozilla.org/en-US/docs/Web/API/Window/btoa
// Quelle zu Typdefinition: https://www.typescriptlang.org/docs/handbook/2/objects.html
// jwt Decode (Payload aus Token bestimmen): https://www.npmjs.com/package/jwt-decode

type State = {
    user: { userID: string | null, isAdministrator: boolean },
    loginPending: boolean,
    showLoginDialogBool: boolean,
    accessToken: string | null,
    error: string | null
};

const initialState: State = {
    user: { userID: null, isAdministrator: false },
    loginPending: false,
    showLoginDialogBool: false,
    accessToken: null,
    error: null
};

export const login = createAsyncThunk("user/login", async (user: { userID: String, password: String }) => {
    const requestOptions = {
        method: 'GET',
        headers: { "Authorization": "Basic " + btoa(user.userID + ":" + user.password) }
    }

    let response = await fetch(AUTH_URL, requestOptions);
    const authorizationHeader = response.headers.get('Authorization');

    let text = await response.text();
    let data; //hat leider Typ any, weil JSON.parse any zurueckgibt
    if (text) {
        data = JSON.parse(text);
    }
    else {
        data = text;
    }

    let token: string | null = null;
    if (authorizationHeader) {
        token = authorizationHeader.split(" ")[1];
    }

    if (!response.ok || token === null) {
        let err: string;
        if (data.Error !== undefined) { //wenn es Error Meldung gibt, wird diese zurueckgegeben
            err = data.Error;
        }
        else {
            err = response.statusText;
        }
        return Promise.reject(err); //reject Promise ausgeloest
    }
    else {
        let userInfo = jwtDecode<{ userID: string, isAdministrator: boolean }>(token);
        let userSession = {
            user: userInfo,
            accessToken: token
        }
        return userSession;
    }
})

const authenticationSlicer = createSlice({
    name: "authentication",
    initialState,
    reducers: {
        logout(state) {
            state.user = { userID: null, isAdministrator: false };
            state.accessToken = null;
            state.error = null;
        },
        showLoginDialog(state) {
            state.showLoginDialogBool = true;
            state.error = null;
        },
        hideLoginDialog(state) {
            state.showLoginDialogBool = false;
            state.error = null;
        }

    },
    extraReducers: (builder) => {
        builder.addCase(login.pending, (state) => {
            state.showLoginDialogBool = true;
            state.loginPending = true;
            state.accessToken = null;
            state.error = null;
        })
        builder.addCase(login.fulfilled, (state, action) => {
            state.showLoginDialogBool = false;
            state.loginPending = false;
            state.user = action.payload.user;
            state.accessToken = action.payload.accessToken;
            state.error = null;

        })
        builder.addCase(login.rejected, (state, action) => {
            state.showLoginDialogBool = true;
            state.loginPending = false;
            state.user = { userID: null, isAdministrator: false };
            state.accessToken = null;
            state.error = action.error.message ?? "Authentication failed";
            console.log(state.error);
        })
    }
})

export const authenticationReducer = authenticationSlicer.reducer;
export const { logout, showLoginDialog, hideLoginDialog } = authenticationSlicer.actions;