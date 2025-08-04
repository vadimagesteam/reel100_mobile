import { Dispatch, SetStateAction, useState } from 'react';

export type UseCameraFeatures = {
  cameraPosition: 'front' | 'back';
  setCameraPosition: Dispatch<SetStateAction<'front' | 'back'>>;
  torchOn: boolean;
  setTorchOn: Dispatch<SetStateAction<boolean>>;
  frameRate: 30 | 60;
  setFrameRate: Dispatch<SetStateAction<30 | 60>>;
};

export const useCameraFeatures = (): UseCameraFeatures => {
  const [cameraPosition, setCameraPosition] = useState<UseCameraFeatures['cameraPosition']>('back');
  const [torchOn, setTorchOn] = useState(false);
  const [frameRate, setFrameRate] = useState<UseCameraFeatures['frameRate']>(30);

  return {
    cameraPosition,
    setCameraPosition,
    torchOn,
    setTorchOn,
    frameRate,
    setFrameRate,
  };
};
