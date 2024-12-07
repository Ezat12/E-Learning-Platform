import { configureStore } from "@reduxjs/toolkit";
import newCourseSlice from "./Slice-NewCourse/SliceNewCourse";
import studentCoursesSlice from "./Slice-StudentCourses/SliceStudentCourses"

export const store = configureStore({
  reducer: {
    newCourse: newCourseSlice,
    studentCourses: studentCoursesSlice,
  },
});
