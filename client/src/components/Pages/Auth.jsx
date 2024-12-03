import React, { useEffect, useState } from "react";
import { authLogin, authSignup } from "../Utils/Auth Utils/AuthUtils";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

function Auth() {
  const [content, setContent] = useState("Sign Up");
  const [accept, setAccept] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigator = useNavigate();

  const [formData, setFormData] = useState({
    userName: "",
    userEmail: "",
    password: "",
  });

  useEffect(() => {
    if (Cookies.get("auth-token")) {
      navigator("/home");
    }
  });

  const handleChange = (e) => {
    setAccept(false);
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSignup = async (e) => {
    setAccept(true);
    e.preventDefault();

    const checkHandle =
      formData.userName &&
      formData.password &&
      formData.userEmail &&
      formData.userName.length > 2 &&
      formData.password.length > 6;

    if (checkHandle) {
      try {
        const data = await authSignup(formData);
        Cookies.set("auth-token", data.token);

        navigator("/home");
      } catch (e) {
        const error = e.response.data.errors[0].msg;
        toast.error(error);
      }
    }
  };

  const handleLogin = async (e) => {
    setAccept(true);
    e.preventDefault();

    const checkHandle = formData.password && formData.userEmail;

    if (checkHandle) {
      try {
        const data = await authLogin(formData);
        const role = data.user.role;
        Cookies.set("auth-token", data.token);

        role === "user" ? navigator("/home") : navigator("/instructor");
      } catch (e) {
        const error = e.response.data.errors[0].msg;
        toast.error(error);
      }
    }
  };

  return (
    <div className="auth h-[90vh]">
      <div className="h-full flex items-center justify-center">
        <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
          <div className="flex mb-6">
            <button
              onClick={() => setContent("Sign In")}
              className={
                content === "Sign Up"
                  ? "flex-1 py-2 bg-gray-200 text-gray-600 font-semibold rounded-tl-lg focus:outline-none"
                  : "flex-1 py-2 bg-blue-400 text-white font-semibold border-b-2 border-black focus:outline-none"
              }
            >
              Sign In
            </button>
            <button
              onClick={() => setContent("Sign Up")}
              className={
                content === "Sign Up"
                  ? "flex-1 py-2 bg-blue-400 text-white font-semibold border-b-2 border-black focus:outline-none"
                  : "flex-1 py-2 bg-gray-200  text-gray-600 font-semibold rounded-tl-lg focus:outline-none"
              }
            >
              Sign Up
            </button>
          </div>
          <form>
            {content == "Sign Up" && (
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Create a new account
              </h2>
            )}
            {content === "Sign Up" && (
              <div className="mb-4">
                <label
                  className="block text-gray-700 font-medium mb-2"
                  htmlFor="username"
                >
                  User Name
                </label>
                <input
                  type="text"
                  id="username"
                  name="userName"
                  value={formData.userName}
                  onChange={handleChange}
                  className={
                    accept && !formData.userName
                      ? "w-full px-4 py-2 border border-red-600 rounded-lg focus:outline-none focus:ring focus:border-blue-500"
                      : "w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-500"
                  }
                  placeholder="Enter your user name"
                  required
                />
                {formData.userName && formData.userName.length < 3 && (
                  <p className="error bg-red-400 px-2 font-semibold rounded-md text-white mt-2">
                    user name must be more than 2 char
                  </p>
                )}
              </div>
            )}
            <div className="mb-4">
              <label
                className="block text-gray-700 font-medium mb-2"
                htmlFor="email"
              >
                User Email
              </label>
              <input
                type="email"
                id="email"
                name="userEmail"
                value={formData.userEmail}
                onChange={handleChange}
                className={
                  accept && !formData.userEmail
                    ? "w-full px-4 py-2 border border-red-600 rounded-lg focus:outline-none focus:ring focus:border-blue-500"
                    : "w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-500"
                }
                placeholder="Enter your user email"
                required
              />
            </div>
            <div className="mb-6">
              <label
                className="block text-gray-700 font-medium mb-2"
                htmlFor="password"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={
                  accept && !formData.password
                    ? "w-full px-4 py-2 border border-red-600 rounded-lg focus:outline-none focus:ring focus:border-blue-500"
                    : "w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-500"
                }
                placeholder="Enter your password"
                required
              />
              {formData.password && formData.password.length < 7 && (
                <p className="error bg-red-400 px-2 font-semibold rounded-md text-white mt-2">
                  password must be more than 6 char
                </p>
              )}
            </div>
            <button
              onClick={content === "Sign Up" ? handleSignup : handleLogin}
              type="submit"
              className="w-full py-2 bg-black text-white font-bold rounded-lg hover:bg-gray-800 focus:outline-none"
            >
              {content}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Auth;
