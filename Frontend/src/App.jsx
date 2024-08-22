import { useEffect, useState } from "react";
import FlowingShapes from "./components/FlowingShapes";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import LoginPage from "./page/LoginPage";
import SigninPage from "./page/SigninPage";
import EmailVerificationPage from "./page/EmailVerificationPage";
import Toaster from "react-hot-toast";
import { useAuthStore } from "./store/authStore";
import DashboardPage from "./page/DashboardPage";
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!user.isVerified) {
    return <Navigate to="/verify-email" replace />;
  }

  return children;
};

const RedirectAuthenticatedUser = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();

  console.log("object :>> ", isAuthenticated, user?.isVerified);

  if (isAuthenticated && user.isVerified) {
    return <Navigate to="/" replace />;
  }
  return children;
};

function App() {
  const { checkAuth, user, isCheckingAuth, isAuthenticated } = useAuthStore();
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <>
      <div
        className="min-h-screen bg-gradient-to-br
    from-gray-900 via-green-900 to-emerald-900 flex items-center justify-center relative overflow-hidden"
      >
        <FlowingShapes
          color="bg-green-500"
          size="w-64 h-64"
          top="-5%"
          left="-10%"
          delay={0}
        />
        <FlowingShapes
          color="bg-emerald-500"
          size="w-48 h-48"
          top="70%"
          left="80%"
          delay={5}
        />
        <FlowingShapes
          color="bg-lime-500"
          size="w-32 h-32"
          top="40%"
          left="-10%"
          delay={2}
        />

        <BrowserRouter>
          <Routes>
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/signin"
              element={
                <RedirectAuthenticatedUser>
                  <SigninPage />
                </RedirectAuthenticatedUser>
              }
            />
            <Route
              path="/login"
              element={
                <RedirectAuthenticatedUser>
                  <LoginPage />
                </RedirectAuthenticatedUser>
              }
            />
            <Route path="/verify-email" element={<EmailVerificationPage />} />
          </Routes>
          <Toaster />
        </BrowserRouter>
      </div>
    </>
  );
}

export default App;
