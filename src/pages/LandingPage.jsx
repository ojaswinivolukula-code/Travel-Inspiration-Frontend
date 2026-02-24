import React from "react";
import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-linear-to-r from-purple-500 via-pink-500 to-red-500 text-white">
      <h1 className="text-5xl font-extrabold mb-4 drop-shadow-lg animate-pulse">
        Welcome to MyApp
      </h1>
      <p className="text-lg mb-12 text-center max-w-md drop-shadow-sm">
        Join our community and explore amazing features. Create an account or login to get started!
      </p>

      <div className="flex gap-8">
        <button
          onClick={() => navigate("/register")}
          className="px-10 py-3 bg-white text-purple-600 font-bold rounded-full shadow-lg hover:bg-purple-100 hover:text-purple-700 transform hover:-translate-y-1 hover:scale-105 transition-all duration-300"
        >
          Register
        </button>

        <button
          onClick={() => navigate("/login")}
          className="px-10 py-3 border-2 border-white text-white font-bold rounded-full shadow-lg hover:bg-white hover:text-purple-600 transform hover:-translate-y-1 hover:scale-105 transition-all duration-300"
        >
          Login
        </button>
      </div>
    </div>
  );
}