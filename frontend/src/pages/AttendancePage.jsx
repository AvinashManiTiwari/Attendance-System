import { useEffect, useState } from "react";

import { apiFetch } from "../services/api";

import { useAuth } from "../context/AuthContext";


const AttendancePage = () => {

  const { user } = useAuth();


  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [students, setStudents] = useState([]);

  const [classId, setClassId] = useState("");
  const [subjectId, setSubjectId] = useState("");

  const [date, setDate] = useState(
    new Date().toLocaleDateString("en-CA", {
      timeZone: "Asia/Kolkata"
    })
  );

  const [attendance, setAttendance] = useState({});

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");


  // ======================================
  // LOAD CLASSES
  // ======================================

  useEffect(() => {

    const loadClasses = async () => {

      try {

        const data = await apiFetch(
          "/classes"
        );

        setClasses(data.classes || []);

      } catch (error) {

        setError(error.message);

      }

    };


    loadClasses();

  }, []);


  // ======================================
  // LOAD SUBJECTS
  // ======================================

  useEffect(() => {

    if (!classId) {

      setSubjects([]);
      return;

    }


    const loadSubjects = async () => {

      try {

        const data = await apiFetch(
          `/subjects/class/${classId}`
        );

        setSubjects(data.subjects || []);

      } catch (error) {

        setError(error.message);

      }

    };


    loadSubjects();

  }, [classId]);


  // ======================================
  // LOAD STUDENTS
  // ======================================

  useEffect(() => {

    if (!classId) {

      setStudents([]);
      return;

    }


    const loadStudents = async () => {

      try {

        const data = await apiFetch(
          `/students/class/${classId}`
        );


        setStudents(data.students || []);


        // Default everyone Absent
        const initialAttendance = {};


        (data.students || []).forEach(student => {

          initialAttendance[
            student._id
          ] = "Absent";

        });


        setAttendance(initialAttendance);

      } catch (error) {

        setError(error.message);

      }

    };


    loadStudents();

  }, [classId]);


  // ======================================
  // TOGGLE ATTENDANCE
  // ======================================

  const toggleAttendance = (studentId) => {

    setAttendance(prev => ({

      ...prev,

      [studentId]:
        prev[studentId] === "Absent"
          ? "Present"
          : "Absent"

    }));

  };


  // ======================================
  // SUBMIT ATTENDANCE
  // ======================================

  const handleSubmit = async () => {

    setError("");
    setMessage("");


    if (!classId || !subjectId || !date) {

      setError(
        "Please select class, subject and date"
      );

      return;

    }


    if (students.length === 0) {

      setError(
        "No students found"
      );

      return;

    }


    setLoading(true);


    try {

      const records = students.map(student => ({

        studentId: student._id,

        status:
          attendance[student._id] || "Absent"

      }));


      const data = await apiFetch(
        "/attendance",
        {

          method: "POST",

          body: JSON.stringify({

            date,
            classId,
            subjectId,
            records

          })

        }
      );


      setMessage(
        data.message || "Attendance saved successfully"
      );


    } catch (error) {

      setError(error.message);

    } finally {

      setLoading(false);

    }

  };


  // ======================================
  // UI
  // ======================================

  return (

    <div className="min-h-screen bg-slate-100 px-4 py-6">

      <div className="max-w-4xl mx-auto">


        {/* Header */}

        <div className="mb-6">

          <h1 className="text-2xl sm:text-3xl font-bold">

            Mark Attendance

          </h1>


          <p className="text-slate-500 mt-1">

            Logged in as {user?.role}

          </p>

        </div>


        {/* Filters */}

        <div className="bg-white rounded-2xl shadow p-4 sm:p-6 mb-6">

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">


            {/* Class */}

            <div>

              <label className="block text-sm font-medium mb-2">

                Class

              </label>


              <select

                value={classId}

                onChange={(e) => {

                  setClassId(e.target.value);

                  setSubjectId("");

                  setError("");

                  setMessage("");

                }}

                className="w-full border rounded-xl px-3 py-3"

              >

                <option value="">

                  Select Class

                </option>


                {classes.map(cls => (

                  <option
                    key={cls._id}
                    value={cls._id}
                  >

                    {cls.name}

                  </option>

                ))}

              </select>

            </div>


            {/* Subject */}

            <div>

              <label className="block text-sm font-medium mb-2">

                Subject

              </label>


              <select

                value={subjectId}

                onChange={(e) =>
                  setSubjectId(e.target.value)
                }

                disabled={!classId}

                className="w-full border rounded-xl px-3 py-3 disabled:bg-slate-100"

              >

                <option value="">

                  Select Subject

                </option>


                {subjects.map(subject => (

                  <option
                    key={subject._id}
                    value={subject._id}
                  >

                    {subject.name}

                  </option>

                ))}

              </select>

            </div>


            {/* Date */}

            <div>

              <label className="block text-sm font-medium mb-2">

                Date

              </label>


              <input

                type="date"

                value={date}

                onChange={(e) =>
                  setDate(e.target.value)
                }

                disabled={user?.role === "CR"}

                className="w-full border rounded-xl px-3 py-3 disabled:bg-slate-100"

              />


              {user?.role === "CR" && (

                <p className="text-xs text-slate-500 mt-1">

                  CR can only mark today's attendance.

                </p>

              )}

            </div>

          </div>

        </div>


        {/* Error */}

        {error && (

          <div className="mb-4 p-4 rounded-xl bg-red-50 text-red-600">

            {error}

          </div>

        )}


        {/* Success */}

        {message && (

          <div className="mb-4 p-4 rounded-xl bg-green-50 text-green-600">

            {message}

          </div>

        )}


        {/* Student List */}

        {students.length > 0 && (

          <div className="bg-white rounded-2xl shadow overflow-hidden">


            <div className="p-4 border-b">

              <h2 className="font-bold">

                Students ({students.length})

              </h2>

            </div>


            <div>

              {students.map(student => {

                const status =
                  attendance[student._id] || "Absent";


                return (

                  <div

                    key={student._id}

                    className="flex items-center justify-between gap-3 p-4 border-b last:border-b-0"

                  >

                    <div className="min-w-0">

                      <p className="font-medium truncate">

                        {student.name}

                      </p>


                      <p className="text-sm text-slate-500">

                        Roll No: {student.rollNumber}

                      </p>

                    </div>


                    <button

                      type="button"

                      onClick={() =>
                        toggleAttendance(student._id)
                      }

                      className={`shrink-0 px-4 py-2 rounded-full text-sm font-semibold ${
                        status === "Present"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}

                    >

                      {status}

                    </button>

                  </div>

                );

              })}

            </div>


            {/* Submit */}

            <div className="p-4">

              <button

                type="button"

                onClick={handleSubmit}

                disabled={loading}

                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl disabled:opacity-60"

              >

                {loading
                  ? "Saving..."
                  : "Submit Attendance"}

              </button>

            </div>


          </div>

        )}


        {/* No Students */}

        {classId && students.length === 0 && (

          <div className="bg-white rounded-2xl p-8 text-center text-slate-500">

            No students found in this class.

          </div>

        )}

      </div>

    </div>

  );

};


export default AttendancePage;