import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { GrLanguage } from "react-icons/gr";
import { FiCheckCircle } from "react-icons/fi";
import { IoIosLock } from "react-icons/io";
import { FaRegCirclePlay } from "react-icons/fa6";
import ReactPlayer from "react-player";
import { IoPlayCircleOutline } from "react-icons/io5";
import { FiPauseCircle } from "react-icons/fi";
import { MdCancel } from "react-icons/md";
import Cookies from "js-cookie";
import { ColorRing } from "react-loader-spinner";
import {
  CloseButton,
  Description,
  Dialog,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

function CourseDetails() {
  const { courseId } = useParams();
  const [course, setCourse] = useState({});
  const [isOpen, setIsOpen] = useState(false);
  const [showVideoDialog, setShowVideoDialog] = useState(null);
  const [showTitleDialog, setShowTitleDialog] = useState(null);
  const [loading, setLoading] = useState(false);

  const studentCourses = useSelector((state) => state.studentCourses);
  const navigator = useNavigate();

  useEffect(() => {
    const checkCourseIsAlreadyToken = studentCourses.some(
      (course) => course._id === courseId
    );

    if (checkCourseIsAlreadyToken) {
      navigator(`/course-progress/${courseId}`);
    } else {
      const fetchData = async () => {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_BASE_URL}/api/v1/course/${courseId}`
        );

        setCourse(response.data.data);
      };
      fetchData();
    }
  }, [studentCourses]);

  const getIndexFreePreview =
    course !== null
      ? course?.curriculum?.findIndex((lec) => lec.freePreview)
      : -1;

  const handleClickDialog = (lec) => {
    setIsOpen(true);
    setShowVideoDialog(lec.videoUrl);
    setShowTitleDialog(lec.title);
  };

  const handleByNow = async () => {
    if (Cookies.get("auth-token")) {
      setLoading(true);
      const response = await axios.get(
        `${
          import.meta.env.VITE_SERVER_BASE_URL
        }/api/v1/order/checkout-session/${course._id}`,
        { headers: { Authorization: `Bearer ${Cookies.get("auth-token")}` } }
      );
      setLoading(false);
      location.href = response.data.data.url;
    } else {
      toast("you are not login ,please login....");
      navigator("/auth");
    }
  };

  return (
    <div className="px-3 bg relative">
      {loading && (
        <div className="loading z-30 fixed w-full h-full bg-[#9ca3af63] top-0 left-0">
          <span className="fixed top-[50%] left-[50%]">
            <ColorRing colors={["#000", "#000", "#000", "#000", "#000"]} />
          </span>
        </div>
      )}
      <div className="bg-gray-900 text-white p-5 mt-4 rounded-md">
        <h1 className="lg:text-3xl md:text-2xl text-xl font-bold">
          {course?.title}
        </h1>
        <p className=" font-semibold lg:text-xl md:text-xl text-sm   mt-4 text-gray-200">
          {course?.description}
        </p>
        <div className="flex flex-wrap items-center text-sm gap-6 mt-4">
          <span>Created by {course?.user?.userName}</span>
          <span>Created on {course?.createdAt?.split("T")[0]}</span>
          <div className="flex items-center gap-1">
            <GrLanguage />
            <span className="capitalize">{course?.language}</span>
          </div>
          <span>
            {course?.student?.length}{" "}
            {course?.student?.length > 1 ? "Students" : "Student"}
          </span>
        </div>
      </div>
      <div className="flex flex-col lg:flex-row gap-6 mt-5">
        <main className="flex-grow">
          <div className="border border-gray-300 rounded-md p-3">
            <h2 className="text-xl font-bold">What you'll learn</h2>
            <div className="mt-4">
              <ul className="grid grid-cols-2">
                {course?.objective?.split(",").map((con, index) => {
                  return (
                    <li className="flex items-center gap-2 mb-4" key={index}>
                      <FiCheckCircle color="#06b300" />
                      <span>{con}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
          <div className="border border-gray-300 rounded-md p-3 mt-3">
            <h2 className="text-xl font-bold">Course Curriculum</h2>
            <div className="mt-3 ml-3">
              <ul className={"flex flex-col gap-4 cursor-pointer w-fit"}>
                {course?.curriculum?.map((lec, index) => {
                  return (
                    <li
                      className={
                        lec.freePreview
                          ? "flex items-center gap-2 cursor-pointer"
                          : "flex items-center gap-2 cursor-auto"
                      }
                      key={index}
                      onClick={
                        lec.freePreview ? () => handleClickDialog(lec) : null
                      }
                    >
                      {!lec.freePreview ? <IoIosLock /> : <FaRegCirclePlay />}
                      {lec.title.replace("|", "")}
                    </li>
                  );
                })}{" "}
              </ul>
            </div>
          </div>
        </main>
        <aside className="border border-gray-300 rounded-md p-3">
          <div className="flex flex-col gap-4 lg:w-full md:w-full  w-[300px]">
            <ReactPlayer
              // height={"300"}
              // playing
              width={"100%"}
              controls={"true"}
              url={
                getIndexFreePreview > -1
                  ? course?.curriculum[getIndexFreePreview]?.videoUrl
                  : ""
              }
            />
            <div className="flex items-center justify-between">
              <span className="font-bold text-xl">{course.price}$</span>
              <button
                onClick={handleByNow}
                className="px-5 py-2 font-semibold text-xl w-48 bg-gray-800 text-white rounded-md"
              >
                By Now
              </button>
            </div>
          </div>
        </aside>
      </div>
      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 flex w-screen items-center justify-center bg-[#12121263] p-4">
          <DialogPanel className="space-y-2 border bg-white p-6">
            <DialogTitle className="text-gray-600">course Preview</DialogTitle>
            <Description>
              {showTitleDialog ? (
                <p className="font-semibold">
                  {showTitleDialog.replace("|", "")}
                </p>
              ) : null}
            </Description>
            <div className="video lg:w-full md:w-full w-[250px]">
              <ReactPlayer
                // height={"300"}
                // playing
                width={"100%"}
                controls={"true"}
                url={showVideoDialog ? showVideoDialog : null}
              />
            </div>
            <div className="flex flex-col gap-3 my-5">
              {course?.curriculum
                ?.filter((lec) => lec.freePreview)
                .map((lec, index) => {
                  return (
                    <div
                      key={index}
                      className="flex items-center gap-2 mb-3 cursor-pointer font-medium"
                      onClick={
                        lec.videoUrl !== showVideoDialog
                          ? () => handleClickDialog(lec)
                          : null
                      }
                    >
                      {lec.videoUrl === showVideoDialog ? (
                        <FiPauseCircle
                          className="mt-1"
                          color="#4a7eb8e3"
                          size={"20px"}
                        />
                      ) : (
                        <IoPlayCircleOutline className="mt-1" size={"20px"} />
                      )}
                      <span
                        className={
                          lec.videoUrl === showVideoDialog
                            ? "text-[#4a7eb8e3]"
                            : ""
                        }
                      >
                        {lec.title.replace("|", "")}
                      </span>
                    </div>
                  );
                })}
            </div>
            {
              <button
                onClick={() => setIsOpen(false)}
                className="bg-gray-800 p-1 px-4 rounded-md text-white"
              >
                Close
              </button>
            }
          </DialogPanel>
        </div>
      </Dialog>
    </div>
  );
}

export default CourseDetails;
