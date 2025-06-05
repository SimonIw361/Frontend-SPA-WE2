//import { configureStore } from "@reduxjs/toolkit";
import { configureStore } from "@reduxjs/toolkit/react";
import { authenticationReducer } from "./login/state/AuthenticationSlice";


export const store = configureStore({reducer: {authentication: authenticationReducer}});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; //TODO brauche ich das noch beides??