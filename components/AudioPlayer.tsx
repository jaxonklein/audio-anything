"use client";

import { useEffect, useRef, useState } from "react";

interface AudioPlayerProps {
  title: string;
  audioUrl: string;
  sourceUrl?: string;
  onPlaybackUpdate?: (position: number) => void;
  initialPosition?: number;
  expiresAt?: string;
  onVoiceRegenerate?: (voiceId: string) => void;
  sourceText?: string;
  audioItemId?: string;
}

const PLAYBACK_SPEEDS = [1, 1.5, 2];
const VOICES = [
  { id: "male1", label: "Male 1" },
  { id: "male2", label: "Male 2" },
  { id: "female1", label: "Female 1" },
  { id: "female2", label: "Female 2" },
];

export default function AudioPlayer({
  title,
  audioUrl,
  sourceUrl,
  onPlaybackUpdate,
  initialPosition = 0,
  expiresAt,
  onVoiceRegenerate,
  sourceText,
  audioItemId,
}: AudioPlayerProps) {
  // Diagnostic: Log version info to confirm 718a009 is deployed
  if (typeof window !== 'undefined') {
    console.log('[AudioPlayer] Version 718a009 loaded - fix deployed');
  }

  const audioRef = useRef<HTMLAudioElement>(null);
  const sliderRef = useRef<HTMLInputElement>(null);
  const lastTimeUpdateRef = useRef<number>(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0); // Always start at 0 (position saving disabled)
  const [duration, setDuration] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [selectedVoice, setSelectedVoice] = useState("male1");
  const [volume, setVolume] = useState(1);
  const [isExpired, setIsExpired] = useState(false);
  const [showExpiryWarning, setShowExpiryWarning] = useState(false);
  const [timeUntilExpiry, setTimeUntilExpiry] = useState<number | null>(null);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [showRegenerateConfirm, setShowRegenerateConfirm] = useState(false);

  // Check expiration status
  useEffect(() => {
    if (!expiresAt) return;

    const checkExpiration = () => {
      const now = new Date().getTime();
      const expiryTime = new Date(expiresAt).getTime();
      const timeLeft = expiryTime - now;

      setTimeUntilExpiry(timeLeft);

      if (timeLeft <= 0) {
        setIsExpired(true);
        setIsPlaying(false);
        if (audioRef.current) {
          audioRef.current.pause();
        }
      } else if (timeLeft <= 5 * 60 * 1000) {
        // Show warning 5 minutes before expiry
        setShowExpiryWarning(true);
      }
    };

    checkExpiration();
    // DISABLED: Expiration check interval was causing audio seek every 1000ms
    // const interval = setInterval(checkExpiration, 1000);
    // return () => clearInterval(interval);
    return () => {};
  }, [expiresAt]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // DISABLED: Initial position seeking was causing loop bug
    // TODO: Re-enable after fixing the re-render loop issue
    // if (initialPosition > 0) {
    //   audio.currentTime = initialPosition;
    // }

    // Update duration when metadata loads
    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    // Update current time as audio plays
    const handleTimeUpdate = () => {
      // Update slider directly via DOM to avoid React re-renders
      // This prevents potential issues with frequently changing React state
      if (sliderRef.current) {
        sliderRef.current.value = audio.currentTime.toString();
      }

      // Still update state, but less frequently (every second instead of every 250ms)
      const now = Date.now();
      if (now - lastTimeUpdateRef.current > 1000) {
        setCurrentTime(audio.currentTime);
        lastTimeUpdateRef.current = now;
      }

      // DISABLED: Playback position saving was causing loop bug
      // TODO: Re-enable after fixing the re-render loop issue
      // if (onPlaybackUpdate && Math.floor(audio.currentTime) % 5 === 0) {
      //   onPlaybackUpdate(audio.currentTime);
      // }
    };

    // Handle audio end
    const handleEnded = () => {
      setIsPlaying(false);
    };

    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("ended", handleEnded);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty deps - only run on mount, not when callbacks change

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;

    const newTime = parseFloat(e.target.value);
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleSpeedChange = (speed: number) => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.playbackRate = speed;
    setPlaybackSpeed(speed);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Show expired state
  if (isExpired) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
        <div className="text-center">
          <div className="text-6xl mb-4">⏱️</div>
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
            This link expired after 1 hour
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Upgrade to Premium to save audio files permanently, or create a free account to extend access.
          </p>
          <div className="flex gap-4 justify-center">
            <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
              Upgrade to Premium
            </button>
            <button
              onClick={() => window.location.reload()}
              className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Regenerate Audio
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
      {/* Expiry Warning Banner (Story 5) */}
      {showExpiryWarning && !isExpired && (
        <div className="mb-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm text-yellow-900 dark:text-yellow-100">
              <span className="font-semibold">This audio will expire in {Math.ceil((timeUntilExpiry || 0) / 60000)} minutes.</span> Create a free account or upgrade to Premium to keep it.
            </p>
            <div className="flex gap-2 mt-2">
              <button className="text-xs bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded transition-colors">
                Upgrade
              </button>
              <button className="text-xs bg-yellow-100 dark:bg-yellow-900 hover:bg-yellow-200 dark:hover:bg-yellow-800 text-yellow-900 dark:text-yellow-100 px-3 py-1 rounded transition-colors">
                Sign Up Free
              </button>
            </div>
          </div>
          <button
            onClick={() => setShowExpiryWarning(false)}
            className="text-yellow-600 dark:text-yellow-400 hover:text-yellow-800 dark:hover:text-yellow-200 ml-4"
          >
            ✕
          </button>
        </div>
      )}

      {/* Title and Source */}
      <div className="mb-4">
        <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
          {title}
        </h2>
        {sourceUrl && (
          <a
            href={sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
          >
            {sourceUrl.length > 60 ? sourceUrl.slice(0, 60) + "..." : sourceUrl}
          </a>
        )}
      </div>

      {/* Audio Element (hidden) */}
      {/* Changed preload from "metadata" to "auto" to avoid range-request seeking issues with data URLs */}
      {/* Added key prop to prevent unnecessary re-mounting when parent re-renders */}
      <audio
        key={audioItemId || audioUrl.substring(0, 100)}
        ref={audioRef}
        src={audioUrl}
        preload="auto"
        loop={false}
      />

      {/* Waveform Visualization (simplified for now - will enhance later) */}
      <div className="mb-4 h-24 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
        <div className="flex items-end gap-1 h-16">
          {Array.from({ length: 50 }).map((_, i) => (
            <div
              key={i}
              className="w-1 bg-purple-600 rounded-t"
              style={{
                height: `${Math.random() * 100}%`,
                opacity: currentTime / duration > i / 50 ? 1 : 0.3,
              }}
            />
          ))}
        </div>
      </div>

      {/* Seek Bar */}
      <div className="mb-4">
        <input
          ref={sliderRef}
          type="range"
          min="0"
          max={duration || 0}
          defaultValue="0"
          onChange={handleSeek}
          className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-600"
        />
        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mt-1">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-2 sm:justify-between mb-4">
        {/* Play/Pause Button */}
        <button
          onClick={togglePlayPause}
          className="bg-purple-600 hover:bg-purple-700 text-white rounded-full w-14 h-14 sm:w-12 sm:h-12 flex items-center justify-center transition-colors flex-shrink-0"
        >
          {isPlaying ? (
            <svg className="w-7 h-7 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 20 20">
              <path d="M6 4h2v12H6V4zm6 0h2v12h-2V4z" />
            </svg>
          ) : (
            <svg className="w-7 h-7 sm:w-6 sm:h-6 ml-1" fill="currentColor" viewBox="0 0 20 20">
              <path d="M6 4l10 6-10 6V4z" />
            </svg>
          )}
        </button>

        {/* Playback Speed */}
        <div className="flex gap-2">
          {PLAYBACK_SPEEDS.map((speed) => (
            <button
              key={speed}
              onClick={() => handleSpeedChange(speed)}
              className={`px-4 py-2 sm:px-3 sm:py-1 rounded-full text-sm font-medium transition-colors ${
                playbackSpeed === speed
                  ? "bg-purple-600 text-white"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
              }`}
            >
              {speed}x
            </button>
          ))}
        </div>

        {/* Voice Selector with Regenerate */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={selectedVoice}
            onChange={(e) => setSelectedVoice(e.target.value)}
            className="flex-1 sm:flex-initial px-3 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-none focus:ring-2 focus:ring-purple-500 text-sm"
          >
            {VOICES.map((voice) => (
              <option key={voice.id} value={voice.id}>
                {voice.label}
              </option>
            ))}
          </select>
          <button
            onClick={() => setShowRegenerateConfirm(true)}
            disabled={isRegenerating}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white rounded-lg text-sm font-medium transition-colors flex-shrink-0"
            title="Regenerate audio with selected voice"
          >
            {isRegenerating ? "..." : "↻"}
          </button>
        </div>
      </div>

      {/* Regenerate Confirmation Modal */}
      {showRegenerateConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowRegenerateConfirm(false)}>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md mx-4" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
              Regenerate Audio?
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              This will create a new audio version with <strong>{VOICES.find(v => v.id === selectedVoice)?.label}</strong> voice.
              Your playback position will be preserved.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowRegenerateConfirm(false)}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  setShowRegenerateConfirm(false);
                  setIsRegenerating(true);
                  if (onVoiceRegenerate) {
                    await onVoiceRegenerate(selectedVoice);
                  }
                  setIsRegenerating(false);
                }}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
              >
                Regenerate
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rate Limit Indicator - moved to homepage */}

      {/* Upgrade Banner */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <p className="text-sm text-blue-900 dark:text-blue-100 mb-2">
          Create a free account to access this audio on other devices
        </p>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
          Sign Up Free
        </button>
      </div>
    </div>
  );
}
