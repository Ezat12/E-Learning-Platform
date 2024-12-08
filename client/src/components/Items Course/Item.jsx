/* eslint-disable react/prop-types */
import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function Item(props) {
  const { course } = props;

  const studentCourses = useSelector((state) => state.studentCourses);
  const navigator = useNavigate();

  const checkFoundCourse = studentCourses.some((c) => c._id === course._id);

  return (
    <div
      onClick={
        checkFoundCourse
          ? () => navigator(`/course-progress/${course._id}`)
          : () => navigator(`/courses/details/${course._id}`)
      }
      className="border rounded-md mt-4 p-2 flex items-center gap-5 cursor-pointer"
    >
      <div className="image h-full">
        <img src={course.courseImage} />
      </div>
      <div className="content flex flex-col mt-4">
        <p className="font-bold">{course.title}</p>
        <p className="mt-2">{course.description}</p>
        <div className="flex items-center gap-2 mt-2">
          <p className="text-gray-500">Created by</p>
          <span className="font-semibold">{course.user.userName}</span>
        </div>
        <div className="mt-3 font-semibold text-gray-600">
          {course.curriculum.length} lecture -{" "}
          <span className="uppercase ">{course.level}</span> level
        </div>
        <div className="flex items-center gap-2 mt-3">
          Price: <span className="font-bold">{course.price}</span>
        </div>
      </div>
    </div>
  );
}

export default Item;
