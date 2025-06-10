import { configureStore } from "@reduxjs/toolkit/react";
import { authenticationReducer } from "./login/state/AuthenticationSlice";

// verwendete Quellen: Folien und Videos von den Vorlesungen
// Quelle zu Typescript in React: https://react-redux.js.org/using-react-redux/usage-with-typescript

export const store = configureStore({ reducer: { authentication: authenticationReducer } });

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;