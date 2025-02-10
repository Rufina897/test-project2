import { CameraData } from "../types";

export const cameraMocks: CameraData[] = [
  {
    id: 50,
    nn_prediction_result: "dirt",
    camera_id: 1951,
    address: " г. КАЗАНЬ ул. ЕНИСЕЙСКАЯ д.8",
    url: "https://i.ytimg.com/vi/lmB9VWm0okU/maxresdefault.jpg",
    blur_conf: 0.082992136478424,
    dirty_conf: 0.8425977230072,
    normal_conf: 0.074410080909729,
    snapshot_timestamp: 1729502136,
  },
  {
    id: 49,
    nn_prediction_result: "normal",
    camera_id: 1952,
    address: " г. КАЗАНЬ пр-кт ИБРАГИМОВА д.20",
    url: "https://assets.gq.ru/photos/61ea5309e53049bef9c5646b/16:9/w_1280,c_limit/85855.jpg",
    blur_conf: 0.0096299629658461,
    dirty_conf: 0.095150709152222,
    normal_conf: 0.89521932601929,
    snapshot_timestamp: 1729502134,
  },
  {
    id: 48,
    nn_prediction_result: "blur",
    camera_id: 1953,
    address: " г. КАЗАНЬ пр-кт ИБРАГИМОВА д.20",
    url: "https://cdn.maximonline.ru/9c/3c/38/9c3c38c279bbc63803560d9349258150/665x374_0xac120005_20944640461529052214.jpg",
    blur_conf: 0.016902580857277,
    dirty_conf: 0.065298430621624,
    normal_conf: 0.91779893636703,
    snapshot_timestamp: 1729502132,
  },
];

export const mockFetchCameras = (): Promise<CameraData[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(cameraMocks), 1000);
  });
};
