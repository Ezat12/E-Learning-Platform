import React, { useState } from "react";
import { courseLandingPageFormControls } from "../Utils/New Course Utils/NewCourseUtils";
import { useDispatch, useSelector } from "react-redux";
import { changeCourseLanding } from "../../rtk/Slice-NewCourse/SliceNewCourse";
import "./css/Curriculum.css";

function CourseLandingPage() {
  const newCourse = useSelector((state) => state.newCourse);
  console.log(newCourse);

  const dispatch = useDispatch();

  const handleCourseLanding = (e) => {
    const { name, value } = e.target;
    dispatch(changeCourseLanding({ name, value }));
  };

  return (
    <div className="course-landing p-4 rounded-md border">
      <h1 className="text-xl font-semibold mb-4">Course Landing Page</h1>
      <diV className="flex flex-col gap-3">
        {courseLandingPageFormControls.map((field, index) => (
          <div key={index} className="flex flex-col gap-1">
            <label>{field.label}</label>
            {field.componentType === "input" ? (
              <input
                value={newCourse.courseLanding[field.name]}
                onChange={handleCourseLanding}
                className="border-gray-200 border-2 rounded-md outline-none p-2 focus:ring focus:border-blue-500"
                name={field.name}
                type={field.type}
                placeholder={field.placeholder}
              />
            ) : field.componentType === "select" ? (
              <select
                name={field.name}
                value={newCourse.courseLanding[field.name]}
                onChange={handleCourseLanding}
                className="border-gray-200 border-2 rounded-md outline-none p-2 focus:ring focus:border-blue-500"
              >
                {field.options.map((op, i) => (
                  <option
                    className="cursor-pointer px-4 py-2 hover:bg-blue-200 hover:text-white "
                    key={i}
                    value={op.id}
                  >
                    {op.label}
                  </option>
                ))}
              </select>
            ) : field.componentType === "textarea" ? (
              <textarea
                value={newCourse.courseLanding[field.name]}
                onChange={handleCourseLanding}
                className="border-gray-200 border-2 rounded-md outline-none p-2 focus:ring focus:border-blue-500"
                name={field.name}
                placeholder={field.placeholder}
              />
            ) : null}
          </div>
        ))}
      </diV>
    </div>
  );
}

export default CourseLandingPage;
