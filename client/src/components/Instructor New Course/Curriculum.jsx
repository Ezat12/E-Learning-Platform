import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Switch from "react-switch";
import axios from "axios";
import Cookies from "js-cookie";
import ReactPlayer from "react-player";
import { MdOutlineFileUpload } from "react-icons/md";
import {
  addLecture,
  deleteLecture,
  handleChangeTitle,
  handleChangeVideoCuu,
  handleCheckedSwitch,
} from "../../rtk/Slice-NewCourse/SliceNewCourse";
import VidyardPlayer from "react-player/vidyard";

function Curriculum() {
  const newCourse = useSelector((state) => state.newCourse);
  const dispatch = useDispatch();

  const [playVideo, setPlayVideo] = useState(null);

  const handleAddLecture = () => {
    dispatch(addLecture());
  };

  const handleChecked = (index) => {
    dispatch(handleCheckedSwitch(index));
  };

  const handleTitle = (e, index) => {
    const value = e.target.value;
    dispatch(handleChangeTitle({ value, index }));
  };

  const handleChangeVideo = async (e, index) => {
    if (e.target.files[0]) {
      const formData = new FormData();
      formData.append("file", e.target.files[0]);
      /// Fetch Data ==========
      try {
        const responseCloudinary = await axios.post(
          `${import.meta.env.VITE_SERVER_BASE_URL}/api/v1/upload/upload-Cloud`,
          formData,
          { headers: { Authorization: `Bearer ${Cookies.get("auth-token")}` } }
        );
        console.log(responseCloudinary);

        const data = responseCloudinary.data.data;
        // e.target.value = data.url;
        const videoData = {
          url: data.url,
          public_id: data.public_id,
          index,
        };
        dispatch(handleChangeVideoCuu(videoData));
      } catch (e) {
        console.log(e);
      }
    }
  };

  const handleBulkUpload = async (e) => {
    const files = e.target.files;

    function isNumber(value) {
      return !isNaN(Number(value));
    }
    let formData = new FormData();

    for (let file in files) {
      if (isNumber(file)) {
        formData.append("files", files[file]);
      }
    }

    const response = await axios.post(
      `${import.meta.env.VITE_SERVER_BASE_URL}/api/v1/upload/upload-bulk-Cloud`,
      formData,
      {
        headers: { Authorization: `Bearer ${Cookies.get("auth-token")}` },
      }
    );

    const dataVideos = response.data.data;
    dataVideos.map((v) => {
      dispatch(addLecture({ videoUrl: v.url, publicId: v.public_id }));
    });
    dispatch(deleteLecture(0));

    // dispatch(addLecture({}));
  };

  const handleDeleteLecture = (index) => {
    dispatch(deleteLecture(index));
  };

  const handlePlay = (i) => {
    setPlayVideo(i);
  };

  // const handleProgress = (e) => {
  //   console.log(e);
  // };

  return (
    <div className="curriculum p-4 rounded-md border">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold mb-4">Course Course Curriculum</h1>
        <div className="">
          <label
            htmlFor="bulk-upload"
            className="flex items-center gap-2 font-semibold border rounded-md p-2 cursor-pointer hover:bg-gray-200 transition duration-300 "
          >
            <MdOutlineFileUpload className="mt-1" /> Bulk Upload
          </label>
          <input
            onChange={handleBulkUpload}
            id="bulk-upload"
            type="file"
            accept="video/*"
            multiple
            hidden
          />
        </div>
      </div>
      <button
        onClick={handleAddLecture}
        className="font-semibold  bg-black text-white px-3 py-2 rounded-md mb-4"
      >
        Add Lecture
      </button>
      <div className="lectures">
        {newCourse.curriculum.map((curr, index) => {
          return (
            <div
              key={index}
              className="lecture p-4 rounded-md border border-gray-400 w-full mb-5"
            >
              <div className="flex items-center gap-4 w-full">
                <label className="text-xl font-semibold">
                  Lecture {index + 1}
                </label>
                <input
                  value={curr.title}
                  onChange={(e) => handleTitle(e, index)}
                  className="p-2 w-96 border-gray-500 border outline-none rounded-md focus:ring focus:border-blue-200"
                  type="text"
                  placeholder="Enter Lecture Title"
                />
                <div className="flex align-center gap-3">
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={curr.freePreview}
                      onClick={() => handleChecked(index)}
                    />
                    <span className="slider"></span>
                  </label>
                  <p className="text-gray-600 font-semibold">Free Preview</p>
                </div>
              </div>
              <div className="video ">
                {!curr.videoUrl ? (
                  <input
                    onChange={(e) => handleChangeVideo(e, index)}
                    type="file"
                    accept="video/*"
                    className="p-2 mt-5 border-gray-300 border rounded-md"
                  />
                ) : (
                  <div className="video mt-5">
                    <ReactPlayer
                      // onProgress={handleProgress}
                      className={`video-${index}`}
                      controls={"true"}
                      url={curr.videoUrl}
                      width={"100%"}
                      height={"250px"}
                      onPlay={() => handlePlay(index)}
                      playing={playVideo === index}
                      muted={playVideo !== index}
                    />
                  </div>
                )}
              </div>
              <div className="flex items-center gap-3 mt-4">
                <label
                  htmlFor="video"
                  className="bg-green-700 text-white p-2 rounded-md cursor-pointer"
                >
                  Change Video
                </label>
                <input
                  onChange={(e) => handleChangeVideo(e, index)}
                  id="video"
                  type="file"
                  accept="video/*"
                  hidden
                />
                {index !== 0 && (
                  <button
                    onClick={() => handleDeleteLecture(index)}
                    className="bg-red-700 text-white p-2 rounded-md"
                  >
                    Delete Lecture
                  </button>
                )}
              </div>
              {/*index !== 0 && (
                
              )*/}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Curriculum;
