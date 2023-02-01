import React, { useRef } from "react";
// import logo from './logo.svg';
import "./App.css";
import * as tf from "@tensorflow/tfjs";
import * as facemesh from "@tensorflow-models/face-landmarks-detection";
import Webcam from "react-webcam";
import { drawMesh } from "./utilities";

function App() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  //  Load posenet
  const runFacemesh = async () => {
    const net = await facemesh.load(
      facemesh.SupportedPackages.mediapipeFacemesh
    );
    setInterval(() => {
      detect(net);
    }, 0);
  };

  const detect = async (net) => {
    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4
    ) {
      // Get Video Properties
      const video = webcamRef.current.video;
      const videoWidth = webcamRef.current.video.videoWidth;
      const videoHeight = webcamRef.current.video.videoHeight;

      // Set video width
      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;

      // Set canvas width
      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;

      // Make Detections
      const face = await net.estimateFaces({ input: video });
      console.log(face);

      // Get canvas context
      const ctx = canvasRef.current.getContext("2d");

      // drawMesh(face, ctx)
      requestAnimationFrame(()=>{drawMesh(face, ctx)});
    }
  };



  runFacemesh()
  return (
    <div className="App">
      {/* <header className="App-header"> */}
        <Webcam
          ref={webcamRef}
          mirrored={true}
          content="width=device-width, initial-scale=1.0"
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            zindex: 9,
            // width: '40vw',
            // height: '40vh',
          }}
        />

        <canvas
          ref={canvasRef}
          content="width=device-width, initial-scale=1.0"
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            zindex: 9,
            // width: '40vw',
            // height: '40vh',
            transform: 'scaleX(-1)',
          }}
        />
      {/* </header> */}
    </div>
  );
}

export default App;
