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
import Profile from "./pages/Profile";
import CourseDetails from "./pages/CourseDetails";
import SubjectDetails from "./pages/SubjectDetails";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import DemoLectures from "./pages/DemoLectures";
import CompareFees from "./pages/CompareFees";

function App() {

  return (
    <BrowserRouter>

      <Navbar />

      <Routes>

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
          path="/subjects/:id"
          element={<SubjectDetails />}
        />

        <Route
          path="/courses/:id"
          element={<CourseDetails />}
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/demo-lectures"
          element={<DemoLectures />}
        />

        <Route path="/compare" element={<CompareFees />} />
      </Routes>


    </BrowserRouter>
  );
}

export default App;