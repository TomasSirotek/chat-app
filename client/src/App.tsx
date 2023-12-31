import { Route, Navigate, Routes } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Chat from "./pages/Chat";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContexts";
import { ChatContextProvider } from "./context/ChatContext";
import Layout from "./layout";

function App() {
  const authContext = useContext(AuthContext);
  const user = authContext?.user || null;

  return (
    <>
      <ChatContextProvider user={user}>
        <Layout>
          <Routes>
            <Route path="/" element={user ? <Chat /> : <Login />} />
            <Route path="/login" element={user ? <Chat /> : <Login />} />
            <Route path="/register" element={user ? <Chat /> : <Register />} />
            <Route path="*" element={<Navigate to={"/ "} />} />
          </Routes>
        </Layout>
      </ChatContextProvider>
    </>
  );
}

export default App;
