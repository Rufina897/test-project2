import React, { useState, useEffect, useCallback } from "react";
import {
  SimpleGrid,
  Center,
  Spinner,
  Box,
  Flex,
  Select,
  Text,
  Button,
  Radio,
  RadioGroup,
  Stack,
} from "@chakra-ui/react";
import {SnapshotCard, StatCard, CircularProgress} from "../components";
import { SegmentData } from "../components/CircularProgress";
import { CameraData } from "src/types";
import { sortCameras } from "../utils/SortCameras";
import { capitalize } from "lodash";
import {
  useCamerasQuery,
  useCityListQuery,
  useProjectQuery,
  useRuesQuery,
  useStatsQuery,
} from "../hooks/useQueries";
import { snapshotsStore } from "../stores/SnapshotsStore";
import { usePagination } from "../hooks/usePagination";
import { mainPopupStore } from "../stores/MainPopupStore";
import { observer } from "mobx-react-lite";
import { refreshToken } from "@/api/axiosConfig";
import { SearchBar } from "../components/SearchBar";
import { createPortal } from 'react-dom';


const PAGES_PER_GROUP = 3;

// Функция для получения отображаемых страниц
const getVisiblePages = (currentPage: number, totalPages: number) => {
  let start = Math.floor((currentPage - 1) / PAGES_PER_GROUP) * PAGES_PER_GROUP + 1;
  let end = Math.min(start + PAGES_PER_GROUP - 1, totalPages);

  const visiblePages = [];
  const showLeftDots = start > 1;
  const showRightDots = end < totalPages;

  if (showLeftDots) {
    visiblePages.push(1);
    if (start > 2) visiblePages.push('...');
  }

  for (let i = start; i <= end; i++) {
    visiblePages.push(i);
  }

  if (showRightDots) {
    if (end < totalPages - 1) visiblePages.push('...');
    visiblePages.push(totalPages);
  }

  return visiblePages;
};

interface Filters {
  searchQuery: string;
  // ... остальные поля
}

