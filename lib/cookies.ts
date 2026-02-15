// Cookie utilities for anonymous user data

export function setCookie(name: string, value: string, days: number = 1) {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
}

export function getCookie(name: string): string | null {
  const nameEQ = name + "=";
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

export function deleteCookie(name: string) {
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/`;
}

// Rate limiting: Track generation timestamps
export function recordGeneration() {
  const generations = getGenerations();
  generations.push(Date.now());
  setCookie('generations', JSON.stringify(generations), 1/24); // 1 hour
}

export function getGenerations(): number[] {
  const data = getCookie('generations');
  if (!data) return [];
  try {
    const timestamps = JSON.parse(data);
    // Filter out timestamps older than 1 hour
    const oneHourAgo = Date.now() - (60 * 60 * 1000);
    return timestamps.filter((t: number) => t > oneHourAgo);
  } catch {
    return [];
  }
}

export function getRemainingGenerations(): number {
  const generations = getGenerations();
  return Math.max(0, 3 - generations.length);
}

export function getNextResetTime(): Date | null {
  const generations = getGenerations();
  if (generations.length === 0) return null;
  const oldestGeneration = Math.min(...generations);
  return new Date(oldestGeneration + (60 * 60 * 1000)); // 1 hour from oldest
}

// Playback position tracking
export function savePlaybackPosition(audioId: string, position: number) {
  setCookie(`playback_${audioId}`, position.toString(), 1/24); // 1 hour
}

export function getPlaybackPosition(audioId: string): number {
  const pos = getCookie(`playback_${audioId}`);
  return pos ? parseFloat(pos) : 0;
}

// Audio metadata tracking
export function saveAudioMetadata(audioId: string, metadata: any) {
  setCookie(`audio_${audioId}`, JSON.stringify(metadata), 1/24); // 1 hour
}

export function getAudioMetadata(audioId: string): any | null {
  const data = getCookie(`audio_${audioId}`);
  if (!data) return null;
  try {
    return JSON.parse(data);
  } catch {
    return null;
  }
}
