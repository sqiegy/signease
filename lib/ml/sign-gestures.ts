import { Finger, FingerCurl, FingerDirection } from 'fingerpose';

// Define basic ISL alphabet gestures
export const signGestures = [
  {
    name: 'A',
    algorithm: (landmarks: number[][]) => {
      const thumbIsStretched = landmarks[4][1] > landmarks[3][1];
      const otherFingersCurled = landmarks.slice(5).every((point, i) => 
        point[1] < landmarks[i + 6][1]
      );
      return thumbIsStretched && otherFingersCurled ? 1 : 0;
    }
  },
  // Add more gestures for other letters/numbers
];

// Helper function to calculate angles between landmarks
export function calculateAngle(a: number[], b: number[], c: number[]) {
  const radians = Math.atan2(c[1] - b[1], c[0] - b[0]) -
                 Math.atan2(a[1] - b[1], a[0] - b[0]);
  let angle = Math.abs(radians * 180.0 / Math.PI);
  
  if (angle > 180.0) {
    angle = 360 - angle;
  }
  return angle;
}