import axios from "axios";
import React, { useState } from "react";
import Cookies from "js-cookie";
import { useDispatch, useSelector } from "react-redux";
import { handleChangeImageAcc } from "../../rtk/Slice-NewCourse/SliceNewCourse";
import { ProgressBar } from "react-loader-spinner";
import { motion } from "framer-motion";

function SettingCourse() {
  const newCourse = useSelector((state) => state.newCourse);
  const [image, setImage] = useState(newCourse.setting.imageUrl);
  const dispatch = useDispatch();

  const handleChangeImage = async (e) => {
    if (e.target.files[0]) {
      // setImage(e.target.files[0]);
      const formData = new FormData();
      formData.append("file", e.target.files[0]);
      try {
        const responseCloudinary = await axios.post(
          `${import.meta.env.VITE_SERVER_BASE_URL}/api/v1/upload/upload-Cloud`,
          formData,
          { headers: { Authorization: `Bearer ${Cookies.get("auth-token")}` } }
        );

        const data = responseCloudinary.data.data;
        setImage(data.url);
        // console.log(data);
        dispatch(handleChangeImageAcc({ imageUrl: data.url }));
      } catch (e) {
        console.log(e);
      }
    }
  };

  return (
    <div className="setting-course  p-4 rounded-md border">
      <h1 className="text-xl font-semibold mb-4">Course Setting</h1>
      <div className="flex gap-2 flex-col">
        <h3 className="text-gray-500 font-semibold">Upload Course Image:</h3>
        <div className="loading w-full">
          {/* <motion.div
            // initial={{ width: 0 }}
            animate={{ transition: { duration: 0.4, ease: "easeInOut" } }}
            className="bg-blue-500 h-3 w-full rounded-full relative "
          >
            <motion.div
              className="absolute top-0 left-0 right-0 bottom-0 bg-red-700 opacity-50 rounded-full"
              animate={{ x: ["0%", "10%", "0%"] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            />
          </motion.div>*/}
        </div>
        <label htmlFor="image" className="cursor-pointer">
          {!image ? (
            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSg_ri9E8XxXRafeIMA4QGosabTMk_wP7pTDQ&s" />
          ) : (
            <img src={image} />
          )}
        </label>
        <input
          id="image"
          onChange={handleChangeImage}
          type="file"
          accept="image/*"
          hidden
        />
      </div>
    </div>
  );
}

export default SettingCourse;
