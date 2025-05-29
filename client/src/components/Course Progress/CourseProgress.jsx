import axios from "axios";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { ColorRing } from "react-loader-spinner";
import { FaChevronLeft } from "react-icons/fa";
import ReactPlayer from "react-player";
import {
  Checkbox,
  Description,
  Dialog,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { BsCheck } from "react-icons/bs";
import Confetti from "react-confetti";

function CourseProgress() {
  const { courseId } = useParams();

  const [loading, setLoading] = useState(true);
  const [currentLecture, setCurrentLecture] = useState(null);
  const [completed, setCompleted] = useState(false);

  const [courses, setCourses] = useState({});
  const [play, setPlay] = useState(0);
  const navigator = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${
            import.meta.env.VITE_SERVER_BASE_URL
          }/api/v1/getCurrentProgressCourse/${courseId}`,
          { headers: { Authorization: `Bearer ${Cookies.get("auth-token")}` } }
        );

        setCourses(response.data.data);
        const checkCurrentLecture =
          response?.data?.data?.lecturesProgress?.findIndex(
            (lec) => !lec.completedLecture
          );
        if (checkCurrentLecture < 0) {
          setCompleted(true);
        }
        setCurrentLecture(checkCurrentLecture);

        setLoading(false);

      } catch (e) {
        setLoading(false);
        toast.error("error you are not allowed to show this course");
      }
    };
    if (!Cookies.get("auth-token")) {
      toast("You are not login , please login...");
      navigator("/auth");
    } else {
      fetchData();
    }
  }, [loading]);

  useEffect(() => {
    if (play === 1) {
      const fetchData = async () => {
        const response = await axios.put(
          `${
            import.meta.env.VITE_SERVER_BASE_URL
          }/api/v1/restCurrentProgressCourse`,
          { index: currentLecture },
          { headers: { Authorization: `Bearer ${Cookies.get("auth-token")}` } }
        );
        setCourses(response.data.data);
        const checkCurrentLecture =
          response.data.data.lecturesProgress.findIndex(
            (lec) => !lec.completedLecture
          );
        if (checkCurrentLecture < 0) {
          setCompleted(true);
        } else if (
          checkCurrentLecture + 1 ===
            response.data.data?.lecturesProgress?.length &&
          checkCurrentLecture >= 0
        ) {
          setCurrentLecture(checkCurrentLecture);
        } else {
          setCurrentLecture(checkCurrentLecture);
        }
      };

      fetchData();
    }
  }, [play]);

  const handleClickLecture = (index) => {
    if (index !== currentLecture) {
      setCurrentLecture(index);
    }
  };

  const handleReWatchCourse = async () => {
    setCompleted(false);
    setLoading(true);
    await axios.put(
      `${
        import.meta.env.VITE_SERVER_BASE_URL
      }/api/v1/restWatchAgainCourseProgress`,
      {},
      { headers: { Authorization: `Bearer ${Cookies.get("auth-token")}` } }
    );
  };

  return (
    <div className="bg-[#1c1d1f] min-h-[89vh] relative">
      {completed && <Confetti />}
      {
        <Dialog
          open={completed}
          onClose={() => setCompleted(false)}
          className="relative z-50"
        >
          <div className="fixed bg-[#12121263] inset-0 flex w-screen items-center justify-center p-2">
            <DialogPanel className="max-w-lg space-y-1 border bg-white p-6">
              <DialogTitle className="font-semibold text-lg">
                Congratulation
              </DialogTitle>
              <Description className={"font-semibold text-gray-500"}>
                You are Completed This Course
              </Description>
              <div className="flex gap-4">
                <button
                  onClick={() => navigator("/courses")}
                  className="bg-gray-900 py-2 px-5 rounded-md text-white mt-3"
                >
                  My Courses Page
                </button>
                <button
                  onClick={handleReWatchCourse}
                  className="bg-gray-900 py-2 px-5 rounded-md text-white mt-3"
                >
                  Rewatch Course
                </button>
              </div>
            </DialogPanel>
          </div>
        </Dialog>
      }
      {loading ? (
        <div className="fixed top-[50%] left-[50%]">
          <ColorRing colors={["#fff", "#fff", "#fff", "#fff", "#fff"]} />
        </div>
      ) : (
        <div className="con">
          <div className="pb-3 border-b px-4 py-5 flex items-center gap-6">
            <h3
              onClick={() => navigator("/my-courses")}
              className="text-black p-2 bg-white rounded-md w-fit font-medium flex items-center gap-3 cursor-pointer"
            >
              <FaChevronLeft className="mt-1" />
              <span>Back go to Courses Page</span>
            </h3>
            <p className="text-white font-bold text-lg">
              {courses?.course?.title}
            </p>
          </div>
          <div className="grid grid-cols-4 ">
            <div className="lg:col-span-3 col-span-4">
              <div className="current-video w-full mt-5">
                <ReactPlayer
                  // height={"300"}
                  width={"100%"}
                  // playing
                  controls={"true"}
                  url={
                    Object.keys(courses).length > 0
                      ? courses?.lecturesProgress[currentLecture]?.videoUrl
                      : ""
                  }
                  onEnded={() => {
                    setPlay(1);
                  }}
                />
              </div>
            </div>
            <div
              style={{
                minHeight:
                  window.innerHeight > 1009 ? "calc(100vh - 170px)" : "auto",
              }}
              className="lg:col-span-1 col-span-4 bg-white h-full"
            >
              <div className="bg-white p-3 border-b-2">
                <p className="text-lg font-bold">Course content</p>
              </div>
              <div className="flex flex-col">
                {courses?.lecturesProgress?.map((lec, index) => {
                  return (
                    <div
                      onClick={() => handleClickLecture(index)}
                      key={index}
                      className={
                        index === currentLecture
                          ? "flex items-center gap-2 p-3 text-black font-semibold cursor-pointer bg-gray-200"
                          : "flex items-center gap-2 p-3 text-black font-semibold cursor-pointer hover:bg-gray-200 transform duration-75"
                      }
                    >
                      <Checkbox
                        checked={lec.completedLecture}
                        className="relative group block size-4 rounded border-black border bg-white  data-[checked]:bg-black "
                      >
                        <span className="absolute text-white top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
                          <BsCheck />
                        </span>
                      </Checkbox>
                      <span>{lec.title}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CourseProgress;
