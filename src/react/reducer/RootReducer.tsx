import { AUTHENTICATION_ERROR, AUTHENTICATION_PENDING, AUTHENTICATION_SUCCESS, HIDE_LOGIN_DIALOG, SHOW_LOGIN_DIALOG } from "../actions/AuthenticationAction";

const initialState = {
    user: null,
    loginPending: false,
    showLoginDialog: false
};

export function rootReducer(state = initialState, action: any) {
    console.log("Reducer: " + action.type)

    switch (action.type) {
        case SHOW_LOGIN_DIALOG:
            //console.log({...state, showLoginDialog: true, error: null})
            return { ...state, showLoginDialog: true, error: null };
        case HIDE_LOGIN_DIALOG:
            //console.log({...state, showLoginDialog: false, error: null})
            return { ...state, showLoginDialog: false, error: null };
        case AUTHENTICATION_SUCCESS:
            return { ...state, showLoginDialog: false, pending: false, user: action.user, accessToken: action.accessToken };
        case AUTHENTICATION_ERROR:
            return { ...state, pending: false, error: "Authentication failed"};
        case AUTHENTICATION_PENDING:
            return { ...state, pending: true, error: null };
        default:
            return state;
    }

};
