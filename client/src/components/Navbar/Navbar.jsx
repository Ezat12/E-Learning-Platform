import React, { useEffect, useState } from "react";
import { PiGraduationCapFill } from "react-icons/pi";
import { PiMonitorPlayLight } from "react-icons/pi";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";

function Navbar() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  console.log("token", Cookies.get("auth-token"));

  useEffect(() => {
    setIsAuthenticated(!!Cookies.get("auth-token"));
  }, []);

  const handleLogout = () => {
    Cookies.remove("auth-token");
    setIsAuthenticated(false);
  };

  return (
    <div className="navbar p-5 shadow-lg">
      <div className="flex items-center justify-between">
        <Link to={"/"} className="logo flex items-center gap-2 font-bold ">
          <div className="flex items-center gap-2 cursor-pointer">
            <div className="icon">
              <PiGraduationCapFill size={"30px"} />
            </div>
            <span className="text-lg ">LMS LEARN</span>
          </div>
          <Link
            to={"/courses"}
            className="bg-gray-200 rounded-md font-semibold p-2 ml-3 cursor-pointer transform duration-200 hover:bg-black hover:text-white"
          >
            Explore Course
          </Link>
        </Link>
        <div className="flex items-center gap-5">
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
      </div>
    </div>
  );
}

export default Navbar;
