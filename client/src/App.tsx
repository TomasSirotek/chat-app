import { Route, Navigate, Routes } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Chat from "./pages/Chat";
import { useContext } from "react";
import { ChatContextProvider } from "./context/ChatContext";
import Layout from "./layout";
import PersistLogin from "./components/userState/persistLogin";
import Unauthorized from "./pages/Unauthorized";
import useAuth from "./hooks/useAuth";

function App() {
  const { auth } = useAuth() as any;

  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          <Route element={<PersistLogin />} />

          <Route
            path="/"
            element={
              <ChatContextProvider user={auth}>
                <Chat />
              </ChatContextProvider>
            }
          />
        </Route>
      </Routes>
    </>
  );
}

export default App;
