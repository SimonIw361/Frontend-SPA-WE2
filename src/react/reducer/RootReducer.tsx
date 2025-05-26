import { HIDE_LOGIN_DIALOG, SHOW_LOGIN_DIALOG } from "../actions/AuthenticationAction";

const initialState = {
    user: null,
    loginPending: false,
    showLoginDialog: false
};

export function rootReducer(state = initialState, action: { type: string; }) {
    console.log("Reducer: " + action.type)

    switch(action.type){
        case SHOW_LOGIN_DIALOG:
            //console.log({...state, showLoginDialog: true, error: null})
            return {...state, showLoginDialog: true, error: null};
        case HIDE_LOGIN_DIALOG:
            //console.log({...state, showLoginDialog: false, error: null})
            return {...state, showLoginDialog: false, error: null};
        default:
            return state;
    }
    
};
