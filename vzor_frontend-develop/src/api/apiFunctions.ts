import { createRequestFn } from "./apiRequests";
import {
  CameraData,
  CamerasRequest,
  StatsRequest,
  StatsData,
  AnnotateRequest,
  SuccessResponse,
  City,
  Rues,
  LoginSuccessResponse,
  LoginRequest,
  CreateClaimRequest,
  CreateClaimResponse,
  Project,
  RecreateRequest,
  RefreshTokenResponse,
  RefreshTokenRequest,
} from "../types";
import { API_PATHS } from "../constants/apiConstants";

export const fetchCameras = createRequestFn<CamerasRequest, CameraData[]>(
  API_PATHS.SNAPSHOT,
  "get"
);

export const fetchStats = createRequestFn<StatsRequest, StatsData>(
  API_PATHS.STATS,
  "get"
);

export const annotate = createRequestFn<AnnotateRequest, SuccessResponse>(
  API_PATHS.ANNOTATE,
  "post"
);

export const fetchCityList = createRequestFn<void, City[]>(
  API_PATHS.CITY_LIST,
  "get"
);

export const fetchRues = createRequestFn<void, Rues[]>(API_PATHS.RUES, "get");

export const fetchProject = createRequestFn<void, Project[]>(
  API_PATHS.PROJECT,
  "get"
);

export const login = createRequestFn<LoginRequest, LoginSuccessResponse>(
  API_PATHS.LOGIN,
  "post"
);


export const createClaim = createRequestFn<
  CreateClaimRequest,
  CreateClaimResponse
>(API_PATHS.CREATE_CLAIM, "post");



export const refreshToken = createRequestFn<RefreshTokenRequest, RefreshTokenResponse>(API_PATHS.REFRESH_TOKEN, "post");

export const recreate = createRequestFn<RecreateRequest, CameraData>(API_PATHS.RECREATE, "post");