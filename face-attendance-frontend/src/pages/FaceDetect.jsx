import React, { useRef, useState } from "react";
import Webcam from "react-webcam";
import axios from "axios";
import { toast } from 'react-toastify';

const FaceDetect = () => {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [matchedFaces, setMatchedFaces] = useState([]); // store matched faces

  const videoConstraints = {
    width: 640,
    height: 480,
    facingMode: "user",
  };

  const captureAndDetect = async () => {
    const screenshot = webcamRef.current.getScreenshot();
    toast.info("🕵🏻 Detecting...");

    try {
      const res = await axios.post("http://localhost:5000/detect", {
        image: screenshot,
      });

      const { matched } = res.data;

      if (!matched || matched.length === 0) {
        toast.error("❌ No face detected!");
        setMatchedFaces([]); // reset matched faces
        return;
      }

      setMatchedFaces(matched); // store matched faces for later

      const ctx = canvasRef.current.getContext("2d");
      const img = new Image();
      img.src = screenshot;

      img.onload = () => {
        canvasRef.current.width = img.width;
        canvasRef.current.height = img.height;

        ctx.drawImage(img, 0, 0, img.width, img.height);

        matched.forEach((face) => {
          const [top, right, bottom, left] = face.box;
          const name = face.name || "Unknown";

          ctx.beginPath();
          ctx.rect(left, top, right - left, bottom - top);
          ctx.lineWidth = 2;
          ctx.strokeStyle = "#04e762";  // Dark Gray Border
          ctx.stroke();

          ctx.fillStyle = "rgba(0, 0, 0, 0.9)"; // Semi-transparent background for text
          ctx.fillRect(left, top - 22, name.length * 10, 20);
          ctx.fillStyle = "#04e762"; // Light text color for visibility
          ctx.font = "16px Arial";
          ctx.fillText(name, left + 5, top - 7);
        });

        toast.success(`✅ ${matched.length} Face(s) Detected!`);
      };
    } catch (err) {
      console.error(err);
      toast.error("❌ Error while detecting face.");
    }
  };

  const handleMarkAttendance = async () => {
    try {
      const names = matchedFaces.map((face) => face.name);
      const res = await axios.post("http://localhost:5000/mark_attendance", {
        names,
      });
      toast.info(res.data.message);
    } catch (err) {
      console.error(err);
      toast.error("❌ Error while marking attendance.");
    }
  };

  return (
    <div className="p-6 flex flex-col items-center gap-6 bg-[#343a40] min-h-screen">
      <h1 className="text-3xl font-bold text-[#fca311]">🕵🏻 FACE DETECTION</h1>

      <div className="relative">
        <Webcam
          ref={webcamRef}
          audio={false}
          screenshotFormat="image/jpeg"
          width={640}
          height={480}
          videoConstraints={videoConstraints}
          className="rounded-md border-4 border-[#ced4da]"
        />
        <canvas
          ref={canvasRef}
          className="absolute top-0 left-0"
          style={{ width: 640, height: 480 }}
        />
      </div>

      <div className="flex gap-6">
        <button
          onClick={captureAndDetect}
          className="bg-blue-600 text-white px-6 py-3 rounded-xl shadow-md hover:bg-blue-700 transition-all"
        >
          Detect Faces
        </button>

        <button
          onClick={handleMarkAttendance}
          disabled={matchedFaces.length === 0}
          className={`${
            matchedFaces.length === 0 ? "bg-green-600" : "bg-green-600 hover:bg-green-700"
          } text-white px-6 py-3 rounded-xl shadow-md transition-all`}
        >
          Mark Attendance
        </button>
      </div>
    </div>
  );
};

export default FaceDetect;
