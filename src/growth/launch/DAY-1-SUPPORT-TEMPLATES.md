# Day 1 Support Response Templates
## Audio Anything Private Beta — Sunday, February 16, 2026

**Why this exists:** With 20 beta testers, we'll get feedback in real-time via chat widget. Pre-written templates let us respond fast without overthinking.

**Use guidelines:**
- Personalize with user's name
- Keep tone conversational (not corporate)
- If it's a real bug, acknowledge it and give ETA for fix
- If it's expected behavior, explain gently

---

## 🎯 Most Likely Scenarios

### Scenario 1: "This audio sounds robotic / weird accent"

**Your response:**
```
Hey [Name]! Good feedback. The voice you tried is great for some content but might not work for everything.

Try switching to a different voice in the dropdown (we have 4 options, including 2 female and 2 male voices). Podcast producers usually find one they love after trying 2-3.

If none of them work, that's really valuable to know — just let me know which one sounds best so I can make that the default.
```

**Why this works:**
- Acknowledges the feedback (doesn't dismiss)
- Gives actionable fix (try different voice)
- Frames it as beta ("this is why you're here") not product failure

---

### Scenario 2: "Audio cuts off in the middle"

**Your response:**
```
Oof, that sucks. Quick questions to help me debug:

1. How long was the article? (rough word count or length)
2. Did you see a "generation complete" message before it cut off?
3. What voice did you pick?

Might be a length limit or a timeout issue on our end. Once I know more, I can either fix it or work around it for you.
```

**Why this works:**
- Shows you care (not dismissive)
- Asks specific debug info (helps engineer fast)
- Sets expectation: might be a real bug, might be a limitation, but you're on it

---

### Scenario 3: "How much does this cost?"

**Your response:**
```
Great question! Here's the deal:

**Free:** Generate 3 audio files per hour. Expires after 1 hour but the audio stays in your library. Perfect for trying it out.

**Premium:** $4.99/month (or start with a 7-day free trial first). Get 200 generations per month + unlimited saved links + cross-device sync. Way better if you're using this regularly.

You're currently on free. You can try premium for 7 days totally free — flip the toggle in your account to give it a shot.

Most people do free first, then flip to premium after a few days when they realize they want to save more articles.
```

**Why this works:**
- Clear pricing (no jargon)
- Free → Premium path is obvious
- Explains value (storage, cross-device sync)
- Removes friction (free trial = no risk)

---

### Scenario 4: "Can I generate audio longer than X minutes?"

**Your response:**
```
Great question — this is actually one of the things we're figuring out in beta.

Right now we support articles up to ~25,000 words (premium) which usually generates about 100 minutes of audio. If you hit a limit, it's because the article was super long.

PDFs and web articles get auto-extracted, so sometimes extraction gets confused with weird formatting. If that's what's happening, let me know the URL and I can debug it.

What article were you trying to turn into audio? I can test it on my end.
```

**Why this works:**
- Honest about limitations (not hiding them)
- Explains why (extraction is hard)
- Offers to debug (shows you care)
- Frames as beta learning ("figuring this out")

---

### Scenario 5: "Can I speed up / slow down the audio?"

**Your response:**
```
You know, I haven't built that yet — but [Name], this is solid feedback for our next update.

Right now you get the audio at one speed. If you're listening on Safari/Chrome, you can usually adjust playback speed in the browser's built-in controls (look for the ⚙️ settings in the player).

But native speed control in the app — that's a great feature request. I'm logging this. How often would you need different speeds? (Commute vs gym vs desk work?)
```

**Why this works:**
- Honest about what's missing
- Gives immediate workaround
- Solicits feedback (helps prioritize)
- Makes user feel heard ("I'm logging this")

---

### Scenario 6: "I tried to upgrade to premium but [payment issue]"

**Your response:**
```
Oh no, sorry you hit a snag! Let me fix this.

Quick check: Are you seeing an error message, or did the payment go through but you didn't get upgraded?

Also, what payment method did you try? (Credit card, Apple Pay, etc.)

I can manually fix this on my end while we figure out what went wrong.
```

**Why this works:**
- Takes ownership ("let me fix")
- Asks clarifying questions (critical for payment debugging)
- Offers manual workaround (shows you've got their back)

---

### Scenario 7: "I love this! When can I tell people about it?"

**Your response:**
```
Yesss, I'm so glad you love it! 🎉

Right now it's still private beta (that's why it's invite-only). We're working toward a public launch in the next few weeks, and you'll be one of the first to know.

In the meantime, feel free to tell people about it if you want — the more feedback we get, the better we make it before going public.

What's your favorite thing about it? (Asking because I love knowing what actually resonates.)
```

**Why this works:**
- Matches their energy (excited response)
- Explains timeline (sets expectation)
- Gives them permission to tell people (viral loop!)
- Asks what they love (data for marketing)

---

### Scenario 8: "I'm having authentication issues / can't log in"

**Your response:**
```
Sorry to hear that! Let me help.

Quick questions:
1. Are you seeing a specific error message, or just stuck on the login screen?
2. What account did you use to sign up? (Gmail, Apple, etc.)
3. What browser are you using?

In the meantime, try:
- Clear your browser cache (Cmd+Shift+Delete on Mac, Ctrl+Shift+Delete on Windows)
- Try a different browser
- Try signing out and back in

If that doesn't work, let me know and I can reset your account on my end.
```

**Why this works:**
- Systematic troubleshooting (most auth issues are browser cache)
- Shows you know what you're doing (not just guessing)
- Offers nuclear option (account reset)

---

### Scenario 9: "The example article link is broken / doesn't work"

**Your response:**
```
Ah, that's annoying. Let me check...

Actually, the link works on my end. Quick question: what error message are you seeing? (Or does the page just load blank?)

Also, what browser/device are you on?

If it's broken for you, try pasting a different article URL (like a TechCrunch or Hacker News article) and see if audio generates. That'll tell us if it's the example link or something bigger.
```

**Why this works:**
- Acknowledges the issue (doesn't dismiss)
- Works through debug systematically
- Gives them something to test (helps isolate problem)

---

## 🚨 Critical / Escalate Immediately

### If user reports:
**"The app is completely broken"**
**"I lost my data"**
**"Audio generation is failing for everyone I know"**

**Response:**
```
[Name], I'm escalating this to our engineering team right now. Hang tight — we'll either have a fix or a workaround for you in the next 30 minutes.

In the meantime, can you tell me:
1. Exact error message (screenshot if you can)
2. What were you trying to do when it broke?

This is private beta — we really appreciate you catching this early. Let's fix it.
```

**Then:** Post in #beta-feedback Slack channel with URGENT tag and get engineer on it immediately.

---

## 💡 General Principles

**DO:**
- ✅ Respond within 30 minutes (you're monitoring)
- ✅ Acknowledge their feedback (even if it's not a bug, it matters)
- ✅ Give specific next steps (not vague "we'll look into it")
- ✅ Be honest about limitations (it's beta, users expect rough edges)
- ✅ Ask clarifying questions (help you debug + show you care)
- ✅ Offer workarounds (don't leave them stuck waiting for fixes)
- ✅ Use their name (personal = feels less automated)

**DON'T:**
- ❌ Apologize excessively ("I'm so sorry this happened" → just fix it)
- ❌ Go full corporate ("We appreciate your feedback and will...") → Be human
- ❌ Make promises you can't keep ("This will be fixed by tomorrow") → Give best effort
- ❌ Blame other services ("ElevenLabs is being slow") → Own the experience
- ❌ Ignore critical feedback → Act visibly

---

## 📋 Daily Copy Template (Post in #beta-feedback)

**Use this at 3 PM and 5 PM to update the team on what users are saying:**

```
=== BETA FEEDBACK SYNTHESIS — [TIME] ===

✨ **What's Working:**
- [Most common praise]
- [Feature people love]
- [Unexpected success]

⚠️ **What Needs Fixing:**
- [Bug 1] — Status: [investigating/have fix/workaround available]
- [Bug 2] — Status: [...]

🙋 **Common Questions:**
- [Question 1] — Answer: [...]
- [Question 2] — Answer: [...]

📈 **Engagement:**
- [X] messages in chat widget
- [X] bugs reported
- [X] feature requests
- [X] positive feedback

🎯 **Next Actions:**
- [What engineer should prioritize]
- [What needs better UX]
- [What to emphasize in public launch]
```

---

## 🎁 You're Ready

Use these templates to respond fast and thoughtfully. The goal isn't perfect polish — it's speed + empathy + results.

Feedback on Day 1 will shape the product and positioning for public launch. Every conversation is data.
