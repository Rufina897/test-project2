import {
  useMutation,
  UseMutationOptions,
  useQuery,
  UseQueryOptions,
} from "@tanstack/react-query";
import {
  CameraData,
  IServerError,
  CamerasRequest,
  StatsData,
  StatsRequest,
  AnnotateRequest,
  SuccessResponse,
  City,
  Rues,
  LoginSuccessResponse,
  LoginRequest,
  CreateClaimResponse,
  CreateClaimRequest,
  Project,
  RecreateRequest,
  RefreshTokenResponse,
  RefreshTokenRequest,
} from "../types";
import { QUERY_KEYS } from "../constants/apiConstants";
import {
  annotate,
  createClaim,
  fetchCameras,
  fetchCityList,
  fetchProject,
  fetchRues,
  fetchStats,
  login,
  recreate,
  refreshToken,
} from "../api/apiFunctions";

interface ExtendedResponse<T> {
  data: T;
  headers: Record<string, string>;
}

export const useCamerasQuery = (
  body: CamerasRequest,
  options?: UseQueryOptions<ExtendedResponse<CameraData[]>, Error>
) => {
  return useQuery<ExtendedResponse<CameraData[]>, Error>({
    queryKey: [QUERY_KEYS.snapshot],
    queryFn: () => fetchCameras(body),
    staleTime: 0,
    refetchOnWindowFocus: false,
    ...options,
  });
};

export const useStatsQuery = (
  body: StatsRequest,
  options?: UseQueryOptions<ExtendedResponse<StatsData>, Error>
) => {
  return useQuery<ExtendedResponse<StatsData>, Error>({
    queryKey: [QUERY_KEYS.stats, body.project, body.city_id, body.rues],
    queryFn: () => fetchStats(body),
    refetchOnWindowFocus: false,
    ...options,
  });
};

export const useAnnotateMutation = (
  options?: UseMutationOptions<
    ExtendedResponse<SuccessResponse>,
    IServerError,
    AnnotateRequest
  >
) => {
  return useMutation<
    ExtendedResponse<SuccessResponse>,
    IServerError,
    AnnotateRequest
  >({
    mutationFn: (body) => annotate(body),
    mutationKey: [QUERY_KEYS.annotate],
    ...options,
  });
};

export const useCityListQuery = (
  options?: UseQueryOptions<ExtendedResponse<City[]>, Error>
) => {
  return useQuery<ExtendedResponse<City[]>, Error>({
    queryKey: [QUERY_KEYS.cityList],
    queryFn: () => fetchCityList(),
    refetchOnWindowFocus: false,

    ...options,
  });
};
export const useRuesQuery = (
  options?: UseQueryOptions<ExtendedResponse<Rues[]>, Error>
) => {
  return useQuery<ExtendedResponse<Rues[]>, Error>({
    queryKey: [QUERY_KEYS.rues],
    queryFn: () => fetchRues(),
    refetchOnWindowFocus: false,

    ...options,
  });
};

export const useProjectQuery = (
  options?: UseQueryOptions<ExtendedResponse<Project[]>, Error>
) => {
  return useQuery<ExtendedResponse<Project[]>, Error>({
    queryKey: [QUERY_KEYS.project],
    queryFn: () => fetchProject(),
    refetchOnWindowFocus: false,
    ...options,
  });
};

export const useLoginMutation = () => {
  return useMutation<
    ExtendedResponse<LoginSuccessResponse>,
    IServerError,
    LoginRequest
  >({
    mutationKey: [QUERY_KEYS.login],
    mutationFn: login,
  });
};


export const useCreateClaimMutation = () => {
  return useMutation<ExtendedResponse<CreateClaimResponse>, IServerError, CreateClaimRequest>({
    mutationKey: [QUERY_KEYS.createClaim],
    mutationFn: (body) => createClaim(body),
  });
};


export const useRecreateMutation = () => {
  return useMutation<ExtendedResponse<CameraData>, IServerError, RecreateRequest>({
    mutationKey: [QUERY_KEYS.recreate],
    mutationFn: (body) => recreate(body),
  });
};
  
export const useRefreshTokenMutation = (body: RefreshTokenRequest) => {
  return useMutation<ExtendedResponse<RefreshTokenResponse>, IServerError, RefreshTokenRequest>({
    mutationKey: [QUERY_KEYS.refreshToken],
    mutationFn: () => refreshToken(body),
  });
};

