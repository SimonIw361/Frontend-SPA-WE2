import type { AppDispatch } from "../../../main";

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

export function getAuthenticationErrorAction(error: string) {
    return {
        type: AUTHENTICATION_ERROR,
        error: error
    }
}

export function getLogoutAction() {
    return {
        type: LOGOUT
    }
}

export function authenticateUser(userID: string, password: string) {

    return async (dispatch: AppDispatch) => {
        dispatch(getAuthenticationPendingAction());
        try {
            let userSession = await login(userID, password)
            const action = getAuthenticationSuccessAction(userSession);
            dispatch(action);
        } catch (err) {
            if (typeof err === "string") {
                dispatch(getAuthenticationErrorAction(err));
            }
            else { //tritt eigentlich nie ein, es wird immer String zurueckgegeben
                dispatch(getAuthenticationErrorAction("Fehler beim Login"));
            }

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
            logout();
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
}

export function logout() {
    return (dispatch: AppDispatch) => {
        dispatch(getLogoutAction());
    }
}
