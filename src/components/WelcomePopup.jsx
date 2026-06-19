"use client";

import { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import { motion, AnimatePresence } from "framer-motion";

export default function WelcomePopup() {
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const isVisited = localStorage.getItem("welcomeShown");

    if (!isVisited) {
      setTimeout(() => {
        setShowPopup(true);
      }, 3000);
    }
  }, []);

  const closePopup = () => {
    setShowPopup(false);
    localStorage.setItem("welcomeShown", "true");
  };

  return (
    <AnimatePresence>
      {showPopup && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
        >
          <motion.div
            initial={{ scale: 0.7, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.7, y: 50 }}
            className="relative w-[90%] max-w-md rounded-2xl bg-white p-8 text-center shadow-xl"
          >
            {/* Close Button */}
            <button
              onClick={closePopup}
              className="absolute right-4 top-4 text-gray-500 hover:text-black"
            >
              <IoClose size={25} />
            </button>

            <h2 className="text-3xl font-bold text-gray-800">
              Welcome 🎉
            </h2>

            <p className="mt-3 text-gray-600">
              Welcome to our website. We are happy to have you here!
            </p>

            <button
              onClick={closePopup}
              className="mt-6 rounded-lg bg-black px-6 py-3 text-white hover:bg-gray-800"
            >
              Get Started
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}