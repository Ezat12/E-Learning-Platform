import React, { useEffect, useState } from "react";
import img from "../../assets/Images Courses/course nodejs.webp";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import Cookies from "js-cookie";
import { addStudentCourse } from "../../rtk/Slice-StudentCourses/SliceStudentCourses";
import { PropagateLoader } from "react-spinners";
import { ColorRing } from "react-loader-spinner";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function MyCourses() {
  const studentCourses = useSelector((state) => state.studentCourses);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigator = useNavigate();

  useEffect(() => {
    const fetchDataToGetCoursesStudent = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_BASE_URL}/api/v1/getCoursesStudent`,
          { headers: { Authorization: `Bearer ${Cookies.get("auth-token")}` } }
        );

        const studentCoursesData = response.data.data.courses;
        studentCoursesData.map((course) => {
          dispatch(addStudentCourse(course.course));
        });
      } finally {
        setLoading(false);
      }
    };

    if (Cookies.get("auth-token")) {
      fetchDataToGetCoursesStudent();
    } else {
      toast("you are not login,please login...");
      navigator("/auth");
    }
  }, [dispatch]);
  return (
    <div className="p-6">
      <h1 className="text-4xl font-bold border-b pb-5">My Courses</h1>
      {loading ? (
        <div className="h-[60vh] flex items-center justify-center ">
          <ColorRing />
        </div>
      ) : studentCourses.length > 0 ? (
        <div className="mt-5 grid grid-cols-4 gap-4">
          {studentCourses.map((course, index) => {
            return (
              <div key={index} className="course border rounded-md p-3">
                <div className="image w-full h-36">
                  <img className="h-full w-full" src={course?.courseImage} />
                </div>
                <div className="content mt-3 flex flex-col gap-2">
                  <p className="font-semibold text-sm">{course?.title}</p>
                  <span className="text-gray-600 font-medium">
                    Created by{" "}
                    <span className="text-black">
                      {" "}
                      {course?.user?.userName}
                    </span>
                  </span>
                </div>
                <button className="mt-4 text-white p-2 bg-gray-900 rounded-md text-lg w-full transition duration-75 hover:bg-gray-700">
                  Start Watching
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="h-[60vh] flex items-center justify-center ">
          <span className="text-2xl font-bold">Not Found Courses</span>
        </div>
      )}
    </div>
  );
}

export default MyCourses;
