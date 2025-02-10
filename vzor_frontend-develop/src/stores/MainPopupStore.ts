import { makeAutoObservable } from "mobx";
import { PopupType } from "../components/Popups/PopupMapping";
import { CameraData } from "src/types";
interface BasePopupProps {
  message?: string;
  title?: string;
}

interface InfoPopupProps extends BasePopupProps {
  // Дополнительные свойства для InfoPopup
}

interface ErrorPopupProps extends BasePopupProps {
  // Дополнительные свойства для ErrorPopup
}

interface SuccessPopupProps extends BasePopupProps {
  // Дополнительные свойства для SuccessPopup
}

interface SnapshotDetailsPopupProps extends BasePopupProps {
  camera: CameraData;
}

type PopupProps =
  | InfoPopupProps
  | ErrorPopupProps
  | SuccessPopupProps
  | SnapshotDetailsPopupProps;

interface PopupConfig {
  type: PopupType;
  props: PopupProps;
}

class MainPopupStore {
  isOpen: boolean = false;
  config: PopupConfig | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  showPopup(config: PopupConfig) {
    this.config = config;
    this.isOpen = true;
  }

  closePopup() {
    this.isOpen = false;
    this.config = null;
  }
}

export const mainPopupStore = new MainPopupStore();
