import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-backend-webgl';
import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import 'regenerator-runtime/runtime';
import App from './App.tsx';

const initializeTF = async () => {
  await tf.setBackend('webgl');
  await tf.ready();
  console.log("✅ TensorFlow.js WebGL backend is ready");
};

initializeTF().then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
});
