"use client";

import React, { useState } from "react";

const Login = () => {
  const [state, setState] = useState<"Login" | "Sign Up">("Login");

  return (
    <div className="flex justify-center items-center py-20">
      <div className="w-full max-w-md p-8 border border-gray-300 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-center mb-6">{state}</h2>
        <form className="flex flex-col gap-5">
          {state === "Sign Up" && (
            <input
              type="text"
              placeholder="Your Name"
              className="border border-gray-300 p-3 rounded outline-none"
              required
            />
          )}
          <input
            type="email"
            placeholder="Your Email"
            className="border border-gray-300 p-3 rounded outline-none"
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="border border-gray-300 p-3 rounded outline-none"
            required
          />
          <button
            type="submit"
            className="bg-black text-white py-3 rounded text-lg active:bg-gray-700"
          >
            {state === "Sign Up" ? "Create Account" : "Login"}
          </button>
        </form>
        <div className="flex items-center gap-2 mt-4">
          <input type="checkbox" id="terms" className="w-4 h-4" />
          <label htmlFor="terms" className="text-sm text-gray-600">
            By continuing, I agree to the terms of use & privacy policy.
          </label>
        </div>
        <p className="mt-6 text-sm text-gray-600">
          {state === "Login" ? (
            <>
              Don't have an account?{" "}
              <span
                onClick={() => setState("Sign Up")}
                className="font-semibold text-blue-600 cursor-pointer hover:underline"
              >
                Sign Up here
              </span>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <span
                onClick={() => setState("Login")}
                className="font-semibold text-blue-600 cursor-pointer hover:underline"
              >
                Login here
              </span>
            </>
          )}
        </p>
      </div>
    </div>
  );
};

export default Login;