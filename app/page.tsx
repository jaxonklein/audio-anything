"use client";

import { useState, useEffect, useCallback } from "react";
import { useUser, SignInButton, UserButton } from "@clerk/nextjs";
import AudioPlayer from "@/components/AudioPlayer";
import ErrorMessage from "@/components/ErrorMessage";
import DarkModeToggle from "@/components/DarkModeToggle";
import InviteFriendButton from "@/components/InviteFriendButton";
import {
  recordGeneration,
  getRemainingGenerations,
  savePlaybackPosition,
  getPlaybackPosition,
  saveAudioMetadata,
  getAudioMetadata
} from "@/lib/cookies";

export default function Home() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [url, setUrl] = useState("");
  const [text, setText] = useState("");
  const [inputMode, setInputMode] = useState<'url' | 'text'>('url');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<{
    type: 'video' | 'paywall' | 'social' | 'word_limit' | 'extraction' | 'rate_limit' | 'network' | 'generic';
    message?: string;
    wordCount?: number;
  } | null>(null);
  const [audioData, setAudioData] = useState<any>(null);
  const [remainingGens, setRemainingGens] = useState(3);
  const [resetAt, setResetAt] = useState<string | null>(null);
  const [timeUntilReset, setTimeUntilReset] = useState<string>('');

  // Check for saved audio on mount (page refresh persistence)
  useEffect(() => {
    const savedAudio = getAudioMetadata('latest');
    if (savedAudio && savedAudio.audioUrl) {
      setAudioData(savedAudio);
    }

    // Fix Bug #2: Fetch actual rate limit status from backend
    fetch('/api/rate-limit')
      .then(res => res.json())
      .then(data => {
        setRemainingGens(data.remaining);
        setResetAt(data.resetAt);
      })
      .catch(() => {
        // Fallback to cookie-based tracking if API fails
        setRemainingGens(getRemainingGenerations());
      });
  }, []);

  // Fix Bug #3: Countdown timer showing when rate limit resets
  useEffect(() => {
    if (!resetAt) return;

    const updateCountdown = () => {
      const now = Date.now();
      const reset = new Date(resetAt).getTime();
      const diff = reset - now;

      if (diff <= 0) {
        setTimeUntilReset('');
        // Rate limit has reset, refetch status
        fetch('/api/rate-limit')
          .then(res => res.json())
          .then(data => {
            setRemainingGens(data.remaining);
            setResetAt(data.resetAt);
          });
        return;
      }

      const minutes = Math.floor(diff / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);
      setTimeUntilReset(`${minutes}:${seconds.toString().padStart(2, '0')}`);
    };

    updateCountdown();
    // DISABLED: Countdown timer was causing audio seek every 1000ms
    // const interval = setInterval(updateCountdown, 1000);
    // return () => clearInterval(interval);
    return () => {};
  }, [resetAt]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate input is not empty
    const inputValue = inputMode === 'url' ? url.trim() : text.trim();
    if (!inputValue) {
      setError({
        type: 'generic',
        message: inputMode === 'url'
          ? 'Please paste an article URL'
          : 'Please paste some text to convert to audio',
      });
      return;
    }

    // Validate URL format if in URL mode
    if (inputMode === 'url') {
      try {
        const urlObj = new URL(url.trim());
        // Check if protocol is http or https
        if (!['http:', 'https:'].includes(urlObj.protocol)) {
          setError({
            type: 'generic',
            message: 'Please enter a valid HTTP or HTTPS URL',
          });
          return;
        }
      } catch {
        setError({
          type: 'generic',
          message: 'Please enter a valid URL (e.g., https://example.com/article)',
        });
        return;
      }
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: inputMode === 'url' ? url : undefined,
          text: inputMode === 'text' ? text : undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Parse error type from response
        setError({
          type: data.errorType || 'generic',
          message: data.error,
          wordCount: data.wordCount,
        });

        // Update counter even on error (especially for rate limit errors)
        if (data.remaining !== undefined) {
          setRemainingGens(data.remaining);
        }
        if (data.resetAt) {
          setResetAt(data.resetAt);
        }

        setIsLoading(false);
        return;
      }

      // Update remaining generations from API response
      if (data.rateLimit) {
        setRemainingGens(data.rateLimit.remaining);
        setResetAt(data.rateLimit.resetAt);
      } else {
        // Fallback to cookie-based tracking for backwards compatibility
        recordGeneration();
        setRemainingGens(getRemainingGenerations());
      }

      // Save audio metadata for page refresh persistence
      saveAudioMetadata('latest', data);

      setAudioData(data);
      setIsLoading(false);
    } catch (err) {
      setError({ type: 'network', message: 'Network error. Please try again.' });
      setIsLoading(false);
    }
  };

  // Memoize playback update callback to prevent AudioPlayer re-initialization on every render
  const handlePlaybackUpdate = useCallback(async (position: number) => {
    if (!audioData?.id) return;

    // Save to cookies for anonymous users
    savePlaybackPosition(audioData.id, position);

    // Save to database for authenticated users
    if (isSignedIn && audioData.id) {
      try {
        await fetch('/api/playback', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            audioItemId: audioData.id,
            position,
          }),
        });
      } catch (err) {
        console.error('Failed to save playback position:', err);
      }
    }
  }, [audioData?.id, isSignedIn]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          {/* Header with Sign In */}
          <div className="flex justify-between items-center mb-8">
            <div className="flex-1" />
            <div className="flex-1 text-center">
              <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Audio Anything
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300">
                Read less, listen more. Turn any article into podcast-quality audio instantly.
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                Paste a URL or text • Choose your voice • Listen anywhere
              </p>
            </div>
            <div className="flex-1 flex justify-end items-center gap-3">
              <DarkModeToggle />
              {!isLoaded ? (
                <div className="w-24 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
              ) : isSignedIn ? (
                <div className="flex items-center gap-3">
                  <a
                    href="/library"
                    className="px-4 py-2 text-sm font-medium text-purple-600 hover:text-purple-700 dark:text-purple-400"
                  >
                    Library
                  </a>
                  <a
                    href="/account"
                    className="px-4 py-2 text-sm font-medium text-purple-600 hover:text-purple-700 dark:text-purple-400"
                  >
                    Account
                  </a>
                  <InviteFriendButton />
                  <UserButton />
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <a
                    href="/pricing"
                    className="px-4 py-2 text-sm font-medium text-purple-600 hover:text-purple-700 dark:text-purple-400"
                  >
                    Pricing
                  </a>
                  <SignInButton mode="modal">
                    <button className="px-6 py-2 bg-white dark:bg-gray-800 border-2 border-purple-600 text-purple-600 font-semibold rounded-lg hover:bg-purple-50 dark:hover:bg-gray-700 transition-colors">
                      Sign In
                    </button>
                  </SignInButton>
                </div>
              )}
            </div>
          </div>

          {/* Features Grid (Story 1) */}
          {!audioData && !isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                <div className="text-4xl mb-3">🎙️</div>
                <h3 className="font-bold text-lg mb-2 text-gray-900 dark:text-white">Studio-Quality Voices</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Natural-sounding male and female voices that bring your content to life
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                <div className="text-4xl mb-3">⚡</div>
                <h3 className="font-bold text-lg mb-2 text-gray-900 dark:text-white">Lightning Fast</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Convert 5,000-word articles in seconds. Listen while you commute, exercise, or cook.
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                <div className="text-4xl mb-3">📱</div>
                <h3 className="font-bold text-lg mb-2 text-gray-900 dark:text-white">Listen Anywhere</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Works on all devices. Save your audio library and sync playback seamlessly.
                </p>
              </div>
            </div>
          )}

          {/* URL/Text Input Form */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Input Mode Toggle */}
              <div className="flex gap-2 mb-4 flex-wrap">
                <button
                  type="button"
                  onClick={() => setInputMode('url')}
                  className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                    inputMode === 'url'
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                  }`}
                >
                  Paste URL
                </button>
                <button
                  type="button"
                  onClick={() => setInputMode('text')}
                  className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                    inputMode === 'text'
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                  }`}
                >
                  Paste Text
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setInputMode('url');
                    setUrl('https://paulgraham.com/greatwork.html');
                  }}
                  className="px-4 py-2 rounded-lg text-sm font-medium bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors"
                >
                  ✨ Try Example Article
                </button>
              </div>

              {inputMode === 'url' ? (
                <div>
                  <label htmlFor="url" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Article URL
                  </label>
                  <input
                    type="text"
                    id="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="Paste a link to an article, blog post, or PDF"
                    required
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>
              ) : (
                <div>
                  <label htmlFor="text" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Article Text
                  </label>
                  <textarea
                    id="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Paste your article text here..."
                    required
                    rows={8}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-y"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {text.split(/\s+/).filter(Boolean).length.toLocaleString()} words (max 5,000 for free tier)
                  </p>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {isLoading ? "Generating..." : "Generate Audio"}
              </button>
            </form>
          </div>

          {/* Error Display */}
          {error && (
            <ErrorMessage
              type={error.type}
              message={error.message}
              wordCount={error.wordCount}
              onTextPaste={() => {
                setInputMode('text');
                setError(null);
              }}
            />
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
                <span className="ml-4 text-gray-600 dark:text-gray-300">Processing your content...</span>
              </div>
            </div>
          )}

          {/* Rate Limit Display */}
          {!isLoading && (
            <div className="text-center text-sm text-gray-600 dark:text-gray-400">
              <p className="font-medium">
                {remainingGens} generations remaining this hour
                {timeUntilReset && remainingGens === 0 && (
                  <span className="ml-2 text-purple-600 dark:text-purple-400">
                    (Resets in {timeUntilReset})
                  </span>
                )}
              </p>
            </div>
          )}

          {/* Audio Player */}
          {audioData && !isLoading && audioData.audioUrl && (
            <>
              {/* Sign up banner for anonymous users */}
              {!isSignedIn && (
                <div className="bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 border border-purple-200 dark:border-purple-700 rounded-xl p-4 mb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        Create a free account to access this audio on other devices
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                        Sync playback position across all your devices
                      </p>
                    </div>
                    <SignInButton mode="modal">
                      <button className="px-6 py-2 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors whitespace-nowrap ml-4">
                        Sign Up
                      </button>
                    </SignInButton>
                  </div>
                </div>
              )}

              <AudioPlayer
                title={audioData.title}
                audioUrl={audioData.audioUrl}
                sourceUrl={audioData.sourceUrl}
                expiresAt={audioData.expiresAt}
                audioItemId={audioData.id}
                initialPosition={getPlaybackPosition(audioData.id)}
                onPlaybackUpdate={handlePlaybackUpdate}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
