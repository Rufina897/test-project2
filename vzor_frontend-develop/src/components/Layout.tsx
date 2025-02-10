import React from "react";
import { Box, Flex } from "@chakra-ui/react";
import Header from "./Header"; // Добавляем импорт Header

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <Flex direction="column" height="100vh" width="100%" minWidth="1350px">
      <Header />
      <Flex flex={1} width="100%">
        <Box flex={1} min-height={"calc(100vh - 60px)"} width="100%">
          {children}
        </Box>
      </Flex>
    </Flex>
  );
};

export default Layout;
