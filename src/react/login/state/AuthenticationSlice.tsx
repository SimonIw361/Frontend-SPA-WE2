import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// verwendete Quellen: Folien und Videos von den Vorlesungen
// Quelle zum Erstellen von Slice https://redux-toolkit.js.org/api/createSlice
// Quelle zu createAsyncThunk https://redux-toolkit.js.org/api/createAsyncThunk
// Quelle zu ?? https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Nullish_coalescing

//login in andere Datei machen??

const initialState = {
    user: null,
    loginPending: false,
    showLoginDialogBool: false,
    accessToken: "",
    error: "" //TODO schlechter fix mit ""
};

export const login = createAsyncThunk("user/login", async (user: any) => { //TODO user richtig typisieren
    const requestOptions = {
        method: 'GET',
        headers: { "Authorization": "Basic " + btoa(user.userID + ":" + user.password) }, //TODO: Base64 coding noch machen
    }

    let response = await fetch('https://localhost:443/api/authenticate', requestOptions);
    const authorizationHeader = response.headers.get('Authorization');

    let text = await response.text();
    let data; //hat leider Typ any
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
        if (response.status === 401) {
            //logout();
        }

        let err: string;
        if (data.Error !== undefined) { //wenn es Error Meldung gibt, wird diese zurueckgegeben
            err = data.Error;
        }
        else {
            err = response.statusText;
        }
        return Promise.reject(err); //reject Promise ausgeloest, wird im catch in authenticateUser gefangen
    }
    else {
        let userSession = {
            user: data,
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
            state.user = null;
            state.accessToken = "";
            state.error = "";
        },
        showLoginDialog(state) {
            state.showLoginDialogBool = true;
            state.error = ""
        },
        hideLoginDialog(state) {
            state.showLoginDialogBool = false;
            state.error = ""
        }

    },
    extraReducers: (builder) => {
        builder.addCase(login.pending, (state) => {
            state.showLoginDialogBool = true;
            state.loginPending = true;
            state.accessToken = "";
            state.error = "";
        })
        builder.addCase(login.fulfilled, (state, action) => {
            state.showLoginDialogBool = false;
            state.loginPending = false;
            state.user = action.payload.user;
            state.accessToken = action.payload.accessToken;
            state.error = "";
        })
        builder.addCase(login.rejected, (state, action) => {
            state.showLoginDialogBool = true;
            state.loginPending = false;
            state.user = null;
            state.accessToken = "";
            state.error = action.error.message ?? "Authentication failed";
        })
    }
})

export const authenticationReducer = authenticationSlicer.reducer;
export const { logout, showLoginDialog, hideLoginDialog } = authenticationSlicer.actions;