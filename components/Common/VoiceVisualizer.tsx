"use client";

import { useEffect, useRef } from "react";
import { useSpeechRecognition } from "react-speech-recognition";

const VoiceVisualizer = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number | null>(null);

  const { listening } = useSpeechRecognition();

  // 오디오 및 시각화 관련 객체 refs
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);
  const historyRef = useRef<number[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const draw = () => {
      const analyser = analyserRef.current;
      const dataArray = dataArrayRef.current;
      const history = historyRef.current;

      if (!analyser || !dataArray || !ctx) return;

      analyser.getByteFrequencyData(dataArray);
      const avg = dataArray.reduce((sum, v) => sum + v, 0) / dataArray.length;

      const barWidth = 2;
      const gap = 1;
      const maxBars = Math.floor(canvas.width / (barWidth + gap));
      history.push(avg);
      if (history.length > maxBars) history.shift();

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const centerY = canvas.height / 2;
      const minHeight = 1;

      for (let i = 0; i < history.length; i++) {
        const volume = history[i] / 255;
        const height = minHeight + volume * (canvas.height - minHeight);
        const halfHeight = height / 2;
        const x = i * (barWidth + gap);

        const shade = Math.floor((1 - volume) * 200);
        ctx.fillStyle = `rgb(${shade}, ${shade}, ${shade})`;

        ctx.fillRect(x, centerY - halfHeight, barWidth, height);
      }

      animationRef.current = requestAnimationFrame(draw);
    };

    const startAudio = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        const audioCtx = new AudioContext();
        const source = audioCtx.createMediaStreamSource(stream);
        const analyser = audioCtx.createAnalyser();
        analyser.fftSize = 128;
        const dataArray = new Uint8Array(analyser.frequencyBinCount);

        audioCtxRef.current = audioCtx;
        analyserRef.current = analyser;
        sourceRef.current = source;
        streamRef.current = stream;
        dataArrayRef.current = dataArray;
        historyRef.current = [];

        source.connect(analyser);
        draw();
      } catch (error) {
        console.error("Error accessing microphone:", error);
      }
    };

    const stopAudio = () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      animationRef.current = null;

      if (audioCtxRef.current) {
        audioCtxRef.current.close();
        audioCtxRef.current = null;
      }

      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }

      analyserRef.current = null;
      sourceRef.current = null;
      dataArrayRef.current = null;
      historyRef.current = [];
    };

    if (listening) {
      startAudio();
    } else {
      stopAudio();
    }

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      stopAudio();
    };
  }, [listening]);

  return (
    <div style={{ width: "100%", height: "30px" }}>
      <canvas ref={canvasRef} style={{ width: "100%", height: "100%" }} />
    </div>
  );
};

export default VoiceVisualizer;
