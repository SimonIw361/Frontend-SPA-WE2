import type { Dispatch } from "redux";

export const SHOW_LOGIN_DIALOG = "SHOW_LOGIN_DIALOG";
export const HIDE_LOGIN_DIALOG = "HIDE_LOGIN_DIALOG"

export const AUTHENTICATION_PENDING = "AUTHENTICATION_PENDING";
export const AUTHENTICATION_SUCCESS = "AUTHENTICATION_SUCCESS";
export const AUTHENTICATION_ERROR = "AUTHENTICATION_ERROR";
export const LOGOUT = "LOGOUT";

export function getShowLoginDialogAction() {
    return {
        type: SHOW_LOGIN_DIALOG
    }
}

export function getHideLoginDialogAction() {
    return {
        type: HIDE_LOGIN_DIALOG
    }
}

export function getAuthenticationPendingAction() {
    return {
        type: AUTHENTICATION_PENDING
    }
}

export function getAuthenticationSuccessAction(userSession: { user: string, accessToken: string }) {
    return {
        type: AUTHENTICATION_SUCCESS,
        user: userSession.user,
        accesToken: userSession.accessToken
    }
}

export function getAuthenticationErrorAction(error: any) {
    return {
        type: AUTHENTICATION_ERROR,
        error: error
    }
}

export function getLogoutAction(){
    return {
        type: LOGOUT
    }
}

export function authenticateUser(userID: string, password: string) {

    return async (dispatch: Dispatch) => {
        dispatch(getAuthenticationPendingAction());
        //console.log("authUse" + userID + " " + password);
        try {
            let userSession = await login(userID, password)
            const action = getAuthenticationSuccessAction(userSession);
            dispatch(action);
        } catch (err) {
            dispatch(getAuthenticationErrorAction(err));
        }
    }
}

async function login(userID: string, password: string) {
    const requestOptions = {
        method: 'GET',
        headers: { "Authorization": "Basic " + btoa(userID + ":" + password) }, //TODO: Base64 coding noch machen
    }

    let response = await fetch('https://localhost:443/api/authenticate', requestOptions);
    let userSession = await handleResponse(response);
    return userSession;
}

async function handleResponse(response: Response) {//: {user: String, accessToken: String} {
    const authorizationHeader = response.headers.get('Authorization');

    let text = await response.text();
    const data = text && JSON.parse(text);
    let token: string = ""; //TODO: unschoen
    if (authorizationHeader) {
        token = authorizationHeader.split(" ")[1];
    }

    if (!response.ok) {
        if (response.status === 401) {
            logout(); //TODO:logout machen
        }
        const error = (data & data.message) || response.statusText;
        return Promise.reject(error);
    }
    else {
        let userSession = {
            user: data,
            accessToken: token
        }
        return userSession;
    }
}

export function logout() {
    return (dispatch: Dispatch) => {
        dispatch(getLogoutAction());
    }
}