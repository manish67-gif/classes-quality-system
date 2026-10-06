import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";

import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Classes from "./pages/Classes";
import ClassDetails from "./pages/ClassDetails";
import CourseDetails from "./pages/CourseDetails";
import SubjectDetails from "./pages/SubjectDetails";
import DemoLectures from "./pages/DemoLectures";
import Profile from "./pages/Profile";
import Compare from "./pages/Compare";
import ClassDashboard from "./pages/ClassDashboard";
import ClassCourseDetails from "./pages/ClassCourseDetails";
import ClassSubjectDetails from "./pages/ClassSubjectDetails";
import AdminDashboard from "./pages/AdminDashboard";
import AdminStudents from "./pages/AdminStudents";
import AdminStudentDetails from "./pages/AdminStudentDetails";
import AdminClasses from "./pages/AdminClasses";
import AdminClassDetails from "./pages/AdminClassDetails";
import AdminCourseDetails from "./pages/AdminCourseDetails";
import AdminSubjectDetails from "./pages/AdminSubjectDetails";
import Reviews from "./pages/Reviews";

import ProtectedRoute from "./components/ProtectedRoute";


function App() {
  return (
    <BrowserRouter>

      <Navbar />

      <Routes>

        {/* =========================================
            CLASS / INSTITUTE DASHBOARD
        ========================================= */}

        <Route
          path="/class/dashboard"
          element={
            <ProtectedRoute allowedRoles={["class"]}>
              <ClassDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/class/classes/:classId/courses/:courseId"
          element={
            <ProtectedRoute allowedRoles={["class"]}>
              <ClassCourseDetails />
            </ProtectedRoute>
          }
        />

        <Route
          path="/class/classes/:classId/courses/:courseId/subjects/:subjectId"
          element={
            <ProtectedRoute allowedRoles={["class"]}>
              <ClassSubjectDetails />
            </ProtectedRoute>
          }
        />

        {/* =========================================
            ADMIN DASHBOARD
        ========================================= */}

        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/students"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminStudents />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/students/:id"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminStudentDetails />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/classes"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminClasses />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/classes/:id"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminClassDetails />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/classes/:classId/courses/:courseId"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminCourseDetails />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/classes/:classId/courses/:courseId/subjects/:subjectId"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminSubjectDetails />
            </ProtectedRoute>
          }
        />

        {/* =========================================
            HOME
        ========================================= */}

        <Route
          path="/"
          element={<Home />}
        />


        {/* =========================================
            AUTHENTICATION
        ========================================= */}

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/signup"
          element={<Signup />}
        />


        {/* =========================================
            CLASSES / INSTITUTES
        ========================================= */}

        <Route
          path="/classes"
          element={<Classes />}
        />

        <Route
          path="/classes/:id"
          element={<ClassDetails />}
        />


        {/* =========================================
            COMPARE
        ========================================= */}

        <Route
          path="/compare"
          element={<Compare />}
        />


        {/* =========================================
            COURSES
        ========================================= */}

        <Route
          path="/courses/:id"
          element={<CourseDetails />}
        />


        {/* =========================================
            SUBJECTS
        ========================================= */}

        <Route
          path="/subjects/:id"
          element={<SubjectDetails />}
        />


        {/* =========================================
            ALL REVIEWS FOR A SUBJECT
        ========================================= */}

        <Route
          path="/reviews/subject/:subjectId"
          element={<Reviews />}
        />


        {/* =========================================
            ALL REVIEWS OF LOGGED-IN STUDENT
        ========================================= */}

        <Route
          path="/reviews/my-reviews"
          element={
            <ProtectedRoute>
              <Reviews />
            </ProtectedRoute>
          }
        />


        {/* =========================================
            DEMO LECTURES
        ========================================= */}

        <Route
          path="/classes/:classId/courses/:courseId/subjects/:subjectId/demos"
          element={<DemoLectures />}
        />


        {/* =========================================
            PROFILE
        ========================================= */}

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;