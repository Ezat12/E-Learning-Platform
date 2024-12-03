import React, { useEffect, useState } from "react";
import Curriculum from "./Curriculum";
import CourseLandingPage from "./CourseLandingPage";
import SettingCourse from "./SettingCourse";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  fetchDataEditCourse,
  fetchDataNewCourse,
} from "../Utils/New Course Utils/NewCourseUtils";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { addCourseId } from "../../rtk/Slice-NewCourse/SliceNewCourse";
import { ThreeDots } from "react-loader-spinner";
import { HiOutlineArrowLeftStartOnRectangle } from "react-icons/hi2";

function NewCourse() {
  const [content, setContent] = useState("curriculum");
  const newCourse = useSelector((state) => state.newCourse);
  const [courseData, setCourseData] = useState({});
  const [loading, setLoading] = useState(false);
  const navigator = useNavigate();
  const dispatch = useDispatch();

  const { courseId } = useParams();

  useEffect(() => {
    const fetchDataGetCourse = async () => {
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_BASE_URL}/api/v1/course/${courseId}`
      );
      setCourseData(response.data.data);
      dispatch(addCourseId(response.data.data));
    };
    if (courseId) {
      fetchDataGetCourse();
    }
  }, []);

  const menuButton = [
    {
      label: "Curriculum",
      key: "curriculum",
    },
    {
      label: "Course Landing Page",
      key: "course-page",
    },
    {
      label: "Setting",
      key: "setting",
    },
  ];

  const handleSubmitCourse = async () => {
    const checkContent = (field) => {
      if (field === "freePreview") {
        return 1;
      } else {
        return field !== "" && field !== null && field !== undefined;
      }
    };

    let check = true;
    newCourse.curriculum.map((lecture) => {
      for (let field in lecture) {
        if (!checkContent(lecture[field])) {
          check = false;
          return toast.warning("something waring in curriculum page");
        }
      }
    });
    if (!check) {
      return 0;
    }

    for (let field in newCourse.courseLanding) {
      if (!checkContent(newCourse.courseLanding[field])) {
        return toast.warning("something waring in course landing page");
      }
    }

    if (!newCourse.setting.imageUrl) {
      return toast.warning("image course required");
    }

    let checkFreePreview = false;

    newCourse.curriculum.map((lec) => {
      for (let item in lec) {
        if (item === "freePreview" && lec[item] === true) {
          checkFreePreview = true;
          break;
        }
      }
    });

    if (!checkFreePreview) {
      return toast.warning("at least one video must be free");
    }

    /// Fetch Data ============
    const data = {
      title: newCourse.courseLanding.title,
      category: newCourse.courseLanding.category,
      level: newCourse.courseLanding.level,
      language: newCourse.courseLanding.primaryLanguage,
      subTitle: newCourse.courseLanding.subtitle,
      description: newCourse.courseLanding.description,
      price: newCourse.courseLanding.pricing,
      objective: newCourse.courseLanding.objectives,
      welcomeMessage: newCourse.courseLanding.welcomeMessage,
      courseImage: newCourse.setting.imageUrl,
      curriculum: newCourse.curriculum,
    };
    setLoading(true);
    if (courseId) {
      await fetchDataEditCourse(data, courseId);
    } else {
      await fetchDataNewCourse(data);
    }
    setLoading(false);
  };

  return (
    <div className="new-course">
      <div
        onClick={() => navigator("/instructor/courses")}
        className="absolute top-28 left-10 cursor-pointer"
      >
        <HiOutlineArrowLeftStartOnRectangle size={"30px"} />
      </div>
      {loading && (
        <div className="loading fixed bg-[#acacac8a] flex items-center justify-center top-0 left-0 w-full h-full">
          <ThreeDots />
        </div>
      )}
      <div className="container mx-auto mt-5">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">
            {!courseId ? "Create a New Course" : "Edit Course"}
          </h1>
          <button className="font-semibold  bg-black text-white p-3 rounded-md">
            {!courseId ? (
              <span onClick={handleSubmitCourse}>Submit</span>
            ) : (
              <span onClick={handleSubmitCourse} className="text-xl p-4">
                Edit
              </span>
            )}
          </button>
        </div>
        <div className="border rounded-md p-5 mt-3">
          <div className="bg-gray-100 px-4 py-2 w-fit rounded-md">
            <div className="flex items-center gap-2 font-semibold">
              {menuButton.map((item, index) => {
                return (
                  <button
                    onClick={() => setContent(item.key)}
                    className={
                      content === item.key
                        ? "p-2 bg-white rounded-md"
                        : "p-2 rounded-md"
                    }
                    key={index}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="mt-3">
            {content === "curriculum" ? (
              <Curriculum />
            ) : content === "course-page" ? (
              <CourseLandingPage />
            ) : (
              <SettingCourse />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default NewCourse;
