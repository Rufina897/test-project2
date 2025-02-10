import { CameraData } from "src/types";

export const sortCameras = (cameras: CameraData[]): CameraData[] => {
  // Создаем копию массива, чтобы не мутировать исходный
  return [...cameras].sort((a, b) => {
    // Приоритеты категорий
    const categoryPriority: { [key: string]: number } = {
      dirty: 1,
      blur: 2,
      normal: 3,
    };

    // Определяем категории для камер
    const getCategory = (camera: CameraData) => {
      return camera.nn_prediction_result;
    };

    const categoryA = getCategory(a);
    const categoryB = getCategory(b);

    // Сначала сортируем по категориям
    if (categoryA !== categoryB) {
      return categoryPriority[categoryA] - categoryPriority[categoryB];
    }

    // Внутри категории сортируем по соответствующему conf
    if (categoryA === "dirty") {
      return b.dirty_conf - a.dirty_conf;
    } else if (categoryA === "blur") {
      return b.blur_conf - a.blur_conf;
    } else {
      // Для normal используем clean_conf (если есть) или просто 0
      return (b.normal_conf || 0) - (a.normal_conf || 0);
    }
  });
};
