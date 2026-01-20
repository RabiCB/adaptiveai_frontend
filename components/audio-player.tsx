"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

interface AudioPlayerProps {
  text: string;
  isVisible: boolean;
}

export function AudioPlayer({ text, isVisible }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);

  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const wordsRef = useRef<string[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const speeds = [0.5, 0.75, 1, 1.25, 1.5, 2];

  useEffect(() => {
    wordsRef.current = text.split(/\s+/).filter(w => w.length > 0);
  }, [text]);

  const clearIntervalRef = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const stopSpeaking = useCallback(() => {
    window.speechSynthesis.cancel();
    setIsPlaying(false);
    clearIntervalRef();
  }, [clearIntervalRef]);

  useEffect(() => {
    return () => stopSpeaking();
  }, [stopSpeaking]);

  const startSpeaking = useCallback((fromWord: number = 0) => {
    if (!("speechSynthesis" in window) || wordsRef.current.length === 0) return;

    stopSpeaking();

    const textToSpeak = wordsRef.current.slice(fromWord).join(" ");
    if (!textToSpeak) return;

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.rate = speed;
    utterance.volume = isMuted ? 0 : 1;
    utteranceRef.current = utterance;

    const totalWords = wordsRef.current.length;
    const wordsToSpeak = totalWords - fromWord;
    const avgWordsPerSecond = 2.5 * speed;
    const estimatedDuration = (wordsToSpeak / avgWordsPerSecond) * 1000;
    const updateInterval = estimatedDuration / wordsToSpeak;

    let wordIndex = fromWord;
    setCurrentWordIndex(fromWord);

    utterance.onstart = () => {
      setIsPlaying(true);
      intervalRef.current = setInterval(() => {
        wordIndex++;
        if (wordIndex < totalWords) {
          setCurrentWordIndex(wordIndex);
          setProgress((wordIndex / totalWords) * 100);
        }
      }, updateInterval);
    };

    utterance.onend = () => {
      setIsPlaying(false);
      setProgress(100);
      setCurrentWordIndex(totalWords - 1);
      clearIntervalRef();
    };

    utterance.onerror = () => {
      setIsPlaying(false);
      clearIntervalRef();
    };

    window.speechSynthesis.speak(utterance);
  }, [speed, isMuted, stopSpeaking, clearIntervalRef]);

  const handlePlayPause = () => {
    if (isPlaying) stopSpeaking();
    else {
      const startFrom = progress >= 100 ? 0 : currentWordIndex;
      if (progress >= 100) {
        setProgress(0);
        setCurrentWordIndex(0);
      }
      startSpeaking(startFrom);
    }
  };

  useEffect(() => {
    if (isVisible && wordsRef.current.length > 0) {
      startSpeaking(0);
    } else {
      stopSpeaking();
    }
  }, [isVisible, startSpeaking, stopSpeaking]);

  const handleSkipBack = () => {
    const totalWords = wordsRef.current.length;
    const newWordIndex = Math.max(0, currentWordIndex - Math.floor(totalWords * 0.1));
    setCurrentWordIndex(newWordIndex);
    setProgress((newWordIndex / totalWords) * 100);
    if (isPlaying) startSpeaking(newWordIndex);
  };

  const handleSkipForward = () => {
    const totalWords = wordsRef.current.length;
    const newWordIndex = Math.min(totalWords - 1, currentWordIndex + Math.floor(totalWords * 0.1));
    setCurrentWordIndex(newWordIndex);
    setProgress((newWordIndex / totalWords) * 100);
    if (isPlaying) startSpeaking(newWordIndex);
  };

  const handleSliderChange = (value: number[]) => {
    const newProgress = value[0];
    setProgress(newProgress);
    const totalWords = wordsRef.current.length;
    const newWordIndex = Math.floor((newProgress / 100) * totalWords);
    setCurrentWordIndex(Math.min(newWordIndex, totalWords - 1));
    if (isPlaying) startSpeaking(newWordIndex);
  };

  const handleSpeedChange = () => {
    const nextIndex = (speeds.indexOf(speed) + 1) % speeds.length;
    const newSpeed = speeds[nextIndex];
    setSpeed(newSpeed);
    if (isPlaying) startSpeaking(currentWordIndex);
  };

  const handleMuteToggle = () => {
    setIsMuted(!isMuted);
    if (utteranceRef.current) utteranceRef.current.volume = isMuted ? 1 : 0;
  };

  const formatTime = (progressPercent: number) => {
    const totalWords = wordsRef.current.length;
    const totalSeconds = totalWords / (2.5 * speed);
    const currentSeconds = (progressPercent / 100) * totalSeconds;
    const fmt = (s: number) => `${Math.floor(s / 60)}:${Math.floor(s % 60).toString().padStart(2, "0")}`;
    return { current: fmt(currentSeconds), total: fmt(totalSeconds) };
  };

  if (!isVisible) return null;

  const time = formatTime(progress);

  return (
    <div className="fixed bottom-0 left-0 w-full bg-gray-400 text-black shadow-lg p-4 flex flex-col space-y-2">
      {/* Progress bar */}
      <Slider
        value={[progress]}
        onValueChange={handleSliderChange}
        max={100}
        step={0.1}
        className="w-full accent-green-500"
        aria-label="Playback progress"
      />
      <div className="flex justify-between text-xs text-gray-400">
        <span>{time.current}</span>
        <span>{time.total}</span>
      </div>

      {/* Controls */}
      <div className="flex justify-center items-center gap-6 mt-2">
        <Button variant="ghost" size="sm" onClick={handleMuteToggle}>
          {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
        </Button>
        <Button variant="ghost" size="sm" onClick={handleSkipBack}>
          <SkipBack className="w-6 h-6" />
        </Button>
        <Button
          size="lg"
          onClick={handlePlayPause}
          className="h-14 w-14 rounded-full bg-green-500 text-black flex items-center justify-center shadow-lg hover:bg-green-600"
        >
          {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
        </Button>
        <Button variant="ghost" size="sm" onClick={handleSkipForward}>
          <SkipForward className="w-6 h-6" />
        </Button>
        <Button variant="outline" size="sm" onClick={handleSpeedChange}>
          {speed}x
        </Button>
      </div>

      {/* Word progress */}
      <div className="text-center text-gray-400 text-xs mt-1">
        Word {Math.min(currentWordIndex + 1, wordsRef.current.length)} of {wordsRef.current.length}
      </div>
    </div>
  );
}
