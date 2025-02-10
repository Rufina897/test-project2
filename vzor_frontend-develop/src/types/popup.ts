export type PopupType = 'info' | 'warning' | 'error' | 'success' | 'cameraDetails' | 'cameraSnapshot';

export interface PopupProps {
  type: PopupType;
  message: string;
  title?: string;
  // Добавьте здесь другие необходимые пропсы
}

export interface BasePopupProps {
  onClose: () => void;
}



