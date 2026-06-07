"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "@/lib/firebase";

const provider = new GoogleAuthProvider();

const LoginPage = () => {
  const router = useRouter();

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      console.log("User:", user);

      alert(`Welcome ${user.displayName}`);

      // 🔥 SIMPLE EMAIL CHECK ONLY
      if (user.email === "smmohammod45@gmail.com") {
        router.replace("/admin");
      } else {
        router.replace("/product"); // or /dashboard
      }

    } catch (error) {
      console.log("Login Error:", error);
    }
  };

  return (
    <div className="flex justify-center items-center my-12">
      <div className="w-full max-w-md p-6 rounded-md shadow bg-white">

        <h2 className="text-3xl font-semibold text-center mb-6">
          Login to your account
        </h2>

        <button
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-3 border p-3 rounded-md"
        >
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            className="w-5"
          />
          Login with Google
        </button>

      </div>
    </div>
  );
};

export default LoginPage;