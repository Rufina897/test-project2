import React from "react";
import { Box, Text, Flex, Icon } from "@chakra-ui/react";
import { VideocameraIcon } from "./icons";

interface StatCardProps {
  title: string;
  value: string | number;
}

const StatCard: React.FC<StatCardProps> = ({ title, value }) => {
  return (
    <Box alignSelf={'center'}
      borderWidth="1px"
      borderRadius="25px"
      p={2}
      paddingInline={4}
      bg="white"
      boxShadow="sm"
      maxWidth="300px"
      border={"1px solid red"}
      color={"black"}
      width={"200px"}
    >
      <Flex justifyContent="space-between" gap={4} alignItems="center">
        <Box>
          <Text fontSize="sm" color="gray.700">
            {title}
          </Text>
          <Text fontSize="2xl" fontWeight="bold">
            {value}
          </Text>
        </Box>
        <Icon
          alignSelf={"start"}
          as={VideocameraIcon}
          boxSize={6}
          color="orange.500"
        />
      </Flex>
    </Box>
  );
};

export default StatCard;
