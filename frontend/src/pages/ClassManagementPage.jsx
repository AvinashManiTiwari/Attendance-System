import { useEffect, useState } from "react";
import { apiFetch } from "../services/api";

const ClassManagementPage = () => {
  const [classes, setClasses] = useState([]);

  const [name, setName] = useState("");
  const [section, setSection] = useState("");
  const [year, setYear] = useState("");
  const [academicYear, setAcademicYear] = useState("");


  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // ======================================
  // LOAD CLASSES
  // ======================================

  const loadClasses = async () => {
    try {
      const data = await apiFetch("/classes");
      setClasses(data.classes);
    } catch (error) {
      setError(error.message);
    }
  };

  useEffect(() => {
    loadClasses();
  }, []);

  // ======================================
  // CREATE CLASS
  // ======================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setMessage("");
    setLoading(true);

    try {
      const data = await apiFetch("/classes", {
        method: "POST",

        body: JSON.stringify({
          name,
          section,
          year,
          academicYear
          
        })
      });

      setMessage(data.message);

      setName("");
      setSection("");
      setYear("");
      setAcademicYear("");

      loadClasses();

    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-6">

      <div className="max-w-5xl mx-auto">

        {/* Header */}

        <div className="mb-6">

          <h1 className="text-2xl sm:text-3xl font-bold">
            Manage Classes
          </h1>

          <p className="text-slate-500 mt-1">
            Create and manage classes.
          </p>

        </div>


        {/* Messages */}

        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl">
            {error}
          </div>
        )}

        {message && (
          <div className="mb-4 bg-green-50 border border-green-200 text-green-600 p-4 rounded-xl">
            {message}
          </div>
        )}


        {/* Create Class */}

        <div className="bg-white rounded-2xl shadow p-5 sm:p-6 mb-6">

          <h2 className="text-xl font-bold mb-5">
            Create New Class
          </h2>

          <form
            onSubmit={handleSubmit}
            className="space-y-4"
          >

            <div>

              <label className="block text-sm font-medium mb-2">
                Class Name
              </label>

              <input
                type="text"
                value={name}
                onChange={(e) =>
                  setName(e.target.value)
                }
                placeholder="CSE 4th Year"
                required
                className="w-full border border-slate-300 rounded-xl px-4 py-3"
              />

            </div>


            <div>

              <label className="block text-sm font-medium mb-2">
                Section
              </label>

              <input
                type="text"
                value={section}
                onChange={(e) =>
                  setSection(e.target.value)
                }
                placeholder="CSE"
                className="w-full border border-slate-300 rounded-xl px-4 py-3"
              />

            </div>


             <div>

              <label className="block text-sm font-medium mb-2">
                Year
              </label>

              <input
                type="text"
                value={year}
                onChange={(e) =>
                  setYear(e.target.value)
                }
                placeholder="4th Year"
                className="w-full border border-slate-300 rounded-xl px-4 py-3"
              />

            </div> 


<div>
  <label className="block text-sm font-medium mb-2">
    Academic Year
  </label>

  <input
    type="text"
    value={academicYear}
    onChange={(e) => setAcademicYear(e.target.value)}
    placeholder="e.g. 2026-27"
    className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
    required
  />
</div>


            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl disabled:opacity-50"
            >
              {loading
                ? "Creating..."
                : "Create Class"}
            </button>

          </form>

        </div>


        {/* Classes */}

        <div className="bg-white rounded-2xl shadow overflow-hidden">

          <div className="p-5 border-b">

            <h2 className="text-xl font-bold">
              Existing Classes
            </h2>

          </div>


          {classes.length === 0 ? (

            <div className="p-8 text-center text-slate-500">
              No classes created yet.
            </div>

          ) : (

            <div className="divide-y">

              {classes.map((cls) => (

                <div
                  key={cls._id}
                  className="p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2"
                >

                  <div>

                    <h3 className="font-semibold">
                      {cls.name}
                    </h3>

                    {cls.section && (
                      <p className="text-sm text-slate-500">
                        Section: {cls.section}
                      </p>
                    )}

                  </div>

                  {cls.year && (
                    <span className="text-sm bg-slate-100 px-3 py-1 rounded-full">
                      {cls.year}
                    </span>
                  )}

                </div>

              ))}

            </div>

          )}

        </div>

      </div>

    </div>
  );
};

export default ClassManagementPage;