import React from "react";
import { Box, Center, Container } from "@chakra-ui/react";
import LoginForm from "../components/LoginForm";
import { Navigate } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { useAuth } from "../hooks/useAuth";

const Login: React.FC = observer(() => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <Box minH="100vh">
      <Container maxW="container.sm">
        <Center minH="100vh">
          <LoginForm />
        </Center>
      </Container>
    </Box>
  );
});

export default Login;
