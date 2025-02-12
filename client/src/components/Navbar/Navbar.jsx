import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { PiGraduationCapFill } from "react-icons/pi";
import { PiMonitorPlayLight } from "react-icons/pi";

import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";
import { addStudentCourse } from "../../rtk/Slice-StudentCourses/SliceStudentCourses";
import "./Navbar.css";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { HiOutlineBars3 } from "react-icons/hi2";
import { toast } from "react-toastify";

function Navbar() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const studentCourses = useSelector((state) => state.studentCourses);

  const navigator = useNavigate();

  const dispatch = useDispatch();

  useEffect(() => {
    setIsAuthenticated(!!Cookies.get("auth-token"));

    const fetchDataToGetCoursesStudent = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_BASE_URL}/api/v1/getCoursesStudent`,
          { headers: { Authorization: `Bearer ${Cookies.get("auth-token")}` } }
        );
        const studentCoursesData = response?.data?.data?.courses;
        studentCoursesData?.map((course) => {
          dispatch(addStudentCourse(course.course));
        });
      } catch (e) {
        // toast.error("")
      }
    };

    if (Cookies.get("auth-token")) {
      fetchDataToGetCoursesStudent();
    }
  }, []);

  const handleLogout = () => {
    Cookies.remove("auth-token");
    location.href = "/";
    // location.reload();
    setIsAuthenticated(false);
  };

  return (
    <div className="navbar p-5 shadow-lg">
      <div className="nav flex items-center justify-between">
        <Link to={"/"} className="logo flex items-center gap-2 font-bold ">
          <div className="flex items-center gap-2 cursor-pointer">
            <div className="icon">
              <PiGraduationCapFill size={"30px"} />
            </div>
            <span className="text-lg ">LMS LEARN</span>
          </div>
          <Link
            to={"/courses"}
            className="bg-gray-200 rounded-md font-semibold p-2 lg:ml-3 md:ml-3 cursor-pointer transform duration-200 hover:bg-black hover:text-white"
          >
            Explore Course
          </Link>
        </Link>
        <div className="flex items-center gap-5 drop ">
          <Link
            to={"/my-courses"}
            className="my-course flex items-center gap-2 cursor-pointer transform duration-200 hover:text-gray-600"
          >
            <p className="text-lg font-bold">My Course</p>
            <PiMonitorPlayLight size={"30px"} />
          </Link>
          {isAuthenticated ? (
            <button
              onClick={handleLogout}
              className="font-semibold bg-black border-black border-2 transform duration-200 text-white p-2 px-4 rounded-md hover:bg-white hover:text-black"
            >
              Logout
            </button>
          ) : (
            <Link
              to={"/auth"}
              className="font-semibold bg-black border-black border-2 transform duration-200 text-white p-2 px-4 rounded-md hover:bg-white hover:text-black"
            >
              Sign In
            </Link>
          )}
        </div>
        <div className="drop-outline">
          <Menu>
            <MenuButton className="inline-flex  items-center justify-center gap-x-1.5 rounded-md bg-white px-2 py-1 font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
              <HiOutlineBars3 size={"22px"} />
            </MenuButton>
            <MenuItems
              className="absolute z-10 mt-4 w-48 rounded-md bg-white shadow-lg ring-1 ring-black/5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
              anchor="bottom"
            >
              <MenuItem>
                <Link
                  to={"/my-courses"}
                  className=" font-semibold block px-4 py-2  text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900 data-[focus]:outline-none"
                >
                  My Course
                </Link>
              </MenuItem>
              <MenuItem>
                {isAuthenticated ? (
                  <Link
                    onClick={handleLogout}
                    className=" font-semibold block px-4 py-2  text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900 data-[focus]:outline-none"
                  >
                    Logout
                  </Link>
                ) : (
                  <Link
                    to={"/auth"}
                    className=" font-semibold block px-4 py-2  text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900 data-[focus]:outline-none"
                  >
                    Sign Up
                  </Link>
                )}
              </MenuItem>
            </MenuItems>
          </Menu>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
