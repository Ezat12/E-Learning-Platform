import React, { useEffect, useState } from "react";
import img_slider from "../../assets/banner-img.png";
import { courseCategories } from "../Utils/New Course Utils/NewCourseUtils";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Hero() {
  const [listCourses, setListCourse] = useState([]);

  const navigator = useNavigate();

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
      <div className="flex items-center flex-col lg:flex-row md:flex-row gap-10 justify-between  my-8 md:pl-6 lg:pl-6 px-3">
        <div className="flex flex-col gap-3 lg:w-[800px]">
          <h1 className="font-bold text-center md:text-start lg:text-start text-2xl lg:text-4xl md:text-3xl">
            Learning That Gets You
          </h1>
          <p className="font-semibold text-gray-600 lg:text-lg lg:text-start md:text-start text-center">
            Shills for your Present and your future. Get Start with US
          </p>
        </div>
        <div className="image">
          <img src={img_slider} />
        </div>
      </div>
      <div className="mt-6 bg-gray-200 p-5">
        <h2 className="font-bold text-xl mb-6">Course Categories</h2>
        <div className="categories grid lg:grid-cols-4 md:grid-cols-3 grid-cols-2 gap-5 ">
          {courseCategories.map((category, index) => {
            return (
              <button
                onClick={() =>
                  navigator("/courses", {
                    state: { category: [category.label] },
                  })
                }
                className="p-2 cursor-pointer bg-white rounded-sm text-center text-black font-normal transform duration-200 hover:bg-black hover:text-white"
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
        <div className="grid grid-cols-1 lg:grid-cols-4 md:grid-cols-3 gap-5 mt-4">
          {listCourses.length > 0 &&
            listCourses.map((course, i) => {
              return (
                <div className="rounded-md border" key={i}>
                  <img
                    width={"100%"}
                    className="h-[170px]"
                    src={course.courseImage}
                  />
                  <div className="p-2">
                    <p className="font-semibold overflow-hidden overflow-ellipsis whitespace-nowrap">
                      {course.title}
                    </p>
                    <p
                      // style={{
                      //   // height: "40px",
                      //   overflow: "hidden",
                      //   textOverflow: "ellipsis",
                      //   whiteSpace: "nowrap",
                      // }}
                      className="h-[3rem] overflow-hidden text-ellipsis whitespace-normal text-gray-500 text-sm font-semibold leading-6 mt-2"
                    >
                      {course.description}
                    </p>
                    <div className="flex items-center mt-2 font-bold">
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
