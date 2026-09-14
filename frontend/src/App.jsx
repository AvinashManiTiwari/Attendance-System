
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from "react-router";

import { AuthProvider } from "./context/AuthContext";

import ProtectedRoute from "./components/ProtectedRoute";

import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import AttendancePage from "./pages/AttendancePage";
import ReportsPage from "./pages/ReportsPage";

import StudentManagementPage from "./pages/StudentManagementPage";

import AdminRoute from "./components/AdminRoute";

import ClassManagementPage from "./pages/ClassManagementPage";
import SubjectManagementPage from "./pages/SubjectManagementPage";

import ForgotPasswordPage from "./pages/ForgotPasswordPage";

import ResetPasswordPage from "./pages/ResetPasswordPage";

import AssignmentManagementPage from "./pages/AssignmentManagementPage";

function App() {

  return (
    <AuthProvider>

      <BrowserRouter>

        <Routes>

          <Route
            path="/login"
            element={<LoginPage />}
          />

  <Route
   path="/forgot-password"
   element={<ForgotPasswordPage />}
/>


<Route
  path="/reset-password/:token"
  element={<ResetPasswordPage />}
/>


          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />


          <Route
            path="/attendance"
            element={
              <ProtectedRoute>
                <AttendancePage />
              </ProtectedRoute>
            }
          />


          <Route
            path="/reports"
            element={
              <ProtectedRoute>
                <ReportsPage />
              </ProtectedRoute>
            }
          />


          <Route
            path="/"
            element={
              <Navigate
                to="/dashboard"
                replace
              />
            }
          />

  <Route
    path="/students"
    element={
    <ProtectedRoute>
      <StudentManagementPage />
    </ProtectedRoute>
  }
/>





<Route
  path="/classes"
  element={
    <ProtectedRoute>
      
        <ClassManagementPage />
      
    </ProtectedRoute>
  }
/>

<Route
  path="/subjects"
  element={
    <ProtectedRoute>
      
        <SubjectManagementPage />
      
    </ProtectedRoute>
  }
/>


<Route
  path="/assignments"
  element={
    <ProtectedRoute>
      <AssignmentManagementPage />
    </ProtectedRoute>
  }
/>

        </Routes>

      </BrowserRouter>

    </AuthProvider>
  );
}


export default App;