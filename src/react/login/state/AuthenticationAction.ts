export const SHOW_LOGIN_DIALOG = "SHOW_LOGIN_DIALOG";
export const HIDE_LOGIN_DIALOG = "HIDE_LOGIN_DIALOG"

export const AUTHENTICATION_PENDING = "AUTHENTICATION_PENDING";
export const AUTHENTICATION_SUCCESS = "AUTHENTICATION_SUCCESS";
export const AUTHENTICATION_ERROR = "AUTHENTICATION_ERROR";

export function getShowLoginDialogAction(){
    return {
        type: SHOW_LOGIN_DIALOG
    }
}

export function getHideLoginDialogAction(){
    return {
        type: HIDE_LOGIN_DIALOG
    }
}

export function getAuthenticationPendingAction(){
    return {
        type: AUTHENTICATION_PENDING
    }
}

export function getAuthenticationSuccessAction(userSession: any){
    return {
        type: AUTHENTICATION_SUCCESS,
        user: userSession.user,
        accesToken: userSession.accessToken
    }
}

export function getAuthenticationErrorAction(error: any){
    return {
        type: AUTHENTICATION_ERROR,
        error: error
    }
}

export function authenticateUser(userID: string, password: string){
    return (dispatch: (arg0: { type: string; user?: any; accesToken?: any; error?: any; }) => void) => {
        dispatch(getAuthenticationPendingAction());
        //console.log("authUse" + userID + " " + password);
        login(userID, password).then(
            (            userSession: any) => {
                const action = getAuthenticationSuccessAction(userSession);
                dispatch(action);
            },
            (            error: any) => {
                dispatch(getAuthenticationErrorAction(error));
            }
        )
        .catch((error: any) => {
            dispatch(getAuthenticationErrorAction(error));
        })
    }
}

function login(userID: string, password: string){
    const requestOptions = {
        method: 'GET',
        headers: {"Authorization": "Basic " + btoa(userID + ":" + password)}, //TODO: Base64 coding noch machen
    }
    //console.log("Login " +userID + " " + password);
    //console.log(requestOptions);

    return fetch('https://localhost:443/api/authenticate', requestOptions)
        .then(handleResponse)
        .then(userSession => {
            return userSession
        })
}

function handleResponse(response: any){
    const authorizationHeader = response.headers.get('Authorization');

    return response.text().then((text: string) => {
        const data = text && JSON.parse(text);
        let token: string = ""; //TODO: unschoen
        console.log(authorizationHeader)
        if(authorizationHeader){
            token = authorizationHeader.split(" ")[1];
        }

        if(!response.ok){
            if(response.status === 401){
                logout(); //TODO:logout machen
            }
            const error = (data && data.message) || response.statusText;
            return Promise.reject(error);
        }
        else {
            let userSession = {
                user: data,
                accessToken: token
            }
            return userSession;
        }
    });
}

function logout(){
    console.log("TODO: Fehler sollte ausgeloggt werden")
}