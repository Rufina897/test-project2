import { makeAutoObservable } from "mobx";
import { CameraData } from "src/types";
import { mainPopupStore } from "./MainPopupStore";

class SnapshotsStore {

  cameras: CameraData[] = [];
  stateChangesInModal: boolean = false

  currentCameraIndex: number = 0;

  constructor() {

    makeAutoObservable(this);
    
  }


  setCameras(cameras: CameraData[]) {
    this.cameras = cameras;
    this.currentCameraIndex = 0; 
  }

 
  setCurrentCameraIndex(index: number) {
    if (index >= 0 && index < this.cameras.length) {
      this.currentCameraIndex = index;
    }
  }
  setCurrentCamera(camera: CameraData | null) {
    this.currentCameraIndex = this.cameras.findIndex((c) => c.id === camera?.id);
  }



  get currentCamera(): CameraData | null {
    return this.cameras[this.currentCameraIndex] || null;
  }

  get hasNextCamera(): boolean {
    return this.currentCameraIndex < this.cameras.length - 1;
  }


  moveToNextCamera(): boolean {  
    if (this.hasNextCamera) {
      this.currentCameraIndex++;
      
      if (this.stateChangesInModal && 
          this.currentCamera?.annotations && 
          this.currentCamera.annotations.length > 0) {
        return this.moveToNextCamera();
      }
      
      return true;
    } else {
      // Если это последняя камера, закрываем попап
      mainPopupStore.closePopup();
      return false;
    }
  }

  updateCurrentCamera(camera: CameraData) {
    if (this.currentCamera) {
      this.cameras[this.currentCameraIndex] = camera;
    }
  }
}

export const snapshotsStore = new SnapshotsStore();