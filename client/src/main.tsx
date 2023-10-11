import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";

import { AuthContextProvider } from "./context/AuthContexts.tsx";
import { AlertProvider } from "./providers/AlertProvider.tsx";
import { ThemeProvider } from "./components/theme-provider.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider  defaultTheme="dark" storageKey="vite-ui-theme">
        <AlertProvider> 
          <AuthContextProvider>
            <App />
          </AuthContextProvider>
        </AlertProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);