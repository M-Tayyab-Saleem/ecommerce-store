"use client";

import React, { useState } from "react";
import Link from "next/link";
import { GoalIcon, Mail } from "lucide-react";

const Login = () => {
  const [state, setState] = useState<"Login" | "Sign Up">("Login");

  return (
    <div className="flex justify-center items-center py-20 min-h-[70vh]">
      <div className="w-full max-w-md p-8 bg-white">
        <h2 className="text-3xl font-heading font-bold text-center mb-8">
          {state === "Login" ? "Welcome Back" : "Create Account"}
        </h2>
        
        {/* Social / Email Signup Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
            <button className="flex-1 flex items-center justify-center gap-2 border border-gray-300 py-3 rounded text-sm font-semibold hover:bg-gray-50 transition">
                <GoalIcon size={18} /> Sign up with Google
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 border border-gray-300 py-3 rounded text-sm font-semibold hover:bg-gray-50 transition">
                <Mail size={18} /> Sign up with Email
            </button>
        </div>

        <div className="flex items-center my-4">
            <hr className="flex-grow border-gray-200" />
            <span className="px-3 text-gray-500 text-sm font-heading">— OR —</span>
            <hr className="flex-grow border-gray-200" />
        </div>

        <form className="flex flex-col gap-4">
          {state === "Sign Up" && (
            <>
              <div className="flex gap-4">
                <input
                  type="text"
                  placeholder="First Name"
                  className="w-1/2 border-b border-gray-400 p-2 outline-none text-sm"
                  required
                />
                <input
                  type="text"
                  placeholder="Last Name"
                  className="w-1/2 border-b border-gray-400 p-2 outline-none text-sm"
                  required
                />
              </div>
              <input
                type="tel"
                placeholder="Phone Number"
                className="border-b border-gray-400 p-2 outline-none text-sm"
                required
              />
            </>
          )}
          
          <input
            type="email"
            placeholder="Email Address"
            className="border-b border-gray-400 p-2 outline-none text-sm"
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="border-b border-gray-400 p-2 outline-none text-sm"
            required
          />
          {state === "Sign Up" && (
             <input
                type="password"
                placeholder="Confirm Password"
                className="border-b border-gray-400 p-2 outline-none text-sm"
                required
            />
          )}

          <button
            type="submit"
            className="mt-6 bg-black text-white py-3 rounded text-sm font-bold uppercase tracking-wider hover:bg-[#ff5e5e] transition"
          >
            {state === "Sign Up" ? "Create Account" : "Sign In"}
          </button>
        </form>

        <p className="mt-6 text-sm text-gray-600 text-center">
          {state === "Login" ? (
            <>
              Don't have an account?{" "}
              <span
                onClick={() => setState("Sign Up")}
                className="font-semibold text-black cursor-pointer hover:underline"
              >
                Sign Up here
              </span>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <span
                onClick={() => setState("Login")}
                className="font-semibold text-black cursor-pointer hover:underline"
              >
                Login
              </span>
            </>
          )}
        </p>
      </div>
    </div>
  );
};

export default Login;