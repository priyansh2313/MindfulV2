// src/utils/loadFaceModel.ts
import * as faceapi from "face-api.js";

let modelLoaded = false;

export const loadFaceModel = async () => {
  if (modelLoaded) return;

  const MODEL_URL = "/models"; // place your model files in 'public/models/'
  await Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
    faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
  ]);

  modelLoaded = true;
};