const Dashboard: React.FC = observer(() => {

  const token = localStorage.getItem("token");


  const [cameras, setCameras] = useState<CameraData[]>([]);
  const [filterType, setFilterType] = useState<string | null>("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const [rues, setRues] = useState<string>("");
  const [project, setProject] = useState<string>("");
  const [predictionResult, setPredictionResult] = useState<string>("");
  const [unannotatedOnly, setUnannotatedOnly] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const {
    data: camerasQuery,
    isLoading: isLoadingCameras,
    error: errorCameras,
    refetch: refetchCameras,
  } = useCamerasQuery({
    page,
    city_id: selectedLocation || "",
    rues,
    project,
    prediction_result: predictionResult,
    is_annotated: unannotatedOnly,
    search_input: searchQuery,
  });

  const {
    data: cityListQuery,
    isLoading: isLoadingCityList,
    error: errorCityList,
  } = useCityListQuery();

  const {
    data: ruesQuery,
    isLoading: isLoadingRues,
    error: errorRues,
  } = useRuesQuery();

  const {
    data: projectQuery,
    isLoading: isLoadingProject,
    error: errorProject,
  } = useProjectQuery();



  const {
    data: statsQuery,
    isLoading: isLoadingStats,
    error: errorStats,
    refetch: refetchStats,
  } = useStatsQuery({
    project: project || undefined,
    city_id: selectedLocation ? selectedLocation.toString() : undefined,
    rues: rues || undefined
  });

  useEffect(() => {
    refetchStats();
  }, [filterType, selectedLocation, rues, project]);

  useEffect(() => {
    if (snapshotsStore.stateChangesInModal && !mainPopupStore.isOpen) {
      refetchStats();
      refetchCameras()
      snapshotsStore.stateChangesInModal = false
    }
  }, [snapshotsStore.stateChangesInModal, mainPopupStore.isOpen]);

  const handleSnapshotClick = (snapshot: CameraData) => {
    snapshotsStore.setCurrentCamera(snapshot);
    snapshotsStore.setCurrentCameraIndex(
      snapshotsStore.cameras.findIndex((c) => c.id === snapshot.id)
    );
  };

  useEffect(() => {
    refetchCameras();
  }, [page, filterType, selectedLocation, rues, project, predictionResult, unannotatedOnly, searchQuery]);

  useEffect(() => {
    if (camerasQuery) {
      setIsLoading(false);
      const sortedCameras = sortCameras(camerasQuery.data);
      setCameras(sortedCameras);
      snapshotsStore.setCameras(sortedCameras);
    }
  }, [camerasQuery]);

  const segmentData: SegmentData[] = statsQuery?.data
    ? [
        {
          value: Number(statsQuery.data.dirty) || 0,
          color: "#FF6B6B",
          label: "Грязные камеры",
        },
        {
          value: Number(statsQuery.data.blur) || 0,
          color: "#4ECDC4",
          label: "Размытые камеры",
        },
        {
          value: Number(statsQuery.data.normal) || 0,
          color: "#FFA500",
          label: "Чистые камеры",
        },
      ]
    : [];

  const {
    currentPage,
    pageCount,
    nextPage,
    prevPage,
    setPage: setPaginationPage,
    canNextPage,
    canPrevPage,
    pages,
  } = usePagination({
    headers: camerasQuery?.headers,
  });


  // Обновляем запрос при изменении страницы
  useEffect(() => {
    setPage(currentPage);
  }, [currentPage]);

  const visiblePages = getVisiblePages(currentPage, pageCount);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    setPaginationPage(1); // Сброс на первую страницу при поиске
  }, []);

  if (isLoading) {
    return (
      <Center h="100vh">
        <Spinner size="xl" />
      </Center>
    );
  }

  if (error) {
    return <Center h="100vh">Ошибка: {error}</Center>;
  }

  return (
    <Box p={4} height={"100%"} pt={12} background={"gray.100"}>
      <Box
        background={"white"}
        p={8}
        borderRadius={"2xl"}
        height={"calc(100% - 20px)"}
        mx={"auto"}
      >
        <Box display={"flex"} justifyContent={"space-between"}>
          <Box
            display={"flex"}
            flexDirection={"column"}
            justifyContent={"space-between"}
          >
            <Flex gap={4} mb={6}>
              {isLoadingStats ? (
                <Spinner size="sm" />
              ) : (
                <>
                  <StatCard
                    title="Всего камер"
                    value={statsQuery?.data?.total || 0}
                  />
                  <StatCard
                    title="Грязные камеры"
                    value={statsQuery?.data?.dirty || 0}
                  />
                  <StatCard
                    title="Размытые камеры"
                    value={statsQuery?.data?.blur || 0}
                  />
                </>
              )}
            </Flex>
            <Flex my={4} gap={4} alignItems="center">
            <Select
                width={"200px"}
                focusBorderColor="orange.400"
                borderColor="orange.400"
                borderRadius={"2xl"}
                value={rues}
                onChange={(e) => setRues(e.target.value)}
              >
                <option value="">Все филиалы</option>
                {ruesQuery?.data?.map((ruesItem, index) => (
                  <option key={index} value={ruesItem.rues}>
                    {ruesItem.rues}
                  </option>
                ))}
              </Select>
            <Select
                width={"200px"}
                focusBorderColor="orange.400"
                borderColor="orange.400"
                borderRadius={"2xl"}
                value={project}
                onChange={(e) => setProject(e.target.value)}
              >
                <option value="">Все сегменты</option>
                {projectQuery?.data?.map((projectItem, index) => (
                  <option key={index} value={projectItem.project_name}>
                    {projectItem.project_name}
                  </option>
                ))}
              </Select>
              <Select
                w={"200px"}
                value={selectedLocation || ""}
                onChange={(e) => setSelectedLocation(Number(e.target.value))}
                focusBorderColor="orange.400"
                borderColor="orange.400"
                borderRadius={"2xl"}
              >
                <option value="">Все локации</option>
                {cityListQuery?.data?.map((city) => (
                  <option key={city.city_id} value={city.city_id}>
                    {capitalize(city.city_name)}
                  </option>
                ))}
              </Select>
              <Select
                w={"200px"}
                value={predictionResult || ""}
                onChange={(e) => setPredictionResult(e.target.value)}
                focusBorderColor="orange.400"
                borderColor="orange.400"
                borderRadius={"2xl"}
              >
                <option value="">Все камеры</option>
                <option value="dirty">Грязные камеры</option>
                <option value="blur">Размытые камеры</option>
                <option value="normal">Чистые камеры</option>
              </Select>

              {/* TODO: Добавить радиобаттоны */}
             
            </Flex>
        
          </Box>
         
          {isLoadingStats ? (
            <Center w="220px">
              <Spinner size="xl" />
            </Center>
          ) : (
            <CircularProgress size={220} data={segmentData} />
          )}
        </Box>
        <RadioGroup marginBottom={4} defaultValue='' onChange={(value) => setUnannotatedOnly(value)}>
                <Stack spacing={5} direction='row'>
                  <Radio colorScheme='orange' value=''>
                    Все
                    </Radio>
                    <Radio colorScheme='orange' value='no'>
                     Неотмеченные
                  </Radio>
                    <Radio colorScheme='orange' value='yes'>
                    Отмеченные
                  </Radio>
                </Stack>
              </RadioGroup>
        {cameras.length > 0 ? (
          <SimpleGrid columns={[1, 2, 3]} spacing={6}>
            {cameras.map((camera) => (
              <SnapshotCard
                key={camera.id}
                camera={camera}
                onClick={() => handleSnapshotClick(camera)}
              />
            ))}
          </SimpleGrid>
        ) : (
          <Center py={8}>
            <Text fontSize="lg" color="gray.500">
              Не найдено
            </Text>
          </Center>
        )}

        <Flex justify="center" mt={6} gap={2} p={4}>
          <Button
            onClick={prevPage}
            isDisabled={!canPrevPage}
            colorScheme="orange"
            size="sm"
          >
            Назад
          </Button>

          {visiblePages.map((page, index) => 
            page === '...' ? (
              <Text key={`dots-${index}`} alignSelf="center">...</Text>
            ) : (
              <Button
                key={page}
                onClick={() => {
                  setPage(Number(page));
                  setPaginationPage(Number(page));
                }}
                colorScheme={currentPage === page ? "orange" : "gray"}
                variant={currentPage === page ? "solid" : "outline"}
                size="sm"
              >
                {page}
              </Button>
            )
          )} 

          <Button
            onClick={nextPage}
            isDisabled={!canNextPage}
            colorScheme="orange"
            size="sm"
          >
            Вперед
          </Button>
        </Flex>
        {createPortal(
          <SearchBar onSearch={handleSearch} />,
          document.getElementById('search-bar-portal')!
        )}
      </Box>
    </Box>
  );
});

export default Dashboard;
