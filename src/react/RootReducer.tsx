import { combineReducers } from "redux";

import { authenticationReducer } from "./login/state/AuthenticationReducer";

export const rootReducer = combineReducers({
    authenticationReducer
});
