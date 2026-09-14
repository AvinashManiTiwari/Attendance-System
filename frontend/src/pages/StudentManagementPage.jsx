import { useEffect, useState } from "react";
import { apiFetch } from "../services/api";

const StudentManagementPage = () => {
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);

  const [classId, setClassId] = useState("");

  const [name, setName] = useState("");
  const [rollNumber, setRollNumber] = useState("");
  const [email, setEmail] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

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
  // LOAD STUDENTS
  // ======================================

  const loadStudents = async (selectedClassId) => {
    if (!selectedClassId) {
      setStudents([]);
      return;
    }

    try {
      const data = await apiFetch(
        `/students/class/${selectedClassId}`
      );

      setStudents(data.students);
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

    loadStudents(id);
  };

  // ======================================
  // ADD STUDENT
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
      const data = await apiFetch("/students", {
        method: "POST",

        body: JSON.stringify({
          name,
          rollNumber,
          email,
          classId
        })
      });

      setMessage(data.message);

      // Clear form
      setName("");
      setRollNumber("");
      setEmail("");

      // Refresh student list
      loadStudents(classId);

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
            Manage Students
          </h1>

          <p className="text-slate-500 mt-1">
            Add and manage students in your classes.
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


        {/* Add Student Form */}

        <div className="bg-white rounded-2xl shadow p-5 sm:p-6 mb-6">

          <h2 className="text-xl font-bold mb-5">
            Add New Student
          </h2>


          <form
            onSubmit={handleSubmit}
            className="space-y-4"
          >

            {/* Class */}

            <div>

              <label className="block text-sm font-medium mb-2">
                Class
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


            {/* Name */}

            <div>

              <label className="block text-sm font-medium mb-2">
                Student Name
              </label>

              <input
                type="text"
                value={name}
                onChange={(e) =>
                  setName(e.target.value)
                }
                placeholder="Enter student name"
                required
                className="w-full border border-slate-300 rounded-xl px-4 py-3"
              />

            </div>


            {/* Roll Number */}

            <div>

              <label className="block text-sm font-medium mb-2">
                Roll Number
              </label>

              <input
                type="text"
                value={rollNumber}
                onChange={(e) =>
                  setRollNumber(e.target.value)
                }
                placeholder="Enter roll number"
                required
                className="w-full border border-slate-300 rounded-xl px-4 py-3"
              />

            </div>


            {/* Email */}

            <div>

              <label className="block text-sm font-medium mb-2">
                Email
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                placeholder="student@gmail.com"
                required
                className="w-full border border-slate-300 rounded-xl px-4 py-3"
              />

            </div>


            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl disabled:opacity-50"
            >
              {loading
                ? "Adding Student..."
                : "Add Student"}
            </button>

          </form>

        </div>


        {/* Student List */}

        <div className="bg-white rounded-2xl shadow overflow-hidden">

          <div className="p-5 border-b">

            <h2 className="text-xl font-bold">
              Students
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              {students.length} student(s)
            </p>

          </div>


          {students.length === 0 ? (

            <div className="p-8 text-center text-slate-500">
              Select a class to see students.
            </div>

          ) : (

            <div className="overflow-x-auto">

              <table className="w-full">

                <thead className="bg-slate-50">

                  <tr>

                    <th className="text-left p-4">
                      Roll No
                    </th>

                    <th className="text-left p-4">
                      Name
                    </th>

                    <th className="text-left p-4">
                      Email
                    </th>

                  </tr>

                </thead>


                <tbody>

                  {students.map((student) => (

                    <tr
                      key={student._id}
                      className="border-t"
                    >

                      <td className="p-4">
                        {student.rollNumber}
                      </td>

                      <td className="p-4 font-medium">
                        {student.name}
                      </td>

                      <td className="p-4 text-slate-500">
                        {student.email || "-"}
                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          )}

        </div>

      </div>

    </div>
  );
};

export default StudentManagementPage;