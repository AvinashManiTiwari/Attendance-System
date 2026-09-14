import { useEffect, useState } from "react";

import * as XLSX from "xlsx";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import { apiFetch } from "../services/api";


const ReportsPage = () => {

  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);

  const [classId, setClassId] = useState("");
  const [subjectId, setSubjectId] = useState("");

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [report, setReport] = useState([]);
  const [overallPercentage, setOverallPercentage] =
    useState(0);

  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(false);

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

  useEffect(() => {

    if (!classId) {

      setSubjects([]);
      setSubjectId("");

      return;
    }


    const loadSubjects = async () => {

      try {

        const data = await apiFetch(
          `/subjects/class/${classId}`
        );

        setSubjects(data.subjects);

      } catch (error) {

        setError(error.message);

      }

    };


    loadSubjects();

  }, [classId]);


  // ======================================
  // FETCH REPORT
  // ======================================

  const fetchReport = async () => {

    setError("");
    setLoading(true);


    try {

      let url =
        `/reports/attendance?classId=${classId}&subjectId=${subjectId}`;


      if (startDate) {
        url += `&startDate=${startDate}`;
      }


      if (endDate) {
        url += `&endDate=${endDate}`;
      }


      const data = await apiFetch(url);


      setReport(data.report);

      setOverallPercentage(
        data.overallPercentage
      );

    } catch (error) {

      setError(error.message);

      setReport([]);

    } finally {

      setLoading(false);

    }
  };


  // ======================================
  // SEARCH
  // ======================================

  const filteredReport = report.filter(student => {

    const query =
      search.toLowerCase().trim();


    return (
      student.name
        .toLowerCase()
        .includes(query) ||

      student.rollNumber
        .toLowerCase()
        .includes(query)
    );

  });


  // ======================================
  // EXCEL
  // ======================================

  const downloadExcel = () => {

    const data = filteredReport.map(student => ({

      "Roll Number":
        student.rollNumber,

      "Student Name":
        student.name,

      "Present":
        student.present,

      "Absent":
        student.absent,

      "Total":
        student.total,

      "Attendance %":
        `${student.percentage}%`

    }));


    const worksheet =
      XLSX.utils.json_to_sheet(data);


    const workbook =
      XLSX.utils.book_new();


    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "Attendance"
    );


    XLSX.writeFile(
      workbook,
      "attendance-report.xlsx"
    );
  };


  // ======================================
  // PDF
  // ======================================

  const downloadPDF = () => {

    const doc = new jsPDF();


    doc.setFontSize(18);

    doc.text(
      "Attendance Report",
      14,
      20
    );


    doc.setFontSize(11);

    doc.text(
      `Overall Attendance: ${overallPercentage}%`,
      14,
      30
    );


    const tableData =
      filteredReport.map(student => [

        student.rollNumber,

        student.name,

        student.present,

        student.absent,

        student.total,

        `${student.percentage}%`

      ]);


    autoTable(doc, {

      startY: 38,

      head: [[
        "Roll No",
        "Student",
        "Present",
        "Absent",
        "Total",
        "Percentage"
      ]],

      body: tableData

    });


    doc.save(
      "attendance-report.pdf"
    );
  };


  return (
    <div className="min-h-screen bg-slate-100 px-4 py-6">

      <div className="max-w-6xl mx-auto">


        <div className="mb-6">

          <h1 className="text-2xl sm:text-3xl font-bold">
            Attendance Reports
          </h1>

          <p className="text-slate-500 mt-1">
            View and export attendance statistics.
          </p>

        </div>


        {/* FILTERS */}

        <div className="bg-white rounded-2xl shadow p-4 sm:p-6 mb-6">

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">


            {/* CLASS */}

            <select
              value={classId}
              onChange={(e) =>
                setClassId(e.target.value)
              }
              className="border rounded-xl px-3 py-3"
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


            {/* SUBJECT */}

            <select
              value={subjectId}
              onChange={(e) =>
                setSubjectId(e.target.value)
              }
              disabled={!classId}
              className="border rounded-xl px-3 py-3 disabled:bg-slate-100"
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


            {/* START DATE */}

            <input
              type="date"
              value={startDate}
              onChange={(e) =>
                setStartDate(e.target.value)
              }
              className="border rounded-xl px-3 py-3"
            />


            {/* END DATE */}

            <input
              type="date"
              value={endDate}
              onChange={(e) =>
                setEndDate(e.target.value)
              }
              className="border rounded-xl px-3 py-3"
            />

          </div>


          <button
            onClick={fetchReport}
            disabled={
              !classId ||
              !subjectId ||
              loading
            }
            className="mt-4 w-full sm:w-auto bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold disabled:opacity-50"
          >
            {loading
              ? "Loading..."
              : "Generate Report"}
          </button>

        </div>


        {error && (

          <div className="mb-5 bg-red-50 text-red-600 p-4 rounded-xl">
            {error}
          </div>

        )}


        {/* OVERALL */}

        {report.length > 0 && (

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">


            <div className="bg-white rounded-2xl shadow p-5">

              <p className="text-sm text-slate-500">
                Overall Attendance
              </p>

              <p className="text-3xl font-bold mt-2">
                {overallPercentage}%
              </p>

            </div>


            <div className="bg-white rounded-2xl shadow p-5">

              <p className="text-sm text-slate-500">
                Students
              </p>

              <p className="text-3xl font-bold mt-2">
                {report.length}
              </p>

            </div>


            <div className="bg-white rounded-2xl shadow p-5">

              <p className="text-sm text-slate-500">
                Search Results
              </p>

              <p className="text-3xl font-bold mt-2">
                {filteredReport.length}
              </p>

            </div>

          </div>

        )}


        {/* SEARCH + EXPORT */}

        {report.length > 0 && (

          <div className="bg-white rounded-2xl shadow p-4 mb-5">

            <div className="flex flex-col sm:flex-row gap-3">

              <input
                type="text"
                placeholder="Search by name or roll number..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                className="flex-1 border rounded-xl px-4 py-3"
              />


              <button
                onClick={downloadExcel}
                className="bg-green-600 text-white px-5 py-3 rounded-xl font-semibold"
              >
                Download Excel
              </button>


              <button
                onClick={downloadPDF}
                className="bg-red-600 text-white px-5 py-3 rounded-xl font-semibold"
              >
                Download PDF
              </button>

            </div>

          </div>

        )}


        {/* TABLE */}

        {report.length > 0 && (

          <div className="bg-white rounded-2xl shadow overflow-x-auto">

            <table className="w-full text-sm">

              <thead className="bg-slate-50">

                <tr>

                  <th className="text-left p-4">
                    Roll No
                  </th>

                  <th className="text-left p-4">
                    Student
                  </th>

                  <th className="text-center p-4">
                    Present
                  </th>

                  <th className="text-center p-4">
                    Absent
                  </th>

                  <th className="text-center p-4">
                    Total
                  </th>

                  <th className="text-center p-4">
                    Percentage
                  </th>

                </tr>

              </thead>


              <tbody>

                {filteredReport.map(student => (

                  <tr
                    key={student.studentId}
                    className="border-t"
                  >

                    <td className="p-4">
                      {student.rollNumber}
                    </td>

                    <td className="p-4 font-medium">
                      {student.name}
                    </td>

                    <td className="p-4 text-center text-green-600 font-semibold">
                      {student.present}
                    </td>

                    <td className="p-4 text-center text-red-600 font-semibold">
                      {student.absent}
                    </td>

                    <td className="p-4 text-center">
                      {student.total}
                    </td>

                    <td className="p-4 text-center font-bold">
                      {student.percentage}%
                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        )}


      </div>

    </div>
  );
};


export default ReportsPage;