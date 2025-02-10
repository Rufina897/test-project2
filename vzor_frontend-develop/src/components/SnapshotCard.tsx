import React from "react";
import { Box, Image, Text, VStack, Popover, 
  PopoverTrigger, 
  PopoverContent,
  PopoverBody,
  Button, Center,
  Spinner,
  Flex, } from "@chakra-ui/react";
import { CameraData } from "../types";
import { mainPopupStore } from "../stores/MainPopupStore";

interface SnapshotCardProps {
  camera: CameraData;
  onClick: () => void;
}

// Функция для преобразования результата предсказания в русский текст
const translatePredictionResult = (result: string): string => {
  switch (result?.toLowerCase()) {
    case "blur":
      return "Размыто";
    case "dirty":
      return "Грязь";
    case "normal":
      return "Нормально";
    default:
      return result;
  }
};

// Функция для перевода меток аннотаций
const translateAnnotationLabel = (label: string): string => {
  switch (label.toLowerCase()) {
    case "dirty":
      return "Грязно";
    case "blur":
      return "Размыто";
    case "normal":
      return "Чисто";
    case "undefined":
      return "Не определено";
    default:
      return "Не определено";
  }
};

const SnapshotCard: React.FC<SnapshotCardProps> = ({ camera, onClick }) => {
  const translatedResult = translatePredictionResult(
    camera.nn_prediction_result
  );

  const [hasError, setHasError] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isImageValid, setIsImageValid] = React.useState(false);

  const handleClick = (e: React.MouseEvent) => {
    if (!isImageValid) return;
    
    const target = e.target as HTMLElement;
    if (target.closest('.annotations-popover')) {
      return;
    }
    onClick();
    mainPopupStore.showPopup({
      type: "cameraDetails",
      props: {
        camera: {
          ...camera,
          nn_prediction_result: translatedResult,
        },
      },
    });
  };

  return (
    <Box
      onClick={handleClick}
      cursor={isImageValid ? "pointer" : "not-allowed"}
      border={"1px solid gray"}
      borderRadius={"xl"}
      boxShadow={"sm"}
      position="relative"
      minW="320px"
      minH="240px"
      opacity={isImageValid ? 1 : 0.7}
      _hover={{
        boxShadow: isImageValid ? "xl" : "none",
      }}
    >
      <VStack align="start" spacing={2} p={2} h="100%">
        <Box 
          position="relative" 
          width="100%" 
          paddingTop="56.25%"
          overflow="hidden"
        >
          {isLoading && !hasError && (
            <Center 
              position="absolute"
              top="0"
              left="0"
              width="100%"
              height="100%"
              bg="gray.100"
              borderRadius={'xl'}
            >
              <Spinner />
            </Center>
          )}
          <Image
            src={camera.url}
            alt={`Камера ${camera.camera_id}`}
            position="absolute"
            top="0"
            left="0"
            width="100%"
            height="100%"
            objectFit="cover"
            objectPosition="center"
            borderRadius="xl"
            onLoad={() => {
              setIsLoading(false);
              setIsImageValid(true);
            }}
            onError={() => {
              setHasError(true);
              setIsLoading(false);
              setIsImageValid(false);
            }}
            display={hasError ? 'none' : 'block'}
          />
          {hasError && (
            <Center 
              position="absolute"
              top="0"
              left="0"
              width="100%"
              height="100%"
              bg="gray.100"
              padding={12}
              borderRadius={'xl'}
            >
              <Text fontSize="24px">Изображение недоступно</Text>
            </Center>
          )}
          {isImageValid && translatedResult !== "Нормально" && (
            <Text
              position="absolute"
              top="50%"
              left="50%"
              transform="translate(-50%, -50%)"
              fontSize="54px"
              fontWeight="bold"
              backgroundColor="gray"
              opacity={0.4}
              lineHeight="1"
              borderRadius="2xl"
              padding="10px"
              textTransform="uppercase"
              width="90%"
              textAlign="center"
              overflow="hidden"
              zIndex={1}
            >
              {translatedResult}
            </Text>
          )}
        </Box>
        <Flex flexDirection={'column'} height={'100%'} alignItems={'start'}>
        <Text fontWeight="bold">Адрес:</Text>
        <span style={{flex: 1}} className="card-address-text">{camera.camera_equ_name}</span>
        {camera.annotations ? (
          camera.annotations.length > 0 ? (
            <Box className="annotations-popover" onClick={(e) => e.stopPropagation()}>
              <Popover placement="bottom-start">
                <PopoverTrigger>
                  <Button size="sm" ml={2} my={2}>
                    Показать аннотации ({camera.annotations.length})
                  </Button>
                </PopoverTrigger>
                <PopoverContent>
                  <PopoverBody>
                    <VStack align="stretch" spacing={2} zIndex={1000}>
                      {camera.annotations.map((annotation) => (
                        <Box 
                          key={annotation.id}
                          p={2}
                          bg="gray.50"
                          borderRadius="md"
                        >
                          <Text>{translateAnnotationLabel(annotation.label)}</Text>
                          <Text fontSize="sm" color="gray.600">
                            {new Date(Number(annotation.created_at) * 1000).toLocaleDateString('ru')}
                          </Text>
                        </Box>
                      ))}
                    </VStack>
                  </PopoverBody>
                </PopoverContent>
              </Popover>
            </Box>
          ) : (
            <Button 
              size="sm" 
              mt="auto"
              // ml={2} 
              my={2} 
              isDisabled={true}
              bg="orange.500"
              color="white"
              _hover={{ bg: "orange.400", cursor: "not-allowed" }}
              _disabled={{ bg: "orange.400", opacity: 0.7 }}
              background="orange.400"
            >
              Ждет аннотации
            </Button>
          )
        ) : null}
        </Flex>
      </VStack>
    </Box>
  );
};

export default SnapshotCard;
