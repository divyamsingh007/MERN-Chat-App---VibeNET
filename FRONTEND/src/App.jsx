import { useContext, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import HomePage from "./pages/HomePage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import { AuthContext } from "../context/AuthContext.jsx";

function App() {
  const { authUser } = useContext(AuthContext);

  return (
    <div className="bg-[url('./src/assets/bgImage.svg')] bg-contain">
      <Toaster></Toaster>
      <Routes>
        <Route
          path="/"
          element={
            authUser ? <HomePage /> : <Navigate to={"/login"}></Navigate>
          }
        />
        <Route
          path="/login"
          element={!authUser ? <LoginPage /> : <Navigate to={"/"}></Navigate>}
        />
        <Route
          path="/profile"
          element={
            authUser ? <ProfilePage /> : <Navigate to={"/login"}></Navigate>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
