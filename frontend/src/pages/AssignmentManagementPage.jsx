import { useEffect, useState } from "react";
import { Link } from "react-router";
import { apiFetch } from "../services/api";

const AssignmentManagementPage = () => {
  const [assignments, setAssignments] = useState([]);

  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);

  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [totalMarks, setTotalMarks] = useState("");

  const [showForm, setShowForm] = useState(false);

  // Which assignment's students are currently visible
  const [openAssignment, setOpenAssignment] = useState(null);

  // Temporary status and marks before Save
  const [submissionData, setSubmissionData] = useState({});

  const [loading, setLoading] = useState(false);
  const [savingStudent, setSavingStudent] = useState(null);
  const [message, setMessage] = useState("");


  const [statusFilter, setStatusFilter] = useState({});

  
  // =========================
  // LOAD CLASSES
  // =========================
  const loadClasses = async () => {
    try {
      const data = await apiFetch("/classes");
      setClasses(data.classes || []);
    } catch (error) {
      console.error("Class loading error:", error);
    }
  };

  // =========================
  // LOAD SUBJECTS
  // =========================
  const loadSubjects = async (classId) => {
    if (!classId) {
      setSubjects([]);
      return;
    }

    try {
      const data = await apiFetch(`/subjects/class/${classId}`);
      setSubjects(data.subjects || []);
    } catch (error) {
      console.error("Subject loading error:", error);
      setSubjects([]);
    }
  };

  // =========================
  // LOAD ASSIGNMENTS
  // =========================
  const loadAssignments = async () => {
    try {
      const data = await apiFetch("/assignments");
      setAssignments(data.assignments || []);
    } catch (error) {
      console.error("Assignment loading error:", error);
    }
  };

  // =========================
  // INITIAL LOAD
  // =========================
  useEffect(() => {
    loadClasses();
    loadAssignments();
  }, []);

  // =========================
  // CLASS CHANGE
  // =========================
  const handleClassChange = (e) => {
    const classId = e.target.value;

    setSelectedClass(classId);
    setSelectedSubject("");

    loadSubjects(classId);
  };

  // =========================
  // CREATE ASSIGNMENT
  // =========================
  const handleCreateAssignment = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");

    try {
      const data = await apiFetch("/assignments", {
        method: "POST",
        body: JSON.stringify({
          title,
          description,
          classId: selectedClass,
          subjectId: selectedSubject,
          dueDate,
          totalMarks: Number(totalMarks)
        })
      });

      setMessage(data.message);

      // Reset form
      setTitle("");
      setDescription("");
      setSelectedClass("");
      setSelectedSubject("");
      setDueDate("");
      setTotalMarks("");

      setSubjects([]);
      setShowForm(false);

      await loadAssignments();

    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // OPEN / CLOSE SUBMISSIONS
  // =========================
  const toggleSubmissions = (assignment) => {
    if (openAssignment === assignment._id) {
      setOpenAssignment(null);
      return;
    }

    setOpenAssignment(assignment._id);

    // Prepare local data for every student
    const initialData = {};

    (assignment.submissions || []).forEach((submission) => {
      const studentId =
        submission.student?._id || submission.student;

      initialData[studentId] = {
        status: submission.status || "Not Submitted",
        marks:
          submission.marks !== null &&
          submission.marks !== undefined
            ? submission.marks
            : ""
      };
    });

    setSubmissionData(initialData);
  };

  // =========================
  // CHANGE STATUS
  // =========================
  const handleStatusChange = (studentId, status) => {
    setSubmissionData((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        status
      }
    }));
  };

  // =========================
  // CHANGE MARKS
  // =========================
  const handleMarksChange = (studentId, marks) => {
    setSubmissionData((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        marks
      }
    }));
  };

  // =========================
  // SAVE STUDENT SUBMISSION
  // =========================
  const handleSaveSubmission = async (
    assignment,
    studentId
  ) => {
    const data = submissionData[studentId];

    if (!data) return;

    // Validate marks
    if (data.marks !== "") {
      const marks = Number(data.marks);

      if (marks < 0 || marks > assignment.totalMarks) {
        setMessage(
          `Marks must be between 0 and ${assignment.totalMarks}`
        );
        return;
      }
    }

    setSavingStudent(studentId);
    setMessage("");

    try {
      const response = await apiFetch(
        `/assignments/${assignment._id}/student/${studentId}`,
        {
          method: "PATCH",
          body: JSON.stringify({
            status: data.status,
            marks:
              data.marks === ""
                ? undefined
                : Number(data.marks)
          })
        }
      );

      setMessage(response.message);

      // Reload assignment data
      await loadAssignments();

    } catch (error) {
      setMessage(error.message);
    } finally {
      setSavingStudent(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100">

      {/* HEADER */}
      <header className="bg-white border-b">

        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">

          <div>
            <h1 className="font-bold text-xl">
              Assignment Management
            </h1>

            <p className="text-sm text-slate-500">
              Create and manage student assignments
            </p>
          </div>

          <Link
            to="/dashboard"
            className="text-sm bg-slate-200 px-4 py-2 rounded-lg hover:bg-slate-300"
          >
            Dashboard
          </Link>

        </div>

      </header>


      <main className="max-w-6xl mx-auto px-4 py-8">

        {/* TOP SECTION */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">

          <div>
            <h2 className="text-2xl font-bold">
              Assignments
            </h2>

            <p className="text-slate-500 mt-1">
              Create assignments and track student submissions.
            </p>
          </div>

          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 text-white px-5 py-3 rounded-xl hover:bg-blue-700"
          >
            {showForm
              ? "Close Form"
              : "+ Create Assignment"}
          </button>

        </div>


        {/* MESSAGE */}
        {message && (
          <div className="bg-white border p-4 rounded-xl mb-6">
            {message}
          </div>
        )}


        {/* CREATE FORM */}
        {showForm && (
          <div className="bg-white rounded-2xl shadow p-6 mb-8">

            <h3 className="text-xl font-bold mb-6">
              Create New Assignment
            </h3>

            <form
              onSubmit={handleCreateAssignment}
              className="space-y-5"
            >

              {/* TITLE */}
              <div>
                <label className="block font-medium mb-2">
                  Assignment Title
                </label>

                <input
                  type="text"
                  value={title}
                  onChange={(e) =>
                    setTitle(e.target.value)
                  }
                  placeholder="Enter assignment title"
                  required
                  className="w-full border rounded-xl px-4 py-3"
                />
              </div>


              {/* DESCRIPTION */}
              <div>
                <label className="block font-medium mb-2">
                  Description
                </label>

                <textarea
                  value={description}
                  onChange={(e) =>
                    setDescription(e.target.value)
                  }
                  placeholder="Enter assignment description"
                  rows="4"
                  className="w-full border rounded-xl px-4 py-3"
                />
              </div>


              {/* CLASS + SUBJECT */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                {/* CLASS */}
                <div>
                  <label className="block font-medium mb-2">
                    Class
                  </label>

                  <select
                    value={selectedClass}
                    onChange={handleClassChange}
                    required
                    className="w-full border rounded-xl px-4 py-3"
                  >
                    <option value="">
                      Select Class
                    </option>

                    {classes.map((item) => (
                      <option
                        key={item._id}
                        value={item._id}
                      >
                        {item.name}
                        {item.section
                          ? ` - ${item.section}`
                          : ""}
                      </option>
                    ))}
                  </select>
                </div>


                {/* SUBJECT */}
                <div>
                  <label className="block font-medium mb-2">
                    Subject
                  </label>

                  <select
                    value={selectedSubject}
                    onChange={(e) =>
                      setSelectedSubject(e.target.value)
                    }
                    required
                    disabled={!selectedClass}
                    className="w-full border rounded-xl px-4 py-3"
                  >
                    <option value="">
                      Select Subject
                    </option>

                    {subjects.map((subject) => (
                      <option
                        key={subject._id}
                        value={subject._id}
                      >
                        {subject.name}
                        {subject.code
                          ? ` (${subject.code})`
                          : ""}
                      </option>
                    ))}
                  </select>
                </div>

              </div>


              {/* DATE + MARKS */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                {/* DUE DATE */}
                <div>
                  <label className="block font-medium mb-2">
                    Due Date
                  </label>

                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) =>
                      setDueDate(e.target.value)
                    }
                    required
                    className="w-full border rounded-xl px-4 py-3"
                  />
                </div>


                {/* TOTAL MARKS */}
                <div>
                  <label className="block font-medium mb-2">
                    Total Marks
                  </label>

                  <input
                    type="number"
                    min="0"
                    value={totalMarks}
                    onChange={(e) =>
                      setTotalMarks(e.target.value)
                    }
                    placeholder="e.g. 20"
                    required
                    className="w-full border rounded-xl px-4 py-3"
                  />
                </div>

              </div>


              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 disabled:opacity-50"
              >
                {loading
                  ? "Creating..."
                  : "Create Assignment"}
              </button>

            </form>

          </div>
        )}


        {/* ASSIGNMENT LIST */}
        <div className="space-y-5">

          {assignments.length === 0 ? (

            <div className="bg-white rounded-2xl shadow p-8 text-center">

              <h3 className="font-bold text-lg">
                No Assignments Found
              </h3>

              <p className="text-slate-500 mt-2">
                Create your first assignment.
              </p>

            </div>

          ) : (

            assignments.map((assignment) => {

              const submissions =
                assignment.submissions || [];

              const totalStudents =
                submissions.length;

              const submitted =
                submissions.filter(
                  (item) =>
                    item.status === "Submitted"
                ).length;

              const late =
                submissions.filter(
                  (item) =>
                    item.status === "Late"
                ).length;

              const notSubmitted =
                submissions.filter(
                  (item) =>
                    item.status === "Not Submitted"
                ).length;

              return (
                <div
                  key={assignment._id}
                  className="bg-white rounded-2xl shadow p-6"
                >

                  {/* ASSIGNMENT HEADER */}
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">

                    <div>

                      <h3 className="text-xl font-bold">
                        {assignment.title}
                      </h3>

                      <p className="text-slate-500 mt-2">
                        {assignment.description ||
                          "No description provided"}
                      </p>

                    </div>

                    <div className="text-sm text-slate-500">
                      Due:{" "}
                      {new Date(
                        assignment.dueDate
                      ).toLocaleDateString()}
                    </div>

                  </div>


                  {/* BASIC INFO */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">

                    <div className="bg-slate-100 rounded-xl p-4">
                      <p className="text-sm text-slate-500">
                        Class
                      </p>

                      <p className="font-bold mt-1">
                        {assignment.class?.name || "-"}
                      </p>
                    </div>


                    <div className="bg-slate-100 rounded-xl p-4">
                      <p className="text-sm text-slate-500">
                        Subject
                      </p>

                      <p className="font-bold mt-1">
                        {assignment.subject?.name || "-"}
                      </p>
                    </div>


                    <div className="bg-slate-100 rounded-xl p-4">
                      <p className="text-sm text-slate-500">
                        Total Marks
                      </p>

                      <p className="font-bold mt-1">
                        {assignment.totalMarks}
                      </p>
                    </div>


                    <div className="bg-slate-100 rounded-xl p-4">
                      <p className="text-sm text-slate-500">
                        Students
                      </p>

                      <p className="font-bold mt-1">
                        {totalStudents}
                      </p>
                    </div>

                  </div>


                  {/* SUBMISSION SUMMARY */}
                  <div className="flex flex-wrap gap-3 mt-6">

  <button
    onClick={() => {
      setStatusFilter((prev) => ({
        ...prev,
        [assignment._id]:
          prev[assignment._id] === "Submitted"
            ? null
            : "Submitted"
      }));
    }}
    className={`px-4 py-2 rounded-lg text-sm transition ${
      statusFilter[assignment._id] === "Submitted"
        ? "bg-green-600 text-white"
        : "bg-green-100 text-green-700 hover:bg-green-200"
    }`}
  >
    Submitted: {submitted}
  </button>


  <button
    onClick={() => {
      setStatusFilter((prev) => ({
        ...prev,
        [assignment._id]:
          prev[assignment._id] === "Late"
            ? null
            : "Late"
      }));
    }}
    className={`px-4 py-2 rounded-lg text-sm transition ${
      statusFilter[assignment._id] === "Late"
        ? "bg-yellow-500 text-white"
        : "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
    }`}
  >
    Late: {late}
  </button>


  <button
    onClick={() => {
      setStatusFilter((prev) => ({
        ...prev,
        [assignment._id]:
          prev[assignment._id] === "Not Submitted"
            ? null
            : "Not Submitted"
      }));
    }}
    className={`px-4 py-2 rounded-lg text-sm transition ${
      statusFilter[assignment._id] === "Not Submitted"
        ? "bg-red-600 text-white"
        : "bg-red-100 text-red-700 hover:bg-red-200"
    }`}
  >
    Not Submitted: {notSubmitted}
  </button>

</div>



{statusFilter[assignment._id] && (
  <div className="mt-5 border rounded-xl p-5 bg-slate-50">

    <div className="flex items-center justify-between mb-4">

      <h4 className="font-bold text-lg">
        {statusFilter[assignment._id]} Students
      </h4>

      <button
        onClick={() =>
          setStatusFilter((prev) => ({
            ...prev,
            [assignment._id]: null
          }))
        }
        className="text-sm text-slate-500 hover:text-slate-800"
      >
        Clear
      </button>

    </div>


    <div className="space-y-3">

      {submissions
        .filter(
          (submission) =>
            submission.status ===
            statusFilter[assignment._id]
        )
        .map((submission) => {

          const student = submission.student;

          return (
            <div
              key={
                student?._id || student
              }
              className="bg-white border rounded-xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
            >

              <div>

                <p className="font-bold">
                  {student?.name || "Unknown Student"}
                </p>

                {student?.rollNumber && (
                  <p className="text-sm text-slate-500">
                    Roll No: {student.rollNumber}
                  </p>
                )}

              </div>


              <div className="text-sm">

                {submission.status === "Submitted" &&
                  submission.marks !== null &&
                  submission.marks !== undefined && (
                    <span className="font-semibold">
                      Marks: {submission.marks}/
                      {assignment.totalMarks}
                    </span>
                  )}

                {submission.status === "Late" &&
                  submission.marks !== null &&
                  submission.marks !== undefined && (
                    <span className="font-semibold">
                      Marks: {submission.marks}/
                      {assignment.totalMarks}
                    </span>
                  )}

                {submission.status === "Not Submitted" && (
                  <span className="text-red-600">
                    Not Submitted
                  </span>
                )}

              </div>

            </div>
          );
        })}


      {submissions.filter(
        (submission) =>
          submission.status ===
          statusFilter[assignment._id]
      ).length === 0 && (

        <p className="text-slate-500 text-center py-4">
          No students in this category.
        </p>

      )}

    </div>

  </div>
)}




                  {/* MANAGE SUBMISSIONS BUTTON */}
                  <button
                    onClick={() =>
                      toggleSubmissions(assignment)
                    }
                    className="mt-6 bg-slate-900 text-white px-5 py-3 rounded-xl hover:bg-slate-800"
                  >
                    {openAssignment === assignment._id
                      ? "Hide Submissions"
                      : "Manage Submissions"}
                  </button>


                  {/* STUDENT SUBMISSIONS */}
                  {openAssignment === assignment._id && (

                    <div className="mt-6 border-t pt-6">

                      <h4 className="text-lg font-bold mb-4">
                        Student Submissions
                      </h4>

                      <div className="space-y-4">

                        {submissions.map((submission) => {

                          const student =
                            submission.student;

                          const studentId =
                            student?._id || student;

                          const currentData =
                            submissionData[studentId] || {
                              status:
                                submission.status ||
                                "Not Submitted",
                              marks:
                                submission.marks ?? ""
                            };

                          return (

                            <div
                              key={studentId}
                              className="border rounded-xl p-4"
                            >

                              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">

                                {/* STUDENT */}
                                <div>
                                  <p className="text-sm text-slate-500">
                                    Student
                                  </p>

                                  <p className="font-bold mt-1">
                                    {student?.name ||
                                      "Unknown Student"}
                                  </p>

                                  {student?.rollNumber && (
                                    <p className="text-sm text-slate-500">
                                      Roll No:{" "}
                                      {student.rollNumber}
                                    </p>
                                  )}
                                </div>


                                {/* STATUS */}
                                <div>
                                  <label className="block text-sm text-slate-500 mb-1">
                                    Submission Status
                                  </label>

                                  <select
                                    value={
                                      currentData.status
                                    }
                                    onChange={(e) =>
                                      handleStatusChange(
                                        studentId,
                                        e.target.value
                                      )
                                    }
                                    className="w-full border rounded-lg px-3 py-2"
                                  >
                                    <option value="Not Submitted">
                                      Not Submitted
                                    </option>

                                    <option value="Submitted">
                                      Submitted
                                    </option>

                                    <option value="Late">
                                      Late
                                    </option>
                                  </select>
                                </div>


                                {/* MARKS */}
                                <div>
                                  <label className="block text-sm text-slate-500 mb-1">
                                    Marks /{" "}
                                    {assignment.totalMarks}
                                  </label>

                                  <input
                                    type="number"
                                    min="0"
                                    max={assignment.totalMarks}
                                    value={
                                      currentData.marks
                                    }
                                    onChange={(e) =>
                                      handleMarksChange(
                                        studentId,
                                        e.target.value
                                      )
                                    }
                                    placeholder="Enter marks"
                                    className="w-full border rounded-lg px-3 py-2"
                                  />
                                </div>


                                {/* SAVE */}
                                <button
                                  onClick={() =>
                                    handleSaveSubmission(
                                      assignment,
                                      studentId
                                    )
                                  }
                                  disabled={
                                    savingStudent ===
                                    studentId
                                  }
                                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                                >
                                  {savingStudent ===
                                  studentId
                                    ? "Saving..."
                                    : "Save"}
                                </button>

                              </div>

                            </div>

                          );
                        })}

                      </div>

                    </div>

                  )}

                </div>
              );
            })

          )}

        </div>

      </main>

    </div>
  );
};

export default AssignmentManagementPage;