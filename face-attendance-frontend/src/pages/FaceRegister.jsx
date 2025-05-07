import React, { useRef, useState } from "react";
import Webcam from "react-webcam";
import axios from "axios";
import { toast } from "react-toastify";

const videoConstraints = {
  width: 480,
  height: 360,
  facingMode: "user",
};

const FaceRegister = () => {
  const webcamRef = useRef(null);
  const [name, setName] = useState("");

  const captureAndRegister = async () => {
    if (!name.trim()) {
      toast.error("Please enter a name!");
      return;
    }

    const imageSrc = webcamRef.current.getScreenshot();
    try {
      const res = await axios.post("http://localhost:5000/register", {
        name,
        image: imageSrc,
      });

      if (res.data.success) {
        toast.success("Face registered successfully!");
      } else {
        toast.success(res.data.message || "Registration failed.");
      }
    } catch (error) {
      toast.error("Error during registration.");
    }
  };

  return (
    <div className="min-h-screen bg-[#003049] flex items-center justify-center px-4">
      <div className="bg-[#d3f1f5] p-8 rounded-2xl shadow-2xl w-full max-w-lg space-y-6 text-center">
        <h1 className="text-3xl font-bold text-[#003049]">👤 REGISTER FACE</h1>
        
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          videoConstraints={videoConstraints}
          className="rounded-xl border-4 border-#003049 shadow-md mx-auto"
        />

        <input
          type="text"
          value={name}
          placeholder="Enter your name"
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-2 rounded-xl border border-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

        <button
          onClick={captureAndRegister}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-6 rounded-xl shadow-md transition transform hover:scale-105"
        >
          Register Face⚡
        </button>
      </div>
    </div>
  );
};

export default FaceRegister;
