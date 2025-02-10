import React, { useEffect } from "react";
import { ChakraProvider } from "@chakra-ui/react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Layout from "./components/Layout";
import PrivateRoute from "./components/PrivateRoute";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import MainPopup from "./components/MainPopup";

const queryClient = new QueryClient();

function App() {

  useEffect(() => {
    document.addEventListener('contextmenu', (e) => e.preventDefault());
    
    return () => {
      document.removeEventListener('contextmenu', (e) => e.preventDefault());
    };
  }, []); 

  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider>
        <BrowserRouter>
          <MainPopup />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Layout>
                    <Dashboard />
                  </Layout>
                </PrivateRoute>
              }
            />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </BrowserRouter>
      </ChakraProvider>
    </QueryClientProvider>
  );
}

export default App;
