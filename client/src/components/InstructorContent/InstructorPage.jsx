import React, { useState } from "react";
import { IoCellularOutline } from "react-icons/io5";
import { CiMemoPad } from "react-icons/ci";
import { MdOutlineLogout } from "react-icons/md";
import InstructorDashboard from "./InstructorDashboard";
import InstructorCourses from "./InstructorCourses";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

function InstructorPage() {
  const location = useLocation();
  const navigator = useNavigate();
  const { pathname } = location;
  const pathLocation = pathname.split("/")[2];
  const [content, setContent] = useState(pathLocation);

  const menuItems = [
    {
      label: "Dashboard",
      icon: <IoCellularOutline size="22px" />,
      key: "dashboard",
    },
    { label: "Courses", icon: <CiMemoPad size="22px" />, key: "courses" },
  ];

  const handleLogout = () => {
    Cookies.remove("auth-token");
    window.location.reload();
    window.location.href = "/auth";
  };

  return (
    <div className="instructor h-full grid grid-cols-5 ">
      <div className="col-span-1 p-5 shadow-xl">
        <h1 className="text-2xl font-bold border-b-2 pb-2">Instructor View</h1>
        <div className="flex flex-col gap-4 mt-6">
          {menuItems.map(({ label, icon, key }) => (
            <Link
              to={`/instructor/${key}`}
              key={key}
              onClick={() => setContent(key)}
              className={`cursor-pointer flex items-center gap-3 p-3 rounded-md ${
                content === key
                  ? "bg-gray-800 text-white"
                  : "bg-gray-200 text-gray-800"
              }`}
            >
              {icon}
              <span className="text-lg font-semibold">{label}</span>
            </Link>
          ))}

          {/* Logout Button */}
          <div
            onClick={handleLogout}
            className="cursor-pointer flex items-center gap-3 p-3 rounded-md bg-gray-200 text-gray-800 hover:bg-gray-800 hover:text-white"
          >
            <MdOutlineLogout size="22px" />
            <span className="text-lg font-semibold">Logout</span>
          </div>
        </div>
      </div>

      <div className="col-span-4">
        {content === "dashboard" && <InstructorDashboard />}
        {content === "courses" && <InstructorCourses />}
      </div>
    </div>
  );
}

export default InstructorPage;
