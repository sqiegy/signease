import * as tf from '@tensorflow/tfjs';
import * as handpose from '@tensorflow-models/handpose';
import { GestureEstimator } from 'fingerpose';
import { signGestures } from './sign-gestures';

let model: handpose.HandPose | null = null;
const gestureEstimator = new GestureEstimator(signGestures);

export async function loadHandposeModel() {
  if (!model) {
    model = await handpose.load();
  }
  return model;
}

export async function detectHandGestures(video: HTMLVideoElement) {
  if (!model) {
    throw new Error('Model not loaded');
  }

  // Detect hand landmarks
  const predictions = await model.estimateHands(video);
  
  if (!predictions.length) {
    return null;
  }

  // Estimate gestures based on landmarks
  const gestureEstimations = await gestureEstimator.estimate(predictions[0].landmarks, 7.5);
  
  if (!gestureEstimations.gestures.length) {
    return null;
  }

  // Return the gesture with highest confidence
  return gestureEstimations.gestures.reduce((p, c) => 
    p.confidence > c.confidence ? p : c
  );
}