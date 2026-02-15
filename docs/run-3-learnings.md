# Run 3 Learnings

Battle test: Audio Anything — URL-to-audio web app
Started: 2026-02-14
Duration: ~20 minutes (brief posted to sequencer killed)

## What Went Right

### 1. Playbook-driven scoping worked
CEO drafted 8 acceptance stories with must/should/could prioritization, falsifiable steps, design requirements, and technical requirements. Asked for founder approval before building. The phase gate (Scope → wait for approval → then Build) was respected.

### 2. Judge prevented pile-on
After CEO posted stories, Growth and CoS were evaluated and both correctly declined ("not my lane", "CEO is drafting acceptance stories, not requesting CoS support"). Self-message filter worked perfectly.

### 3. CEO caught the correction quickly
When the brief changed from text-to-audio to URL-to-audio, CEO immediately pivoted and redrafted. No wasted work.

### 4. Growth stayed in lane when told to
Growth jumped ahead once (started planning launch marketing), CEO said "stand by", Growth acknowledged and waited. Good chain-of-command behavior.

## What Went Wrong

### 5. CEO scoped product only, ignored business context
CEO received the brief and immediately drafted acceptance stories focused purely on the product (UI, features, error handling). Did not ask about or consider:
- Go-to-market strategy (who are the users? how do we reach them?)
- Growth planning (what does Head of Growth need to prepare for launch?)
- Ops (deployment, monitoring, support)
- Legal (terms of service, privacy policy, API key handling)
- Finance (cost of ElevenLabs API calls, pricing model)

**Why**: The agents lack organizational context — they don't know *why* they exist or what Caladan is. There's no accelerator context, no company mission, no business model framing. So the CEO treats every brief as a pure engineering task.

**Possible fix**: Add a "company context" section to the CEO config. CEO methodology could require a pre-delegation checklist: product, growth, ops, legal, finance.

### 6. CEO did not question ambiguous deadline
Brief said "ship today" with no specific time. CEO accepted it without asking "what time today?" or "what timezone?" — just echoed "deadline: today."

### 7. Stale Beads data caused heartbeat chaos
The 15-minute heartbeat fired (correctly — heartbeats are critical for autonomy). But agents found stale task data from old project iterations and panicked:
- CoS posted "CRITICAL COORDINATION FAILURE — IMMEDIATE ACTION REQUIRED" to #ops
- Eng1 and Eng2 raised alarms about an empty codebase
- CEO spent multiple turns putting out fires ("you're looking at old task data, ignore it")
- Growth started analyzing marketing strategy nobody asked for

**Root cause**: NOT the heartbeat. The heartbeat is working as intended. The problem was stale Beads project/task data from previous iterations. If the data had been clean, agents would have found nothing and stood by quietly.

**Fix**: `--clean-sessions` should also wipe Beads project/task data, or add a `--clean-beads` flag.

### 8. Human message got lost behind bot chatter
Human (jaxonklein) posted feedback on acceptance stories in #leadership. CEO accepted (judge said yes, confidence=1.00), but the CEO was already busy processing heartbeat-triggered work across #team, #ops, #growth, #engineering. CEO kept getting "Skipping (busy)". Human's message was never responded to.

**Root cause**: No priority queue. Heartbeat-triggered work treated the same as human-directed work. When heartbeats fire and trigger cascading conversations, CEO gets locked into processing those first.

**Possible fixes**:
- Priority queue: human messages jump ahead of bot work
- Interrupt mechanism: human message cancels current heartbeat processing
- Heartbeat dampening: don't fire heartbeats while there's unprocessed human input
- Queue visibility: log when a human message is waiting behind bot work

### 9. Channel seeding doesn't cover tagged channels
CEO couldn't see the original brief because seeding only pulls from the agent's primary channel (#team), not tagged channels (#leadership). Required re-posting.

**Fix**: Seed from all channels the agent monitors, not just primary.

### 10. Stale context from previous project caused false alarms
Agents found old completed tasks from previous iterations and treated them as current. This triggered the CoS "coordination failure" alert and confused Eng1/Eng2.

**Fix**: `--clean-sessions` should wipe Beads project/task data too, or add a `--clean-beads` flag.

### 11. Duplicate posts
CoS posted the same heartbeat message twice in #team. CEO posted duplicate "delegated task" messages in #team.

### 12. Missing registries directory
First CEO pickup failed with `No such file or directory: 'organization/registries/org.json'`. Had to copy from aa-2.

**Fix**: Add to project setup checklist.

## Priority Fixes for Run 4

1. **Clean stale Beads data** on fresh starts — This was the root cause of the chaos. Everything else downstream was a symptom.
2. **Human priority queue** — Human messages should jump ahead of bot-triggered work
3. **Seed all monitored channels** — Not just primary
4. **Company context** — CEO needs to know they're running a business, not just shipping code
5. **Project cadence** — Structured phases (founder brief → team kickoff → build with standups → QA → team review → iteration → CEO sign-off → founder handoff) so agents know where they are in the process
