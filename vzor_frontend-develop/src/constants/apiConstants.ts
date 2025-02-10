export const BASE_URL =
  import.meta.env.VITE_API_URL 

export const API_PATHS = {
  SNAPSHOT: "/snapshot",
  STATS: "/stats",
  DOWNLOAD_PROGRESS: "/api/download-progress",
  USER: "/api/user",
  APP_SETTINGS: "/api/app-settings",
  ANNOTATE: "snapshot/annotate",
  STATUSES: "dictionary/state",
  RUES: "dictionary/rues",
  CITY_LIST: "dictionary/city",
  LOGIN: "/auth/login",
  CREATE_CLAIM: "snapshot/create-claim",
  PROJECT: "/dictionary/project",
  PREDICTION_RESULT: "/dictionary/prediction-result",
  RECREATE: 'snapshot/recreate',
  REFRESH_TOKEN: "/auth/refresh",
  // Добавьте другие пути API здесь
};

export const QUERY_KEYS = {
  snapshot: "snapshot",
  stats: "stats",
  annotate: "annotate",
  statuses: "statuses",
  cityList: "cities",
  rues: "rues",
  login: "login",
  createClaim: "create-claim",
  project: "project",
  predictionResult: "prediction-result",
  recreate: "recreate",
  refreshToken: "refresh-token",
  // Добавьте другие ключи запросов здесь
};
