import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./hooks/useAuth";
import { ProfileProvider, useProfile } from "./hooks/useProfile";
import { ThemeProvider } from "./hooks/useTheme";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import ExerciseDetail from "./pages/ExerciseDetail";
import AddExercise from "./pages/AddExercise";
import Progress from "./pages/Progress";
import Calendar from "./pages/Calendar";
import Settings from "./pages/Settings";
import Setup from "./pages/Setup";
import Login from "./pages/Login";

// Requires: unlocked. Redirects to /login if not.
function ProtectedRoute({ children }) {
  const { unlocked } = useAuth();
  if (!unlocked) return <Navigate to="/login" replace />;
  return children;
}

// Requires: unlocked + profile complete. Redirects accordingly.
function ProfileRoute({ children }) {
  const { unlocked } = useAuth();
  const { hasProfile } = useProfile();
  if (!unlocked) return <Navigate to="/login" replace />;
  if (!hasProfile) return <Navigate to="/setup" replace />;
  return children;
}

// Setup: accessible only when unlocked but profile not complete.
function SetupRoute({ children }) {
  const { unlocked } = useAuth();
  const { hasProfile } = useProfile();
  if (!unlocked) return <Navigate to="/login" replace />;
  if (hasProfile) return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <ProfileProvider>
        <ThemeProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/setup"
              element={
                <SetupRoute>
                  <Setup />
                </SetupRoute>
              }
            />
            <Route
              path="/"
              element={
                <ProfileRoute>
                  <Layout />
                </ProfileRoute>
              }
            >
              <Route index element={<Home />} />
              <Route path="exercise/:id" element={<ExerciseDetail />} />
              <Route path="add-exercise" element={<AddExercise />} />
              <Route path="progress" element={<Progress />} />
              <Route path="calendar" element={<Calendar />} />
              <Route path="settings" element={<Settings />} />
            </Route>
          </Routes>
        </Router>
        </ThemeProvider>
      </ProfileProvider>
    </AuthProvider>
  );
}
