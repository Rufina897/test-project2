import React, { useState } from "react";
import { observer } from "mobx-react-lite";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
  Text,
  VStack,
  Heading,
  Box,
  Image,
} from "@chakra-ui/react";
import { mainPopupStore } from "../../stores/MainPopupStore";
import { CameraData } from "src/types";
import { PopupProps } from "src/types/popup";
import ClickIcon from "../icons/ClickIcon";

interface SnapshotDetailsPopupProps extends PopupProps {
  camera: CameraData;
}


const SnapshotDetailsPopup: React.FC<SnapshotDetailsPopupProps> = observer(
  ({ camera }) => {
    const [showDetails, setShowDetails] = useState(false);

    const handleClose = () => {
      mainPopupStore.closePopup();
    };

    const toggleDetails = () => {
      setShowDetails(!showDetails);
    };

    const openSnapshotPopup = () => {
      mainPopupStore.showPopup({
        type: "cameraSnapshot",
        props: { camera },
      });
    };
 

    return (
      <Modal isOpen={mainPopupStore.isOpen} onClose={handleClose}>
        <ModalOverlay />
        <ModalContent
          borderRadius={"2xl"}
          minWidth={"fit-content"}
          padding={"20px"}
        >
          <Box display={"flex"} flexDirection={"column"} gap={"20px"}>
            <Heading textAlign={"center"} fontSize={"24px"}>Информация</Heading>
            <ModalCloseButton />
            <ModalBody width={"100%"} >
              <VStack>
                <VStack
                  alignItems={"stretch"}
                  alignSelf="start"
                  spacing={3}
                  width={"100%"}
                  paddingRight={"16px"}
                  order={2}
                >
                  <Text fontSize={"24px"} color={"gray.500"}>
                    <strong>ID Камеры:</strong> {camera.camera_id}
                  </Text>
                  <Text borderBottom={"1px solid"} borderColor={"gray.200"}>
                    <strong>IP Камеры:</strong> {camera.camera_ip}
                  </Text>
                  <Text borderBottom={"1px solid"} borderColor={"gray.200"}>
                    <strong>Название:</strong> {camera.camera_equ_name}
                  </Text>
                  <Text borderBottom={"1px solid"} borderColor={"gray.200"}>
                    <strong>Статус:</strong> {camera.nn_prediction_result}
                  </Text>

                  <Text borderBottom={"1px solid"} borderColor={"gray.200"}>
                    <strong>Дата создания:</strong>{" "}
                    {(() => {
                      const timestamp = camera.snapshot_timestamp * 1000;
                      const date = new Date(timestamp);

                      return !isNaN(date.getTime())
                        ? date.toLocaleString("ru-RU", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "Некорректная дата";
                    })()}
                  </Text>
                  <Text borderBottom={"1px solid"} borderColor={"gray.200"}>
                    <strong> Вероятность загрязнения:</strong>{" "}
                    {(camera.dirty_conf * 100).toFixed(2)}%
                  </Text>
                  <Text borderBottom={"1px solid"} borderColor={"gray.200"}>
                    <strong>Вероятность размытия:</strong>{" "}
                    {(camera.blur_conf * 100).toFixed(2)}%
                  </Text>
                  <Text borderBottom={"1px solid"} borderColor={"gray.200"}>
                    <strong> Вероятность чистоты:</strong>{" "}
                    {(camera.normal_conf * 100).toFixed(2)}%
                  </Text>
                  {/* {camera.annotations && camera.annotations.length > 0 && (
                     <Text> <strong>Аннотации:</strong> {camera.annotations.map((a) => a).join(", ")}</Text>
                  )} */}
                </VStack>
                <Box position={"relative"} onClick={openSnapshotPopup}>
                  <Image
                    src={camera.url}
                    alt={`Камера ${camera.camera_id}`}
                    mb={2}
                    maxWidth={"600px"}
                    height="auto"
                    borderRadius="2xl"
                    marginInline={"auto"}
                    cursor="pointer"
                  />
                  <ClickIcon
                    width={"60px"}
                    height={"60px"}
                    position={"absolute"}
                    left={"43%"}
                    top={"39%"}
                    cursor={"pointer"}
                  />
                </Box>
              </VStack>
            </ModalBody>
            {/* <ModalFooter>
              <Button colorScheme="blue" mr={3} onClick={handleClose}>
                Закрыть
              </Button>
              <Button onClick={toggleDetails}>
                {showDetails ? "Скрыть детали" : "Показать детали"}
              </Button>
            </ModalFooter> */}
          </Box>
        </ModalContent>
      </Modal>
    );
  }
);

export default SnapshotDetailsPopup;
