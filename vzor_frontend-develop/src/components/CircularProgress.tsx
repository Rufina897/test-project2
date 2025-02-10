import React, { useEffect, useState } from "react";
import { Box, Flex, Text } from "@chakra-ui/react";

export interface SegmentData {
  value: number;
  color: string;
  label: string;
}

interface CircularProgressProps {
  data: SegmentData[];
  size?: number;
  strokeWidth?: number;
  emptyStrokeColor?: string;
}

const CircularProgress: React.FC<CircularProgressProps> = ({
  data,
  size = 120,
  strokeWidth = 10,
  emptyStrokeColor = "#E2E8F0",
}) => {
  const [segments, setSegments] = useState<SegmentData[]>([]);
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;

  useEffect(() => {
    const timer = setTimeout(() => {
      setSegments(data);
    }, 100);

    return () => clearTimeout(timer);
  }, [data]);

  const total = segments.reduce((sum, segment) => sum + segment.value, 0);

  let startAngle = 0;
  const segmentElements = segments.map((segment, index) => {
    const percentage = (segment.value / total) * 100;
    const endAngle = startAngle + (percentage / 100) * 360;

    const x1 = size / 2 + radius * Math.cos((startAngle * Math.PI) / 180);
    const y1 = size / 2 + radius * Math.sin((startAngle * Math.PI) / 180);
    const x2 = size / 2 + radius * Math.cos((endAngle * Math.PI) / 180);
    const y2 = size / 2 + radius * Math.sin((endAngle * Math.PI) / 180);

    const largeArcFlag = percentage >= 50 ? 1 : 0;

    const sweepFlag = 1;

    const pathData =
      percentage === 100
        ? `
        M ${size / 2} ${size / 2 - radius}
        A ${radius} ${radius} 0 1 ${sweepFlag} ${size / 2} ${size / 2 + radius}
        A ${radius} ${radius} 0 1 ${sweepFlag} ${size / 2} ${size / 2 - radius}
      `
        : `
        M ${size / 2} ${size / 2}
        L ${x1} ${y1}
        A ${radius} ${radius} 0 ${largeArcFlag} ${sweepFlag} ${x2} ${y2}
        Z
      `;

    startAngle = endAngle;

    return (
      <path
        key={index}
        d={pathData}
        fill={segment.color}
        stroke="white"
        strokeWidth={1}
      />
    );
  });

  const innerCircleRadius = radius * 0.6; // Радиус внутреннего белого круга

  return (
    <Flex
      direction="row"
      gap={4}
      padding={6}
      alignItems="center"
      marginLeft={"auto"}
    >
      <Box position="relative" width={`${size}px`} height={`${size}px`}>
        <svg width={size} height={size}>
          <circle
            stroke={emptyStrokeColor}
            strokeWidth={strokeWidth}
            fill="transparent"
            r={radius}
            cx={size / 2}
            cy={size / 2}
          />
          {segmentElements}
          {/* Добавляем белый круг в центр */}
          <circle
            fill="white"
            r={innerCircleRadius}
            cx={size / 2}
            cy={size / 2}
          />
        </svg>
        <Box
          position="absolute"
          top="50%"
          left="50%"
          transform="translate(-50%, -50%)"
          fontSize={`${size / 6}px`}
          fontWeight="bold"
          textAlign="center"
        ></Box>
      </Box>
      <Flex
        mt={4}
        flexDirection={"column"}
        flexWrap="wrap"
        justifyContent="center"
      >
        {segments.map((segment, index) => (
          <Flex key={index} alignItems="center" mr={4} mb={2}>
            <Box
              width="10px"
              height="10px"
              borderRadius="50%"
              bg={segment.color}
              mr={2}
            />
            <Text fontSize="sm">
              {segment.label}: {segment.value}
            </Text>
          </Flex>
        ))}
      </Flex>
    </Flex>
  );
};

export default CircularProgress;
