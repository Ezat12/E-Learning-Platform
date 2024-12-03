import { Routes, Route, Router } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import Navbar from "./components/Navbar/Navbar";
import Auth from "./components/Pages/Auth";
import { Fragment } from "react";
import Instructor from "./components/Pages/Instructor";
import NewCourse from "./components/Instructor New Course/NewCourse";
import Home from "./components/Pages/Home";
import Courses from "./components/CoursesView/Courses";
import CourseDetails from "./components/Course Details/CourseDetails";
import MyCourses from "./components/My-Courses/MyCourses";

function App() {
  return (
    <Fragment>
      <Navbar />
      <Routes>
        <Route path="/" element=<Home /> />
        <Route path="/courses" element=<Courses /> />
        <Route path="courses/details/:courseId" element=<CourseDetails /> />

        <Route path="/my-courses" element=<MyCourses /> />

        <Route path="/auth" element=<Auth /> />
        <Route path="/instructor/*" element=<Instructor />>
          <Route path="courses" element=<Instructor /> />
          <Route path="dashboard" element=<Instructor /> />
        </Route>
        <Route path="/instructor/new-course" element=<NewCourse /> />
        <Route path="/instructor/edit-course/:courseId" element=<NewCourse /> />
      </Routes>
      <ToastContainer />
    </Fragment>
  );
}

export default App;
