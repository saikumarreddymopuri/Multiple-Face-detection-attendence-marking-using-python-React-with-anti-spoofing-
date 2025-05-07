import React, { useEffect, useState } from "react";
import axios from "axios";

const AttendanceLog = () => {
  const [logs, setLogs] = useState([]);

  const fetchLogs = () => {
    axios
      .get("http://localhost:5000/attendance")
      .then((res) => {
        setLogs(res.data.attendance);
      })
      .catch((err) => {
        console.error("❌ Error fetching attendance log", err);
      });
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">📋 Attendance Log</h2>
          <button
            onClick={fetchLogs}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md shadow transition-all duration-200"
          >
            🔄 Refresh
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-gray-700 border border-gray-300 rounded-xl overflow-hidden">
            <thead>
              <tr className="bg-gray-200 text-left">
                <th className="px-6 py-3 border-b border-gray-300">👤 Name</th>
                <th className="px-6 py-3 border-b border-gray-300">🕒 Time</th>
              </tr>
            </thead>
            <tbody>
              {logs.length > 0 ? (
                logs.map((log, idx) => (
                  <tr key={idx} className="hover:bg-gray-100 transition-all">
                    <td className="px-6 py-3 border-b border-gray-200">{log.Name}</td>
                    <td className="px-6 py-3 border-b border-gray-200">{log.Time}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="2" className="text-center px-6 py-4 text-gray-500">
                    No attendance logs yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AttendanceLog;
