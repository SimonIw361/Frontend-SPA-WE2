import { createSlice } from "@reduxjs/toolkit/react";
import type { DegreeCourseApplication } from "../components/DegreeCourseApplicationPage";

type State = {
    selectedDegreeCourseApplication: DegreeCourseApplication | null,
    showDegreeCourseApplicationEditAlertSuccessBool: boolean
};

const initialState: State = {
    selectedDegreeCourseApplication: null,
    showDegreeCourseApplicationEditAlertSuccessBool: false
};

const degreeCourseApplicationSlicer = createSlice({
    name: "degreeCourseApplication",
    initialState,
    reducers: {
        setSelectedDegreeCourseApplication(state, action) {
            state.selectedDegreeCourseApplication = action.payload;
        },
        showDegreeCourseApplicationEditAlertSuccess(state) {
            state.showDegreeCourseApplicationEditAlertSuccessBool = true;
        },
        hideDegreeCourseApplicationEditAlertSuccess(state) {
            state.showDegreeCourseApplicationEditAlertSuccessBool = false;
        }
    }
})

export const degreeCourseApplicationReducer = degreeCourseApplicationSlicer.reducer;
export const { setSelectedDegreeCourseApplication, showDegreeCourseApplicationEditAlertSuccess, hideDegreeCourseApplicationEditAlertSuccess } = degreeCourseApplicationSlicer.actions;