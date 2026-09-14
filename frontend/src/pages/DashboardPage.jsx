import { Link } from "react-router";
import { useAuth } from "../context/AuthContext";


const DashboardPage = () => {

  const {
    user,
    logout
  } = useAuth();


  return (
    <div className="min-h-screen bg-slate-100">

      <header className="bg-white border-b">

        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">

          <h1 className="font-bold text-xl">
            Attendance SaaS
          </h1>

          <button
            onClick={logout}
            className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm"
          >
            Logout
          </button>

        </div>

      </header>


      <main className="max-w-6xl mx-auto px-4 py-8">

        <div className="mb-8">

          <h2 className="text-2xl font-bold">
            Welcome, {user?.name}
          </h2>

          <p className="text-slate-500">
            Role: {user?.role}
          </p>

        </div>


        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">

          <Link
            to="/attendance"
            className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition"
          >
            <h3 className="font-bold text-lg">
              Mark Attendance
            </h3>

            <p className="text-slate-500 mt-2">
              Mark today's student attendance.
            </p>
          </Link>


          <Link
            to="/reports"
            className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition"
          >
            <h3 className="font-bold text-lg">
              Attendance Reports
            </h3>

            <p className="text-slate-500 mt-2">
              View attendance percentages.
            </p>
          </Link>


{user?.role !== "CR" && (
  <Link
    to="/students"
    className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition"
  >
    <h3 className="font-bold text-lg">
      Manage Students
    </h3>

    <p className="text-slate-500 mt-2">
      Add and view students.
    </p>
  </Link>
)}


{user?.role !== "CR" && (
  <Link
    to="/classes"
    className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition"
  >
    <h3 className="font-bold text-lg">
      Manage Classes
    </h3>

    <p className="text-slate-500 mt-2">
      Create and manage classes.
    </p>
  </Link>
)}


{user?.role !== "CR" && (
  <Link
    to="/subjects"
    className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition"
  >
    <h3 className="font-bold text-lg">
      Manage Subjects
    </h3>

    <p className="text-slate-500 mt-2">
      Add subjects to classes.
    </p>
  </Link>
)}

{user?.role !== "CR" && (
  <Link
    to="/assignments"
    className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition"
  >
    <h3 className="font-bold text-lg">
      Assignment Management
    </h3>

    <p className="text-slate-500 mt-2">
      Create and manage student assignments.
    </p>
  </Link>
)}

        </div>

      </main>

    </div>
  );
};


export default DashboardPage;