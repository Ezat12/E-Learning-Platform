import { createSlice } from "@reduxjs/toolkit";

const initialState = [];

const sliceStudentCourses = createSlice({
  name: "sliceStudentCourses",
  initialState,
  reducers: {
    addStudentCourse: (state, action) => {
      let check = false;
      state.map((course) => {
        if (course._id === action.payload._id) {
          check = true;
        }
      });

      if (!check) {
        state.push(action.payload);
      }
    },
  },
});

export const { addStudentCourse } = sliceStudentCourses.actions;

export default sliceStudentCourses.reducer;
