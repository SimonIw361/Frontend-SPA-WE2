import { createSlice } from "@reduxjs/toolkit/react";
import type { DegreeCourse } from "../DegreeCoursePage";

type State = {
    selectedDegreeCourse: DegreeCourse | null,
    showDegreeCourseEditAlertSuccessBool: boolean
};

const initialState: State = {
    selectedDegreeCourse: null,
    showDegreeCourseEditAlertSuccessBool: false
};

const degreeCourseSlicer = createSlice({
    name: "degreeCourse",
    initialState,
    reducers: {
        setSelectedDegreeCourse(state, action) {
            state.selectedDegreeCourse = action.payload;
        },
        showDegreeCourseEditAlertSuccess(state) {
            state.showDegreeCourseEditAlertSuccessBool = true;
        },
        hideDegreeCourseEditAlertSuccess(state) {
            state.showDegreeCourseEditAlertSuccessBool = false;
        }
    }
})

export const degreeCourseReducer = degreeCourseSlicer.reducer;
export const { setSelectedDegreeCourse, showDegreeCourseEditAlertSuccess, hideDegreeCourseEditAlertSuccess } = degreeCourseSlicer.actions;