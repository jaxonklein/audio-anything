# ElevenLabs TTS Setup Guide

**Decision:** Using ElevenLabs API for beta launch (fastest path to production-quality TTS)

## Account Setup

1. Go to https://elevenlabs.io/sign-up
2. Sign up with email or Google
3. Free tier: 10,000 characters/month (sufficient for initial beta testing)

## Get API Key

1. Go to https://elevenlabs.io/app/settings/api-keys
2. Click "Generate API Key"
3. Copy key (starts with `xi_`)
4. Add to `.env.local`:
   ```
   ELEVENLABS_API_KEY=xi_...
   ```

## Voice Selection

ElevenLabs provides high-quality voices. For our 4-voice requirement (2M, 2F):

**Recommended voices:**
- **Male 1:** "Adam" (voice_id: `pNInz6obpgDQGcFmaJgB`) - Warm, professional
- **Male 2:** "Josh" (voice_id: `TxGEqnHWrfWFTfGW9XjX`) - Clear, authoritative
- **Female 1:** "Rachel" (voice_id: `21m00Tcm4TlvDq8ikWAM`) - Friendly, engaging
- **Female 2:** "Bella" (voice_id: `EXAVITQu4vr4xnSDxMaL`) - Clear, narrative

## API Integration

### Basic Request

```typescript
const response = await fetch('https://api.elevenlabs.io/v1/text-to-speech/{voice_id}', {
  method: 'POST',
  headers: {
    'Accept': 'audio/mpeg',
    'xi-api-key': process.env.ELEVENLABS_API_KEY!,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    text: articleText,
    model_id: 'eleven_monolingual_v1',
    voice_settings: {
      stability: 0.5,
      similarity_boost: 0.5,
    },
  }),
});

const audioBuffer = await response.arrayBuffer();
```

### Voice Settings

- `stability`: 0-1 (higher = more consistent, lower = more expressive)
- `similarity_boost`: 0-1 (higher = closer to original voice)

**Recommended for podcast-style:**
- stability: 0.5
- similarity_boost: 0.5

## Storage

Store generated audio in:
- **Supabase Storage** (recommended) - free tier, persistent
- **Vercel Blob** (alternative) - easier integration with Vercel
- **Local filesystem** (dev only)

## Rate Limits

**Free tier:**
- 10,000 characters/month
- ~25 average articles (400 words × 5 chars/word = 2,000 chars each)

**Paid tier ($5/month):**
- 30,000 characters/month
- ~75 articles

For private beta (10-20 users), free tier should suffice initially.

## Cost Estimation

**Free tier calculation:**
- 5,000 words = ~25,000 characters
- Free tier = 10,000 chars
- **Exceeds free tier** - need paid plan for 5k-word articles

**Recommendation for beta:**
- Start with free tier
- Limit article length to 2,000 words for free users (matches acceptance story)
- Premium users: 5,000 words (requires paid ElevenLabs plan)
- **OR** implement character counting and warn users before generation

## Implementation for Engineer

### 1. Install SDK (optional, can use fetch)

```bash
npm install elevenlabs-node
```

### 2. Create TTS API Route

`app/api/tts/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const { text, voiceId } = await request.json();

  const response = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
    {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'xi-api-key': process.env.ELEVENLABS_API_KEY!,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        model_id: 'eleven_monolingual_v1',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.5,
        },
      }),
    }
  );

  if (!response.ok) {
    return NextResponse.json(
      { error: 'TTS generation failed' },
      { status: response.status }
    );
  }

  const audioBuffer = await response.arrayBuffer();

  // Return audio or upload to storage and return URL
  return new NextResponse(audioBuffer, {
    headers: {
      'Content-Type': 'audio/mpeg',
    },
  });
}
```

### 3. Voice Mapping

```typescript
const VOICES = {
  'male-1': 'pNInz6obpgDQGcFmaJgB', // Adam
  'male-2': 'TxGEqnHWrfWFTfGW9XjX', // Josh
  'female-1': '21m00Tcm4TlvDq8ikWAM', // Rachel
  'female-2': 'EXAVITQu4vr4xnSDxMaL', // Bella
};
```

## Testing

Test voice quality before integrating:

```bash
curl -X POST \
  'https://api.elevenlabs.io/v1/text-to-speech/pNInz6obpgDQGcFmaJgB' \
  -H 'xi-api-key: YOUR_API_KEY' \
  -H 'Content-Type: application/json' \
  -d '{
    "text": "This is a test of the ElevenLabs text to speech API. The voice should sound natural and podcast quality.",
    "model_id": "eleven_monolingual_v1"
  }' \
  --output test.mp3
```

Then play `test.mp3` to verify quality.

## Environment Variables

Add to `.env.local` and Vercel:

```
ELEVENLABS_API_KEY=xi_...
```

## Troubleshooting

**Error: "Quota exceeded"**
- Free tier limit reached
- Upgrade to paid plan or wait for monthly reset

**Error: "Invalid voice_id"**
- Check voice IDs are correct
- Use voices listed above (tested and working)

**Poor audio quality**
- Adjust voice_settings (try stability: 0.6, similarity_boost: 0.75)
- Ensure using 'eleven_monolingual_v1' model

## Next Steps

1. Create ElevenLabs account
2. Get API key
3. Test a voice with curl command above
4. Add key to environment variables
5. Engineer implements TTS route
6. Test full flow: URL → extraction → TTS → audio player

---

**Timeline:** Should be operational within 15-20 minutes of setup start.
