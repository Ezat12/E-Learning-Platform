import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  courseLanding: {
    title: "",
    category: "",
    level: "",
    primaryLanguage: "",
    subtitle: "",
    description: "",
    pricing: "",
    objectives: "",
    welcomeMessage: "",
  },
  setting: {
    imageUrl: "",
  },
  curriculum: [
    {
      title: "",
      videoUrl: "",
      freePreview: false,
      public_id: "",
    },
  ],
};

const sliceNewCourse = createSlice({
  name: "SliceNewCourse",
  initialState,
  reducers: {
    addCourseId: (state, action) => {
      state.courseLanding.title = action.payload.title;
      state.courseLanding.category = action.payload.category;
      state.courseLanding.level = action.payload.level;
      state.courseLanding.description = action.payload.description;
      state.courseLanding.primaryLanguage = action.payload.language;
      state.courseLanding.subtitle = action.payload.subTitle;
      state.courseLanding.pricing = action.payload.price;
      state.courseLanding.objectives = action.payload.objective;
      state.courseLanding.welcomeMessage = action.payload.welcomeMessage;
      state.courseLanding.imageUrl = action.payload.courseImage;
      state.setting.imageUrl = action.payload.courseImage;
      state.curriculum = action.payload.curriculum;
    },
    changeCourseLanding: (state, action) => {
      state.courseLanding[action.payload.name] = action.payload.value;
    },
    addLecture: (state, action) => {
      state.curriculum.push({
        title: action.payload?.title || "",
        videoUrl: action.payload?.videoUrl || "",
        freePreview: false,
        public_id: action.payload?.publicId || "",
      });
    },
    handleCheckedSwitch: (state, action) => {
      state.curriculum[action.payload].freePreview =
        !state.curriculum[action.payload].freePreview;
    },
    handleChangeTitle: (state, action) => {
      state.curriculum[action.payload.index].title = action.payload.value;
    },
    handleChangeVideoCuu: (state, action) => {
      state.curriculum[action.payload.index].public_id =
        action.payload.public_id;

      state.curriculum[action.payload.index].videoUrl = action.payload.url;
    },
    handleChangeImageAcc: (state, action) => {
      state.setting.imageUrl = action.payload.imageUrl;
    },
    deleteLecture: (state, action) => {
      state.curriculum = state.curriculum.filter((lec, index) => {
        return action.payload !== index;
      });
    },
  },
});

export const {
  changeCourseLanding,
  addLecture,
  handleCheckedSwitch,
  handleChangeTitle,
  handleChangeVideoCuu,
  handleChangeImageAcc,
  addCourseId,
  deleteLecture,
} = sliceNewCourse.actions;

export default sliceNewCourse.reducer;
