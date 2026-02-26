import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./hooks/useAuth";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import ExerciseDetail from "./pages/ExerciseDetail";
import AddExercise from "./pages/AddExercise";
import Progress from "./pages/Progress";
import Login from "./pages/Login";

function ProtectedRoute({ children }) {
  const { unlocked } = useAuth();
  if (!unlocked) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Home />} />
            <Route path="exercise/:id" element={<ExerciseDetail />} />
            <Route path="add-exercise" element={<AddExercise />} />
            <Route path="progress" element={<Progress />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}
