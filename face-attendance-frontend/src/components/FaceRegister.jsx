import React, { useState, useRef } from "react";
import axios from "axios";
import Webcam from "react-webcam";

const FaceRegister = () => {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const webcamRef = useRef(null);
  const [capturedImage, setCapturedImage] = useState("");

  const videoConstraints = {
    width: 400,
    height: 300,
    facingMode: "user",
  };

  const capture = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setCapturedImage(imageSrc);
  };

  const handleRegister = async () => {
    if (!name || !capturedImage) {
      setMessage("❗ Please enter name and capture a photo.");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/register", {
        name: name,
        image: capturedImage,
      });

      setMessage(res.data.message);
      setName("");
      setCapturedImage("");
    } catch (error) {
      console.error(error);
      setMessage("⚠️ Registration failed.");
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-2xl shadow-md space-y-4 mt-10">
      <h2 className="text-2xl font-bold text-center text-blue-600">Register Student Face</h2>

      <div className="space-y-2">
        <label className="block text-gray-700 font-medium">Name:</label>
        <input
          type="text"
          placeholder="Enter Student Name"
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      {!capturedImage ? (
        <div className="flex flex-col items-center space-y-4">
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            videoConstraints={videoConstraints}
            className="rounded-md"
          />
          <button
            onClick={capture}
            className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md"
          >
            Capture Photo
          </button>
        </div>
      ) : (
        <div className="text-center">
          <img src={capturedImage} alt="Captured" className="rounded-md mb-2" />
          <button
            onClick={() => setCapturedImage("")}
            className="text-sm text-red-500 hover:underline"
          >
            Retake Photo
          </button>
        </div>
      )}

      <button
        onClick={handleRegister}
        className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-md mt-4"
      >
        Register Student Face
      </button>

      {message && <p className="text-center text-green-600 font-semibold mt-4">{message}</p>}
    </div>
  );
};

export default FaceRegister;
