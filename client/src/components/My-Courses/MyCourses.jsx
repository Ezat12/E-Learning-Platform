import React from 'react'
import img from "../../assets/Images Courses/course nodejs.webp"

function MyCourses() {
  return (
    <div className="p-6">
      <h1 className="text-4xl font-bold border-b pb-5">My Courses</h1>
      <div className="mt-5 grid grid-cols-5 gap-4">
        <div className="border rounded-md p-3">
          <div className="image w-full h-36">
            <img className="h-full" src={img} />
          </div>
          <div className="content mt-3 flex flex-col gap-2">
            <p className="font-semibold text-sm">
              NodeJs API for Beginners (Marketplace with AWS & MongoDB)
            </p>
            <span className="text-gray-600 font-medium">Instructor Name</span>
          </div>
          <button className='mt-4 text-white p-2 bg-gray-900 rounded-md text-lg w-full transition duration-75 hover:bg-gray-700'>Start Watching</button>
        </div>
        <div className="border rounded-md p-3">
          <div className="image w-full h-36">
            <img className="h-full" src={img} />
          </div>
          <div className="content mt-3 flex flex-col gap-2">
            <p className="font-semibold text-sm">
              NodeJs API for Beginners (Marketplace with AWS & MongoDB)
            </p>
            <span className="text-gray-600 font-medium">Instructor Name</span>
          </div>
          <button className='mt-4 text-white p-2 bg-gray-900 rounded-md text-lg w-full transition duration-75 hover:bg-gray-700'>Start Watching</button>
        </div>
      </div>
    </div>
  );
}

export default MyCourses