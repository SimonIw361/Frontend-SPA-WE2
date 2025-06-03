import { AUTHENTICATION_ERROR, AUTHENTICATION_PENDING, AUTHENTICATION_SUCCESS, HIDE_LOGIN_DIALOG, LOGOUT, SHOW_LOGIN_DIALOG } from "./AuthenticationAction";

const initialState = {
    user: null,
    loginPending: false,
    showLoginDialog: false,
    error: null
};

export function authenticationReducer(state = initialState, action: {type: string, user?: string, accessToken?: string, error?: string} ) {
    console.log("Authentication Reducer: " + action.type)

    switch (action.type) {
        case SHOW_LOGIN_DIALOG:
            return { ...state, showLoginDialog: true, error: null };
        case HIDE_LOGIN_DIALOG:
            return { ...state, showLoginDialog: false, error: null };
        case AUTHENTICATION_SUCCESS:
            return { ...state, showLoginDialog: false, loginPending: false, user: action.user, accessToken: action.accessToken, error: null };
        case AUTHENTICATION_ERROR:
            console.log(action.error)
            return { ...state, loginPending: false, error: "Authentication failed" };
        case AUTHENTICATION_PENDING:
            return { ...state, loginPending: true, error: null };
        case LOGOUT:
            return { ...state, user: null, accessToken: null, error: null };
        default:
            return state;
    }
};