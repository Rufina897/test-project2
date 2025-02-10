import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { VStack, Button, Link } from "@chakra-ui/react";
import { ArchiveIcon, CameraIcon, VideocameraIcon } from "./icons";

const Sidebar: React.FC = () => {
  return (
    <VStack as="nav" w={"100%"} spacing={4} pt={"2.5rem"} align="stretch">
      <Link
        as={RouterLink}
        display={"flex"}
        to="/"
        _hover={{ textDecoration: "none" }}
        alignItems={"center"}
      >
        <CameraIcon />
        <Button
          w="100%"
          border={"none"}
          fontSize={"24px"}
          display="flex"
          justifyContent="flex-start"
          _hover={{
            bg: "gray.100",
            border: "none",
          }}
        >
          Безопасный город
        </Button>
      </Link>
      <Link
        as={RouterLink}
        display={"flex"}
        to="/profile"
        _hover={{ textDecoration: "none" }}
        alignItems={"center"}
      >
        <VideocameraIcon />
        <Button
          w="100%"
          fontSize={"24px"}
          border={"none"}
          display="flex"
          justifyContent="flex-start"
          _hover={{
            bg: "gray.100",
            border: "none",
          }}
        >
          Домофония
        </Button>
      </Link>
    </VStack>
  );
};

export default Sidebar;
