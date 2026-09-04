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
import StudentDashboard from "./pages/StudentDashboard";
import ClassDashboard from "./pages/ClassDashboard";
import AdminDashboard from "./pages/AdminDashboard";

import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>

        <Route
          path="/student/dashboard"
          element={<ProtectedRoute allowedRoles={["student"]}><StudentDashboard /></ProtectedRoute>}
        />

        <Route
          path="/class/dashboard"
          element={<ProtectedRoute allowedRoles={["class"]}><ClassDashboard /></ProtectedRoute>}
        />

        <Route
          path="/admin/dashboard"
          element={<ProtectedRoute allowedRoles={["admin"]}><AdminDashboard /></ProtectedRoute>}
        />

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/signup"
          element={<Signup />}
        />

        <Route
          path="/classes"
          element={<Classes />}
        />

        <Route
          path="/classes/:id"
          element={<ClassDetails />}
        />

        <Route
          path="/compare"
          element={<Compare />}
        />

        <Route
          path="/courses/:id"
          element={<CourseDetails />}
        />

        <Route
          path="/subjects/:id"
          element={<SubjectDetails />}
        />

        <Route
          path="/classes/:classId/courses/:courseId/subjects/:subjectId/demos"
          element={<DemoLectures />}
        />

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