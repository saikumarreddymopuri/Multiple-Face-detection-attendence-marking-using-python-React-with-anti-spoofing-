import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-100 via-white to-blue-200">
      {/* Navbar */}
      <header className="bg-white shadow-md py-4 px-6 flex justify-between items-center">
        <h1 className="text-xl font-bold text-blue-700">🎓 Smart Multi Face Detection with Attendence ⚡⚡⚡</h1>
        <nav className="space-x-4">
          <Link to="/" className="text-blue-700 hover:underline">Home</Link>
          <Link to="/register" className="text-blue-700 hover:underline">Register</Link>
          <Link to="/detect" className="text-blue-700 hover:underline">Detect</Link>
          <Link to="/attendance" className="text-blue-700 hover:underline">Logs</Link>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col justify-center items-center text-center px-4">
        <h2 className="text-4xl font-bold text-blue-800 mb-8 drop-shadow-md">
          Welcome to the Smart Face Attendance System 📸
        </h2>

        <div className="grid gap-6 w-full max-w-md">
          <Link
            to="/register"
            className="bg-blue-600 text-white px-6 py-3 rounded-xl shadow-lg hover:bg-blue-700 transition"
          >
            👤 Register Student Face
          </Link>
          <Link
            to="/detect"
            className="bg-green-600 text-white px-6 py-3 rounded-xl shadow-lg hover:bg-green-700 transition"
          >
            🕵🏻 Detect & Mark Attendance
          </Link>
          <Link
            to="/attendance"
            className="bg-indigo-600 text-white px-6 py-3 rounded-xl shadow-lg hover:bg-indigo-700 transition"
          >
            📋 View Attendance Log
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white text-center text-gray-500 py-4 text-sm shadow-inner">
        Developed by{" "}
        <span className="font-semibold">M.Saikumar Reddy</span>,{" "}
        <span className="font-semibold">M.Karthik</span>, and{" "}
        <span className="font-semibold">P.SaiSourya</span>
      </footer>
    </div>
  );
};

export default Home;
