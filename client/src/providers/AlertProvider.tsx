// AlertProvider.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';
import AlertSnack from '../components/AlertSnack';

// Define the context
interface AlertContextType {
  showAlert: (message: string,severity: string) => void;
  hideAlert: () => void;
  isOpen: boolean;
  alertMessage: string | null;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export function useAlert() {
  const context = useContext(AlertContext);
  if (context === undefined) {
    throw new Error('useAlert must be used within an AlertProvider');
  }
  return context;
}

export function AlertProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [severity, setSeverity] = useState<string | null>('');

  const showAlert = (message: string,severity: string) => {
    setAlertMessage(message);
    setSeverity(severity);
    setIsOpen(true);
  };

  const hideAlert = () => {
    setAlertMessage(null);
    setIsOpen(false);
  };

  function mapSeverityFromString(input: string): "error" | "info" | "success" | "warning" {
    switch (input) {
      case "error":
        return "error";
      case "info":
        return "info";
      case "success":
        return "success";
      case "warning":
        return "warning";
      default:
        return "info"; // Default to "info" for unknown values
    }
  }

  return (
    <AlertContext.Provider value={{ showAlert, hideAlert, isOpen, alertMessage }}>
      {children}
      {alertMessage && severity && <AlertSnack severity={mapSeverityFromString(severity)} message={alertMessage} isOpen={isOpen} />}
    </AlertContext.Provider>
  );
}
