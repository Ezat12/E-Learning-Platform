import { configureStore } from "@reduxjs/toolkit";
import newCourseSlice from "./Slice-NewCourse/SliceNewCourse";

export const store = configureStore({
  reducer: {
    newCourse: newCourseSlice,
  },
});
