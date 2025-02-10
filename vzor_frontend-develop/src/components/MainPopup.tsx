import React from "react";
import { observer } from "mobx-react-lite";
import { mainPopupStore } from "../stores/MainPopupStore";
import { popupComponents } from "./Popups/PopupMapping";

interface BasePopupProps {
  onClose: () => void;
}

const MainPopup = observer(() => {
  const { isOpen, config } = mainPopupStore;

  if (!isOpen || !config) {
    return null;
  }

  const PopupComponent = popupComponents[config.type] as React.ComponentType<typeof config.props & BasePopupProps>;

  return (
    <PopupComponent
      {...config.props}
      onClose={() => mainPopupStore.closePopup()}
    />
  );
});

export default MainPopup;
