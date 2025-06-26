import { configureStore } from "@reduxjs/toolkit/react";
import { authenticationReducer } from "./react/login/state/AuthenticationSlice";
import { userReducer } from "./react/user/state/UserSlice";
import { degreeCourseReducer } from "./react/degreeCourse/state/DegreeCourseSlice";

// verwendete Quellen: Folien und Videos von den Vorlesungen
// Quelle zu Typescript in React: https://react-redux.js.org/using-react-redux/usage-with-typescript
// Quelle zu Typen: https://react-redux.js.org/using-react-redux/usage-with-typescript

export const store = configureStore({ reducer: { authentication: authenticationReducer, user: userReducer , degreeCourse: degreeCourseReducer} });

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;