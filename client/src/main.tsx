import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

import { AuthContextProvider } from "./context/AuthContexts.tsx";
import { AlertProvider } from "./providers/AlertProvider.tsx";
import { ThemeProvider } from "./components/theme-provider.tsx";
import { BrowserRouter, Routes, Route } from 'react-router-dom';3

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider  defaultTheme="dark" storageKey="vite-ui-theme">
        <AlertProvider> 
          <AuthContextProvider>
          <Routes>
          <Route path="/*" element={<App />} />
        </Routes>
          </AuthContextProvider>
        </AlertProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);