import React, { useState, useEffect } from "react";
import { observer } from "mobx-react-lite";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  Button,
  Image,
  Text,
  Flex,
  Box,
  ModalCloseButton,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  SlideFade,
  Spinner,
  Input,
} from "@chakra-ui/react";

import { mainPopupStore } from "../../stores/MainPopupStore";
import { CameraData } from "src/types";
import { snapshotsStore } from "../../stores/SnapshotsStore";
import { useAnnotateMutation, useCreateClaimMutation, useRecreateMutation } from "../../hooks/useQueries";
import { useImageDimensions } from "../../hooks/useImageDimensions";

interface SnapshotActionPopupProps {
  camera: CameraData;
}

const SnapshotActionPopup: React.FC<SnapshotActionPopupProps> = observer(({ camera }) => {
  const [isSuccess, setIsSuccess] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [alertTimeout, setAlertTimeout] = useState<number | null>(null);
  const [canRecreate, setCanRecreate] = useState(true);
  const { mutateAsync: createClaim } = useCreateClaimMutation();
  const { mutate: recreateMutation, data: refreshedSnapshot, isPending: isRecreatePending, isError: isRecreateError } = useRecreateMutation();
  const [refreshedSnapshotData, setRefreshedSnapshotData] = useState<CameraData | null>(null);
  const imageUrl = refreshedSnapshotData?.url || snapshotsStore.currentCamera?.url;
  const { aspectRatio } = useImageDimensions(imageUrl);
  // Вычисляем оптимальные размеры для мо дального окна
  const isVertical = aspectRatio < 1;

  // Сброс refreshedSnapshotData при смене камеры
  useEffect(() => {
    setRefreshedSnapshotData(null);
  }, [camera]);

  // Добавляем новые состояния
  const [isClaimLoading, setIsClaimLoading] = useState(false);
  const [showClaimSuccessAlert, setShowClaimSuccessAlert] = useState(false);
  const [showClaimErrorAlert, setShowClaimErrorAlert] = useState(false);
  const [isClaimMode, setIsClaimMode] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [recreateTimer, setRecreateTimer] = useState<number>(0);

  useEffect(() => {
    return () => {
      if (alertTimeout) {
        clearTimeout(alertTimeout);
      }
    };
  }, [alertTimeout]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (recreateTimer > 0) {
      interval = setInterval(() => {
        setRecreateTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [recreateTimer]);

  const showTemporaryAlert = () => {
    if (alertTimeout) {
      clearTimeout(alertTimeout);
    }

    setShowAlert(true);

    const timeout = setTimeout(() => {
      setShowAlert(false);
    }, 1000);

    setAlertTimeout(Number(timeout));
  };

  const handleClose = () => {
    mainPopupStore.closePopup();
    snapshotsStore.setCurrentCamera(null);
    snapshotsStore.setCurrentCameraIndex(0);
    setRefreshedSnapshotData(null);
  };

  // Добавляем предустановленные комментарии
  const predefinedComments = [
    "Некорректная цветопередача",
    "Камера размытая",
    "Камера грязная",
    "Нарушен ракурс", 
    "Отсутствие изображения",
  ];

  const handleCreateClaim = async () => {
    if (!commentText.trim()) return;
    
    setIsClaimLoading(true);
    try {
      await createClaim({
        snapshot_id: refreshedSnapshotData?.id || Number(snapshotsStore.currentCamera?.id),
        comment: commentText
      });

      setShowClaimSuccessAlert(true);
      setIsClaimMode(false);
      setCommentText('');
      
      setTimeout(() => {
        setShowClaimSuccessAlert(false);
        if (snapshotsStore.hasNextCamera) {
          snapshotsStore.moveToNextCamera();
        } else {
          mainPopupStore.closePopup();
        }
      }, 1000);

    } catch (error) {
      setShowClaimErrorAlert(true);
      setTimeout(() => {
        setShowClaimErrorAlert(false);
      }, 3000);
    } finally {
      setIsClaimLoading(false);
    }
  };

  const handleRecreate = async () => {
    setRefreshedSnapshotData(null);
    try {
      recreateMutation({
        snapshot_id: Number(snapshotsStore.currentCamera?.id),
      });
      snapshotsStore.stateChangesInModal = true;
      // Устанавливаем таймер на 30 секунд
      setRecreateTimer(30);
    } catch (error) {
      setRefreshedSnapshotData(null);
      setShowErrorAlert(true);
      setTimeout(() => {
        setShowErrorAlert(false);
      }, 3000);
    }
  };

  useEffect(() => {
    if (refreshedSnapshot?.data) {
      setRefreshedSnapshotData(refreshedSnapshot.data);
      // setCanRecreate(false);
    }
  }, [refreshedSnapshot?.data]);
  const { mutateAsync } = useAnnotateMutation();

  const handleRateSnapshot = async (
    rating: "dirty" | "blur" | "normal" | "undefined"
  ) => {
    try {
      const currentSnapshotId = refreshedSnapshotData?.id || snapshotsStore.currentCamera?.id;
      
      await mutateAsync({
        snapshot_id: currentSnapshotId?.toString() || "",
        annotation_label: rating,
      });

      setIsSuccess(true);
      showTemporaryAlert();

      setRefreshedSnapshotData(null);
      setCanRecreate(true);

      snapshotsStore.stateChangesInModal = true;

      // await new Promise(resolve => setTimeout(resolve, 100));

      if (snapshotsStore.hasNextCamera) {
        snapshotsStore.moveToNextCamera();
      } else {
        mainPopupStore.closePopup();
      }

    } catch (error) {
      console.error("Ошибка при оценке снимка:", error);
    }
  };

  

  useEffect(() => {
    if (isRecreateError) {
      setShowErrorAlert(true);
      // Скрываем алерт через 3 секунды
      const timeoutId = setTimeout(() => {
        setShowErrorAlert(false);
      }, 3000);

      return () => clearTimeout(timeoutId);
    }
  }, [isRecreateError]);

  useEffect(() => {
    setRefreshedSnapshotData(null);
  }, [snapshotsStore.currentCamera]);

  const commonButtonProps = {
    _focus: {
      border: "0px !important",
    },
    _active: {
      border: "0px !important",
    },
    background: "gray.200",
    width: "100%",
    size: "lg" as const,
    fontSize: "clamp(14px, 1.2vw, 20px)",
    _hover: {
      border: "none",
      background: "gray.300",
    },
    border: "none",
    padding: 2,
  };

  const createClaimButtonProps = {
    ...commonButtonProps,
    background: "orange.400",
    color: "white",
    _hover: {
      border: "none",
      bg: "orange.500",
    },
    isLoading: isClaimLoading,
    loadingText: "Создание наряда...",
  };

  return (
    <Modal isOpen={mainPopupStore.isOpen} onClose={handleClose}>
      <ModalOverlay backdropFilter={"blur(2px)"} />
      <ModalContent
        position={"relative"}
        maxWidth={"max(70%)"}
        height={isVertical ? "90%" : "auto"}
        borderRadius={"xl"}
        shadow={"2xl"}
      >
        <Box position="absolute" width="100%" zIndex={2000} >
          <SlideFade
            in={showAlert}
            offsetY="-20px"
            transition={{
              enter: { duration: 0.2 },
              exit: { duration: 0.1 },
            }}
          >
            <Alert
              status="success"
              width={"fit-content"}
              position={"absolute"}
              top={0}
              left={"50%"}
              transform={"translateX(-50%)"}
              borderBottomLeftRadius={"xl"}
              borderBottomRightRadius={"xl"}
              variant="top-accent"
            >
              <AlertIcon />
              <AlertTitle>Успешно</AlertTitle>
            </Alert>
          </SlideFade>

          <SlideFade
            in={showErrorAlert}
            offsetY="-20px"
            transition={{
              enter: { duration: 0.2 },
              exit: { duration: 0.1 },
            }}
          >
            <Alert
              status="error"
              width={"fit-content"}
              position={"absolute"}
              top={0}
              left={"50%"}
              transform={"translateX(-50%)"}
              borderBottomLeftRadius={"xl"}
              borderBottomRightRadius={"xl"}
              variant="top-accent"
            >
              <AlertIcon />
              <AlertTitle>Произошла ошибка</AlertTitle>
              <AlertDescription>Попробуйте позже</AlertDescription>
            </Alert>
          </SlideFade>

          <SlideFade in={showClaimSuccessAlert}>
            <Alert
              status="success"
              width={"fit-content"}
              position={"absolute"}
              top={0}
              left={"50%"}
              transform={"translateX(-50%)"}
              borderBottomLeftRadius={"xl"}
              borderBottomRightRadius={"xl"}
              variant="top-accent"
              zIndex={1000} 
            >
              <AlertIcon />
              <AlertTitle>Наряд успешно создан</AlertTitle>
            </Alert>
          </SlideFade>

          <SlideFade in={showClaimErrorAlert}>
            <Alert
              status="error"
              width={"fit-content"}
              position={"absolute"}
              top={0}
              left={"50%"}
              transform={"translateX(-50%)"}
              borderBottomLeftRadius={"xl"}
              borderBottomRightRadius={"xl"}
              variant="top-accent"
              zIndex={1000} 
            >
              <AlertIcon />
              <AlertTitle>Ошибка при создании наряда</AlertTitle>
            </Alert>
          </SlideFade>
        </Box>

        <ModalCloseButton
          zIndex={1500}
          background={"gray.200"}
          _hover={{ background: "orange.200" }}
        />

        <ModalBody p={'0'}>
          <Flex
            flexDirection={"column"}
            justifyContent="center"
            alignItems="center"
            height="100%"
            position="relative"
          >
            <Box width={isVertical ? "auto" : "100%"} height={isVertical ? "auto" : "100%"} position="relative" >
              <Image
                src={refreshedSnapshotData?.url || snapshotsStore.currentCamera?.url}
                alt={`Камера ${refreshedSnapshotData?.id || snapshotsStore.currentCamera?.id}`}
                maxWidth="100%"
                width={"100%"}
                borderRadius={"xl"}
                borderBottomRadius={0}
                maxHeight={isVertical ? "80vh" : "70vh"}
              />
              {isRecreatePending && (
                <Flex
                  position="absolute"
                  top={0}
                  left={0}
                  right={0}
                  bottom={0}
                  justifyContent="center"
                  alignItems="center"
                  bg="rgba(237, 242, 247, 1)" // gray.200 с прозрачностью
                  borderRadius="xl"
                  borderBottomRadius={0}
                  zIndex={1}
                >
                  <Spinner size="xl" color="orange.400" thickness="4px" />
                </Flex>
              )}
            </Box>
          </Flex>
        </ModalBody>

        <ModalFooter gap={2} pt={4}>
          {!isClaimMode ? (
            // Стандартный режим с кнопками оценки
            <>
              {(snapshotsStore.currentCamera?.need_annotate) && (
                <>
                  <Button
                    {...commonButtonProps}
                    onClick={() => handleRateSnapshot("dirty")}
                  >
                    Грязно
                  </Button>
                  <Button
                    {...commonButtonProps}
                    onClick={() => handleRateSnapshot("blur")}
                  >
                    Размыто
                  </Button>
                  <Button
                    {...commonButtonProps}
                    onClick={() => handleRateSnapshot("normal")}
                  >
                    Чисто
                  </Button>
                  <Button
                    minWidth={'min-content'} 
                    {...commonButtonProps}
                    onClick={handleRecreate}
                    loadingText="Обновление..."
                    isDisabled={isRecreatePending || recreateTimer > 0}
                  >
                    {recreateTimer > 0 ? `${recreateTimer} сек` : 'Обновить снимок'}
                  </Button>
                </>
              )}
              <Button
                {...createClaimButtonProps}
                onClick={() => setIsClaimMode(true)}
              >
                Создать наряд
              </Button>
            </>
          ) : (
            // Режим создания наряда
            <Flex direction={'column'} gap={4} w={'100%'} marginInline={'auto'}>
             
              <Flex direction="column" width="100%" gap={2} mt={4}>
                <Input
                  placeholder="Введите комментарий к наряду"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  size="lg"
                  focusBorderColor="orange.400"
                />
                
                <Flex gap={2} flexWrap="wrap" justifyContent="center" width={'100%'}>
                  {predefinedComments.map((comment, index) => (
                    <Button
                      key={index}
                      size="md"
                      onClick={() => setCommentText(comment)}
                      colorScheme="gray"
                      variant="outline"
                      flex="1"
                      minWidth="200px"
                      whiteSpace="normal"
                      height="auto"
                      py={2}
                      fontSize={'clamp(8px, 1.2vw, 14px)'}
                      fontWeight={'200'}
                    >
                      {comment}
                    </Button>
                  ))}
                </Flex>

              
              </Flex>
              <Flex gap={2} alignItems={'center'}>
                <Button
                  {...commonButtonProps}
                onClick={() => setIsClaimMode(false)}
              >
                Назад
              </Button>
              <Button
                  {...createClaimButtonProps}
                  onClick={handleCreateClaim}
                  isDisabled={!commentText.trim()}
                >
                  Создать наряд
                </Button>
              </Flex>
            </Flex>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
});

export default SnapshotActionPopup;
