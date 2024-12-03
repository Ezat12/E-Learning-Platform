import React, { useEffect, useState } from "react";
import img_slider from "../../assets/banner-img.png";
import { courseCategories } from "../Utils/New Course Utils/NewCourseUtils";
import axios from "axios";

function Hero() {
  const [listCourses, setListCourse] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_BASE_URL}/api/v1/course`
      );

      setListCourse(response.data.data.courses);
    };
    fetchData();
  }, []);

  return (
    <div className="hero">
      <div className="flex items-center gap-10 justify-between  my-8 pl-6">
        <div className="flex flex-col gap-3 lg:w-[800px]">
          <h1 className="font-bold text-4xl">Learning That Gets You</h1>
          <p className="font-semibold text-gray-600">
            Shills for your Present and your future. Get Start with US
          </p>
        </div>
        <div className="image">
          <img src={img_slider} />
        </div>
      </div>
      <div className="mt-6 bg-gray-200 p-5">
        <h2 className="font-bold text-xl mb-6">Course Categories</h2>
        <div className="categories grid grid-cols-4 gap-5 ">
          {courseCategories.map((category, index) => {
            return (
              <button
                className="p-2 bg-white rounded-sm text-black font-normal transform duration-200 hover:bg-black hover:text-white"
                key={index}
                id={category.id}
              >
                {category.label}
              </button>
            );
          })}
        </div>
      </div>
      <div className="my-6 px-6 ">
        <h2 className="font-bold text-xl mb-6">Featured Courses</h2>
        <div className="grid grid-cols-4 gap-5 mt-4">
          {listCourses.length > 0 &&
            listCourses.map((course, i) => {
              return (
                <div className="rounded-md border" key={i}>
                  <img
                    width={"100%"}
                    className="h-[340px]"
                    src={course.courseImage}
                  />
                  <div className="p-2">
                    <p className="font-semibold h-12">{course.title}</p>
                    <p className="text-gray-500 text-sm font-semibold">
                      {course.objective}
                    </p>
                    <div className="flex items-center mt-3 font-bold">
                      ${course.price}
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}

export default Hero;
