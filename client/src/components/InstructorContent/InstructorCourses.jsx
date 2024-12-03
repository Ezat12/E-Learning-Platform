import axios from "axios";
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { BiSolidEdit } from "react-icons/bi";
import { RiDeleteBack2Fill } from "react-icons/ri";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

function InstructorCourses() {
  const [dataInstructor, setDataInstructor] = useState([]);
  const [change, setChange] = useState("");
  const navigator = useNavigate();

  console.log(dataInstructor);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${
            import.meta.env.VITE_SERVER_BASE_URL
          }/api/v1/course/course-instructor`,
          { headers: { Authorization: `Bearer ${Cookies.get("auth-token")}` } }
        );
        setDataInstructor(response.data.data.courses);
      } catch (e) {
        console.log(e);

        toast.warning(e.response.data.message);
        Swal.fire({
          // title: "Are you sure?",
          text: `${e.response.data.message}?!`,
          icon: "warning",
          // showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Login...",
        }).then(async (result) => {
          if (result.isConfirmed) {
            Cookies.remove("auth-token");
            navigator("/auth");
          }
        });
      }
    };
    fetchData();
  }, [change]);

  const handleDeleteCourse = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Are you sure about deleting that course?!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await axios.delete(
          `${import.meta.env.VITE_SERVER_BASE_URL}/api/v1/course/${id}`,
          { headers: { Authorization: `Bearer ${Cookies.get("auth-token")}` } }
        );
        setChange(id);

        Swal.fire({
          title: "Deleted!",
          text: "Your course has been deleted.",
          icon: "success",
        });
      }
    });
  };

  return (
    <div className="dashboard p-10 bg-gray-100 h-full min-h-[90vh]">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <div className="bg-white p-4 rounded-md mt-5">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">All Courses</h2>
          <Link
            to={"/instructor/new-course"}
            className=" font-semibold  bg-black text-white p-3 rounded-md"
          >
            Create New Course
          </Link>
        </div>
        <div className="items mt-6 ">
          <table className="w-full ">
            <thead className="border-b-[1px]">
              <tr>
                <th className="text-start pb-3">Course</th>
                <th>Student</th>
                <th>Revenue</th>
                <th className="text-end">Edit</th>
              </tr>
            </thead>
            <tbody>
              {dataInstructor && dataInstructor.length > 0 ? (
                dataInstructor.map((item, index) => {
                  return (
                    <tr key={index}>
                      <td className=" px-2 py-4 mb-3">{item.title}</td>
                      <td className="text-center px-2 py-4 mb-3">
                        {item.student.length}
                      </td>
                      <td className="text-center px-2 py-4 mb-3">
                        {item.student.length * item.price}$
                      </td>
                      <td className="text-end px-2 py-4 mb-3">
                        <div className="flex items-center gap-4 justify-end">
                          <Link
                            to={`edit-course/${item._id}`}
                            className="cursor-pointer"
                          >
                            {" "}
                            <BiSolidEdit size={"22px"} />
                          </Link>
                          <span
                            onClick={() => handleDeleteCourse(item._id)}
                            className="cursor-pointer"
                          >
                            <RiDeleteBack2Fill size="22px" />
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <div className="text-lg font-semibold mt-4">
                  You don&apos;t have any courses
                </div>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default InstructorCourses;
