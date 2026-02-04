"use client";

import React, { useState, FormEvent, useEffect } from "react";
import { GoalIcon, Mail } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

const Login = () => {
  const [state, setState] = useState<"Login" | "Sign Up">("Login");
  const { login, register, user } = useAuth();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    if (user) {
      router.push("/");
    }
  }, [user, router]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (state === "Sign Up") {
        if (password !== confirmPassword) {
          setError("Passwords do not match");
          setIsLoading(false);
          return;
        }

        const fullName = `${firstName} ${lastName}`.trim();
        await register({
          name: fullName,
          email: email.trim(),
          phone,
          password
        });
      } else {
        await login({
          email: email.trim(),
          password
        });
      }

      // Redirect or cleanup handled by AuthContext/UseEffect
    } catch (err: any) {
      if (typeof err === 'string') {
        setError(err);
      } else if (err.message) {
        setError(err.message);
      } else if (Array.isArray(err)) {
        // Handle array of validation errors (zod style from backend)
        setError(err[0]?.message || "An error occurred");
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const toggleState = (newState: "Login" | "Sign Up") => {
    setState(newState);
    setError(null);
    // Optional: Clear form fields
  };

  return (
    <div className="flex justify-center items-center py-20 min-h-[70vh]">
      <div className="w-full max-w-md p-8 bg-white shadow-sm border border-gray-100 rounded-lg">
        <h2 className="text-3xl font-heading font-bold text-center mb-8">
          {state === "Login" ? "Welcome Back" : "Create Account"}
        </h2>

        {/* Placeholder Social Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8 opacity-60 pointer-events-none grayscale">
          <button className="flex-1 flex items-center justify-center gap-2 border border-gray-300 py-3 rounded text-sm font-semibold hover:bg-gray-50 transition">
            <GoalIcon size={18} /> Google
          </button>
          <button className="flex-1 flex items-center justify-center gap-2 border border-gray-300 py-3 rounded text-sm font-semibold hover:bg-gray-50 transition">
            <Mail size={18} /> Email
          </button>
        </div>

        <div className="flex items-center my-4">
          <hr className="flex-grow border-gray-200" />
          <span className="px-3 text-gray-500 text-sm font-heading">
            {state === "Login" ? "Sign in with email" : "Sign up with email"}
          </span>
          <hr className="flex-grow border-gray-200" />
        </div>

        {error && (
          <div className="bg-red-50 text-red-500 p-3 rounded text-sm text-center mb-4 border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {state === "Sign Up" && (
            <>
              <div className="flex gap-4">
                <input
                  type="text"
                  placeholder="First Name"
                  className="w-1/2 border-b border-gray-400 p-2 outline-none text-sm focus:border-black transition"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Last Name"
                  className="w-1/2 border-b border-gray-400 p-2 outline-none text-sm focus:border-black transition"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
              <input
                type="tel"
                placeholder="Phone Number (e.g. 03xxxxxxxxx)"
                className="border-b border-gray-400 p-2 outline-none text-sm focus:border-black transition"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </>
          )}

          <input
            type="email"
            placeholder="Email Address"
            className="border-b border-gray-400 p-2 outline-none text-sm focus:border-black transition"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="border-b border-gray-400 p-2 outline-none text-sm focus:border-black transition"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {state === "Sign Up" && (
            <input
              type="password"
              placeholder="Confirm Password"
              className="border-b border-gray-400 p-2 outline-none text-sm focus:border-black transition"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="mt-6 bg-black text-white py-3 rounded text-sm font-bold uppercase tracking-wider hover:bg-[#ff5e5e] transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Processing..." : (state === "Sign Up" ? "Create Account" : "Sign In")}
          </button>
        </form>

        <p className="mt-6 text-sm text-gray-600 text-center">
          {state === "Login" ? (
            <>
              Don't have an account?{" "}
              <span
                onClick={() => toggleState("Sign Up")}
                className="font-semibold text-black cursor-pointer hover:underline"
              >
                Sign Up here
              </span>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <span
                onClick={() => toggleState("Login")}
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