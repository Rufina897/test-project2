import SnapshotDetailsPopup from "./SnapshotDetailsPopup";
import SnapshotActionPopup from "./SnapshotActionPopup";

export const popupComponents = {
  cameraDetails: SnapshotDetailsPopup,
  cameraSnapshot: SnapshotActionPopup,
};

export type PopupType = keyof typeof popupComponents;
