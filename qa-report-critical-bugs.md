# CRITICAL BUGS FOUND - QA TESTING
**Date**: 2026-02-15 06:18 UTC
**Tester**: @audio-anything-ic-engineer-2 (Sable Reeves)

---

## BUG 1: Generate Audio Button Does Nothing ⚠️ BLOCKS ALL TESTING

**Severity**: CRITICAL
**Status**: NEW - Not yet fixed
**Assigned to**: @audio-anything-ic-engineer-1

### Description
Clicking the "Generate Audio" button has no effect. No loading state appears, no audio player shows up.

### Steps to Reproduce
1. Navigate to `localhost:3000?invite=BETA-FOUNDER`
2. Enter URL in textbox: `https://techcrunch.com/2024/01/15/how-to-build-a-startup`
3. Click "Generate Audio" button
4. Observe result

### Expected Behavior (per Story 1)
- **Step 4**: See loading state with queue position ("Position in queue: 2")
- **Step 5**: After processing, see audio player with waveform, play/pause, scrubbing, speed selector, voice dropdown, article title

### Actual Behavior
- ❌ No loading state appears
- ❌ No audio player appears
- ❌ Page looks identical before and after click
- ❌ URL changed from `?invite=BETA-FOUNDER` to `/` (beta access check may have failed)
- ❌ Button is clickable but does nothing

### Console Errors Detected
```
[ERROR] Failed to load resource: 404 @ http://localhost:3000/_next/static/chunks/main-app.js
[ERROR] Failed to load resource: 404 @ http://localhost:3000/_next/static/chunks/app-pages-internals.js
```

### Root Cause Analysis
Critical Next.js JavaScript chunks are returning 404 errors. This suggests:
1. The build is incomplete or corrupted
2. Static assets aren't being served correctly from `.next/` directory
3. The app may need a clean rebuild
4. Dev server may not be running properly

### Investigation Steps Needed
1. ✅ Verify dev server is running: `npm run dev`
2. ⚠️ Check if `.next/` directory exists and has recent build artifacts
3. ⚠️ Run clean build: `rm -rf .next && npm run build && npm run dev`
4. ⚠️ Check if onClick handler is wired to the button
5. ⚠️ Check browser network tab to see if API calls are being made
6. ⚠️ Verify form submission isn't being blocked

### Impact
**BLOCKS**: All audio generation testing
- Story 1 Steps 3-8: Cannot test
- Story 3: Rate limiting (requires generation)
- Story 4-13: All require audio generation
- **Estimated stories blocked**: 11 out of 16

---

## BUG 2: Dark Mode Toggle Does Not Work

**Severity**: HIGH
**Status**: ATTEMPTED FIX FAILED
**Assigned to**: @audio-anything-ic-engineer-1
**Beads Task**: task-f612b38dbe7f

### Description
Clicking the dark mode toggle button has no visual effect. Color scheme does not invert.

### Steps to Reproduce
1. Navigate to `localhost:3000?invite=BETA-FOUNDER`
2. Click "Switch to dark mode" button (moon icon in header)
3. Observe page appearance

### Expected Behavior (per Story 14)
- Background inverts to dark
- Text inverts to light
- Blue accent adjusts
- Button label changes to "Switch to light mode"

### Actual Behavior
- ❌ Background stays light/off-white
- ❌ Text stays dark
- ❌ No color changes occur
- ❌ Button label stays "Switch to dark mode"

### Engineer's Previous Fix Attempt
Added `darkMode: 'class'` to `tailwind.config.ts` - this did NOT resolve the issue.

### Additional Investigation Needed
The Tailwind config change is necessary but not sufficient. Need to check:
1. ⚠️ Is onClick handler properly toggling theme state?
2. ⚠️ Is the `dark` class being applied to `<html>` or `<body>` when state changes?
3. ⚠️ Are dark mode variants defined in component styles (e.g., `dark:bg-gray-900`)?
4. ⚠️ Is theme state persisting in localStorage/cookies?

### Evidence
- **Before click**: qa-verify-light-mode.png (light background)
- **After click**: qa-verify-dark-mode.png (identical - still light)

### Impact
**BLOCKS**: Story 14 Step 4 (Dark mode toggle)
- Medium priority - doesn't block other testing
- Must-have feature per acceptance stories

---

## BUG 3: Generate Audio Button Was Disabled (FIXED ✅)

**Severity**: CRITICAL
**Status**: ✅ VERIFIED FIXED
**Assigned to**: @audio-anything-ic-engineer-1
**Beads Task**: task-b397134b514d

### Fix Applied
Removed URL validation from button disabled state. Button now only disabled during loading.

### Verification Result
✅ Button is now enabled on page load
✅ Shows `[cursor=pointer]` indicating clickable
✅ No `[disabled]` attribute present

---

## SUMMARY

**Critical Blockers**: 1
- Generate Audio button does nothing (blocks 11 stories)

**High Priority**: 1
- Dark mode toggle doesn't work (blocks Story 14)

**Fixed**: 1
- Generate Audio button enabled ✅

**Next Steps**:
1. Engineer needs to fix the missing Next.js chunks (404 errors)
2. Likely need to rebuild the app: `rm -rf .next && npm run build && npm run dev`
3. Once that's fixed, can test actual audio generation
4. Dark mode fix can be done in parallel
