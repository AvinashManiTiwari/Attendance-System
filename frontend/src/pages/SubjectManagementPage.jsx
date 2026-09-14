import { useEffect, useState } from "react";
import { apiFetch } from "../services/api";

const SubjectManagementPage = () => {
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);

  const [classId, setClassId] = useState("");

  const [name, setName] = useState("");
  const [code, setCode] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // ======================================
  // LOAD CLASSES
  // ======================================

  useEffect(() => {
    const loadClasses = async () => {
      try {
        const data = await apiFetch("/classes");
        setClasses(data.classes);
      } catch (error) {
        setError(error.message);
      }
    };

    loadClasses();
  }, []);

  // ======================================
  // LOAD SUBJECTS
  // ======================================

  const loadSubjects = async (selectedClassId) => {

    if (!selectedClassId) {
      setSubjects([]);
      return;
    }

    try {

      const data = await apiFetch(
        `/subjects/class/${selectedClassId}`
      );

      setSubjects(data.subjects);

    } catch (error) {
      setError(error.message);
    }
  };

  // ======================================
  // CLASS CHANGE
  // ======================================

  const handleClassChange = (e) => {

    const id = e.target.value;

    setClassId(id);

    setError("");
    setMessage("");

    loadSubjects(id);
  };

  // ======================================
  // CREATE SUBJECT
  // ======================================

  const handleSubmit = async (e) => {

    e.preventDefault();

    setError("");
    setMessage("");

    if (!classId) {
      setError("Please select a class");
      return;
    }

    setLoading(true);

    try {

      const data = await apiFetch("/subjects", {
        method: "POST",

        body: JSON.stringify({
          name,
          code,
          classId
        })
      });

      setMessage(data.message);

      setName("");
      setCode("");

      loadSubjects(classId);

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
            Manage Subjects
          </h1>

          <p className="text-slate-500 mt-1">
            Add subjects to your classes.
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


        {/* Form */}

        <div className="bg-white rounded-2xl shadow p-5 sm:p-6 mb-6">

          <h2 className="text-xl font-bold mb-5">
            Create New Subject
          </h2>

          <form
            onSubmit={handleSubmit}
            className="space-y-4"
          >

            {/* Class */}

            <div>

              <label className="block text-sm font-medium mb-2">
                Select Class
              </label>

              <select
                value={classId}
                onChange={handleClassChange}
                required
                className="w-full border border-slate-300 rounded-xl px-4 py-3"
              >

                <option value="">
                  Select Class
                </option>

                {classes.map((cls) => (

                  <option
                    key={cls._id}
                    value={cls._id}
                  >
                    {cls.name}
                    {cls.section
                      ? ` - ${cls.section}`
                      : ""}
                  </option>

                ))}

              </select>

            </div>


            {/* Subject Name */}

            <div>

              <label className="block text-sm font-medium mb-2">
                Subject Name
              </label>

              <input
                type="text"
                value={name}
                onChange={(e) =>
                  setName(e.target.value)
                }
                placeholder="Database Management System"
                required
                className="w-full border border-slate-300 rounded-xl px-4 py-3"
              />

            </div>


            {/* Subject Code */}

            <div>

              <label className="block text-sm font-medium mb-2">
                Subject Code
              </label>

              <input
                type="text"
                value={code}
                onChange={(e) =>
                  setCode(e.target.value)
                }
                placeholder="BCS-401"
                className="w-full border border-slate-300 rounded-xl px-4 py-3"
              />

            </div>


            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl disabled:opacity-50"
            >
              {loading
                ? "Creating..."
                : "Create Subject"}
            </button>

          </form>

        </div>


        {/* Subjects */}

        <div className="bg-white rounded-2xl shadow overflow-hidden">

          <div className="p-5 border-b">

            <h2 className="text-xl font-bold">
              Subjects
            </h2>

          </div>


          {!classId ? (

            <div className="p-8 text-center text-slate-500">
              Select a class to see its subjects.
            </div>

          ) : subjects.length === 0 ? (

            <div className="p-8 text-center text-slate-500">
              No subjects created for this class.
            </div>

          ) : (

            <div className="divide-y">

              {subjects.map((subject) => (

                <div
                  key={subject._id}
                  className="p-5 flex items-center justify-between"
                >

                  <div>

                    <h3 className="font-semibold">
                      {subject.name}
                    </h3>

                    {subject.code && (
                      <p className="text-sm text-slate-500">
                        Code: {subject.code}
                      </p>
                    )}

                  </div>

                </div>

              ))}

            </div>

          )}

        </div>

      </div>

    </div>
  );
};

export default SubjectManagementPage;