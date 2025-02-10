import React from "react";
import { Box, Button, Flex, Heading } from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

const Header: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const handleLogout = () => {
    localStorage.removeItem("token");
    queryClient.clear();
    navigate("/login", { replace: true });
  };

  return (
    <Box as="header" width="100%" bg="white" color="white" p={4}>
      <Flex width="100%" alignItems="center" justifyContent="space-between">
        <Flex position={"relative"}>
          <Heading as="h1" p={2} size="lg" color={"black"}>
            <Link to="/dashboard">VZOR</Link>
          </Heading>
        </Flex>
        {/* Портал для SearchBar будет монтироваться сюда */}
        <div id="search-bar-portal" style={{width: '500px'}}/>
        <Button onClick={handleLogout}>Выйти</Button>
      </Flex>
    </Box>
  );
};

export default Header;
