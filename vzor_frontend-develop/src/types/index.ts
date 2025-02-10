// Здесь будут определены общие типы
export interface User {
  id: number;
  name: string;
  email: string;
}

export interface CameraData {
  id: number;
  nn_prediction_result: string;
  camera_id: number;
  address: string;
  url: string;
  blur_conf: number;
  dirty_conf: number;
  normal_conf: number;
  snapshot_timestamp: number;
  camera_equ_name?: string;
  camera_ip?: string;
  annotations?: Annotation[];
  need_annotate?: boolean;
}

export interface Annotation {
  id: number;
  label: string;
  created_at: string;
  created_by: string;
}

export interface City {
  city_id: number;
  city_name: string;
}

export interface Rues {
  rues: string;
}

export interface Project {
  project_name: string;
}

export interface CamerasRequest {
  page: number;
  state_name?: string;
  city_id?: number | string;
  rues?: string;
  project?: string;
  prediction_result?: string;
  is_annotated?: string;
  search_input?: string;
}


export interface IServerError {
  message: string;
  code: number;
}

export interface StatsData {
  total: string;
  dirty: string;
  normal: string;
  blur: string;
}

export interface StatsRequest {
  project?: string;
  city_id?: string;
  rues?: string;
}

export interface AnnotateRequest {
  snapshot_id: string;
  annotation_label: string;
}

export interface SuccessResponse {
  message: string;
}

export interface AppSettings {
  theme: "light" | "dark";
  language: string;
  // Добавьте другие настройки приложения
}

export interface PaginationParams {
  page?: number;
  per_page?: number;
}

export interface PaginationMeta {
  currentPage: number;
  pageCount: number;
  perPage: number;
  totalCount: number;
}

export interface PaginatedResponse<T> {
  data: T;
  pagination: PaginationMeta;
}

export interface LoginSuccessResponse {
  status: number;
  message: string;
  data: {
    access_token: string;
    refresh_token: string;  
  };
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface CreateClaimRequest {
  snapshot_id: number;
  comment: string;
}

export interface CreateClaimResponse {
  success: boolean;
}


export interface RecreateRequest {
  snapshot_id: number;
}

export interface RefreshTokenResponse {
  status: number;
  message: string;
  data: {
    access_token: string;
  }
}

export interface RefreshTokenRequest {
  refresh_token: string;
}