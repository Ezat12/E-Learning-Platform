import React, { useEffect, useState, useRef } from "react";
import {
  Checkbox,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/react";
import { useSearchParams } from "react-router-dom";
import { BiSortAlt2 } from "react-icons/bi";
import { filterOptions } from "../Utils/New Course Utils/NewCourseUtils";
import axios from "axios";
import { BsCheck } from "react-icons/bs";
import Cookies from "js-cookie";
import { PropagateLoader } from "react-spinners";
import Item from "../Items Course/Item";
import { useSelector } from "react-redux";
import { IoFilterOutline } from "react-icons/io5";
import "./Courses.css";

function Courses() {
  const [allCourse, setAllCourse] = useState([]);
  const [filter, setFilter] = useState({});
  const [filterLength, setFilterLength] = useState(0);
  const [sort, setSort] = useState("sorted by");
  const [loadingState, setLoadingState] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilter, setShowFilter] = useState(false);

  const studentCourses = useSelector((state) => state.studentCourses);

  const filterRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setShowFilter(false); // Close the filter
      }
    };

    if (showFilter) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showFilter]);

  useEffect(() => {
    const buildQuery = handleCreateSearchParams(filter);
    setSearchParams(new URLSearchParams(buildQuery));
  }, [filter]);

  useEffect(() => {
    const getFilter = () => {
      const storedFilter = JSON.parse(Cookies.get("filter") || "{}");
      setFilter(storedFilter);
    };

    if (Cookies.get("filter")) getFilter();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      let activeFilter = filter;

      if (Object.keys(filter).length === 0 && Cookies.get("filter")) {
        activeFilter = JSON.parse(Cookies.get("filter") || "{}");
        setFilter(activeFilter);
      }

      const query = new URLSearchParams({ ...activeFilter });

      const checkOperation = Object.keys(activeFilter).length > 0 ? "&" : "?";

      const checkFilter =
        Object.keys(activeFilter).length > 0 ? `/?${query}` : "";

      const checkSorted =
        sort !== "sorted by"
          ? sort === "Price: Low to High"
            ? "sort=price"
            : sort === "Price: High to Low"
            ? "sort=-price"
            : sort === "Title: A to Z"
            ? "sort=title"
            : "sort=-title"
          : "";

      const response = await axios.get(
        `${
          import.meta.env.VITE_SERVER_BASE_URL
        }/api/v1/course${checkFilter}${checkOperation}${checkSorted}`
      );

      setLoadingState(true);
      setAllCourse(response.data.data.courses);
    };

    fetchData();
  }, [filterLength, sort]);

  useEffect(() => {
    return () => {
      Cookies.remove("filter");
    };
  }, []);

  const handleCreateSearchParams = (filterParams) => {
    const queryParams = [];

    for (const [key, value] of Object.entries(filterParams)) {
      if (Array.isArray(value) && value.length > 0) {
        const paramValue = value.join(",");
        queryParams.push(`${key}=${encodeURIComponent(paramValue)}`);
      }
    }

    return queryParams.join("&");
  };

  const handleFilterChange = (option, item) => {
    let copeFilter = { ...filter };
    const findOption = Object.keys(copeFilter).indexOf(option);
    if (findOption === -1) {
      copeFilter = { ...copeFilter, [option]: [item.id] };
    } else {
      const findItem = copeFilter[option].indexOf(item.id);
      if (findItem === -1) {
        copeFilter[option].push(item.id);
      } else {
        copeFilter[option].splice(findItem, 1);
        if (copeFilter[option].length <= 0) {
          delete copeFilter[option];
        }
      }
    }

    Cookies.set("filter", JSON.stringify(copeFilter));
    setFilter(copeFilter);
    setFilterLength(copeFilter?.category?.length);
  };

  const handleChangeSorted = (e) => {
    setSort(e.target.innerHTML);
  };

  const clickShoeFilter = () => {
    setShowFilter(true);
  };

  return (
    <div className="courses mt-5 px-6">
      <div className="container m-auto">
        <h1 className="text-2xl font-bold">All Courses</h1>

        <div className="flex gap-5 mt-6">
          {/* Filter Sidebar */}
          <aside
            ref={filterRef} // Attach the ref to the filter aside
            className={`w-64 space-y-5 lg:block filter-sidebar ${
              showFilter ? "show" : "hide"
            }`}
          >
            {Object.keys(filterOptions).map((option, i) => {
              return (
                <div key={i} className="flex gap-1 flex-col">
                  <label className="font-bold uppercase mb-2">{option}</label>
                  {filterOptions[option].map((item) => {
                    return (
                      <div
                        onClick={() => handleFilterChange(option, item)}
                        key={item.id}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <Checkbox
                          checked={
                            filter[option]?.length > 0 &&
                            filter[option]?.includes(item.id)
                              ? true
                              : false
                          }
                          className="group block size-4 rounded border-black border bg-white  data-[checked]:bg-blue-500  data-[checked]:border-blue-500"
                        >
                          {filter[option]?.length > 0 &&
                          filter[option]?.includes(item.id) ? (
                            <BsCheck color="#fff" />
                          ) : null}
                        </Checkbox>

                        <p>{item.label}</p>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </aside>

          {/* Main Content */}
          <main className="flex-1 relative">
            <div className="flex justify-end gap-5 items-center">
              <div
                onClick={clickShoeFilter}
                className="cursor-pointer lg:hidden flex items-center justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              >
                <IoFilterOutline size="20px" />
                <span>Filter</span>
              </div>
              <Menu as="div" className="relative inline-block text-left">
                <div>
                  <MenuButton className="inline-flex w-full items-center justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                    {sort}
                    {<BiSortAlt2 />}
                  </MenuButton>
                </div>

                <MenuItems
                  transition
                  className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
                >
                  <div className="py-1">
                    <MenuItem>
                      <a
                        onClick={handleChangeSorted}
                        href="#"
                        className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900 data-[focus]:outline-none"
                      >
                        Price: Low to High
                      </a>
                    </MenuItem>
                    <MenuItem>
                      <a
                        onClick={handleChangeSorted}
                        href="#"
                        className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900 data-[focus]:outline-none"
                      >
                        Price: High to Low
                      </a>
                    </MenuItem>
                    <MenuItem>
                      <a
                        onClick={handleChangeSorted}
                        href="#"
                        className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900 data-[focus]:outline-none"
                      >
                        Title: A to Z
                      </a>
                    </MenuItem>
                    <MenuItem>
                      <a
                        onClick={handleChangeSorted}
                        href="#"
                        className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900 data-[focus]:outline-none"
                      >
                        Title: Z to A
                      </a>
                    </MenuItem>
                  </div>
                </MenuItems>
              </Menu>
              <p className="font-semibold text-lg">{allCourse.length} Result</p>
            </div>
            <div className="flex flex-col gap-5">
              {allCourse.length > 0 ? (
                allCourse.map((course, i) => {
                  return <Item key={i} course={course} />;
                })
              ) : (
                <h1 className="text-3xl font-bold mt-48 flex items-center justify-center">
                  {allCourse.length <= 0 && !loadingState ? (
                    <PropagateLoader />
                  ) : (
                    "Not Found Courses"
                  )}
                </h1>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default Courses;
