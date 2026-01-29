"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, X, Gauge } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

interface AudioPlayerProps {
  text: string;
  isVisible: boolean;
  onClose?: () => void;
}

export function AudioPlayer({ text, isVisible, onClose }: AudioPlayerProps) {
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

  const handleClose = () => {
    stopSpeaking();
    onClose?.();
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
    <div className="fixed bottom-0 left-0 right-0 z-50 animate-in slide-in-from-bottom duration-300">
      {/* Backdrop blur */}
      <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/90 to-background/50 backdrop-blur-xl border-t border-border shadow-2xl" />
      
      <div className="relative max-w-4xl mx-auto px-6 py-5">
        {/* Close Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={handleClose}
          className="absolute -top-2 right-4 h-8 w-8 rounded-full bg-muted/80 hover:bg-destructive/20 hover:text-destructive transition-colors"
          aria-label="Close player"
        >
          <X className="w-4 h-4" />
        </Button>

        {/* Player Content */}
        <div className="space-y-4">
          {/* Progress Section */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-medium">
              <span className="text-muted-foreground">{time.current}</span>
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary">
                <div className={`w-1.5 h-1.5 rounded-full ${isPlaying ? 'bg-primary animate-pulse' : 'bg-primary/50'}`} />
                <span className="text-xs font-semibold">
                  {Math.min(currentWordIndex + 1, wordsRef.current.length)} / {wordsRef.current.length} words
                </span>
              </div>
              <span className="text-muted-foreground">{time.total}</span>
            </div>
            
            <Slider
              value={[progress]}
              onValueChange={handleSliderChange}
              max={100}
              step={0.1}
              className="w-full cursor-pointer [&_[role=slider]]:h-4 [&_[role=slider]]:w-4 [&_[role=slider]]:border-2 [&_[role=slider]]:border-primary [&_[role=slider]]:bg-background [&_[role=slider]]:shadow-lg"
              aria-label="Playback progress"
            />
          </div>

          {/* Controls */}
          <div className="flex justify-center items-center gap-3">
            {/* Mute Button */}
            <Button 
              variant="ghost" 
              size="icon"
              onClick={handleMuteToggle}
              className="h-10 w-10 rounded-full hover:bg-muted transition-colors"
              aria-label={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? 
                <VolumeX className="w-5 h-5 text-muted-foreground" /> : 
                <Volume2 className="w-5 h-5 text-foreground" />
              }
            </Button>

            {/* Skip Back */}
            <Button 
              variant="ghost" 
              size="icon"
              onClick={handleSkipBack}
              className="h-11 w-11 rounded-full hover:bg-muted transition-colors"
              aria-label="Skip back 10%"
            >
              <SkipBack className="w-5 h-5 fill-foreground" />
            </Button>

            {/* Play/Pause */}
            <Button
              size="icon"
              onClick={handlePlayPause}
              className="h-16 w-16 rounded-full bg-gradient-to-br from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? 
                <Pause className="w-7 h-7 fill-primary-foreground" /> : 
                <Play className="w-7 h-7 fill-primary-foreground ml-0.5" />
              }
            </Button>

            {/* Skip Forward */}
            <Button 
              variant="ghost" 
              size="icon"
              onClick={handleSkipForward}
              className="h-11 w-11 rounded-full hover:bg-muted transition-colors"
              aria-label="Skip forward 10%"
            >
              <SkipForward className="w-5 h-5 fill-foreground" />
            </Button>

            {/* Speed Control */}
            <Button 
              variant="outline" 
              size="icon"
              onClick={handleSpeedChange}
              className="h-10 w-10 rounded-full border-2 hover:border-primary hover:bg-primary/10 transition-colors relative group"
              aria-label={`Playback speed: ${speed}x`}
            >
              <Gauge className="w-4 h-4 absolute text-muted-foreground group-hover:text-primary transition-colors" />
              <span className="text-xs font-bold mt-0.5">{speed}x</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}