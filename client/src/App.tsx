import { Route, Navigate, Routes } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Chat from "./pages/Chat";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContexts";

function App() {
  const { user } = useContext(AuthContext) || {};

  return (
    <>
      <Routes>
        <Route path="/" element={user ? <Chat /> : <Login/>} />
        <Route path="/login" element={user ? <Chat /> : <Login/>} />
        <Route path="/register" element={user ? <Chat /> : <Register/>} />
        <Route path="*" element={<Navigate to={"/ "} />} />
      </Routes>
    </>
  );
}

export default App;
