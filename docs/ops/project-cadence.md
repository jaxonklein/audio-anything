# Project Cadence

Every project follows this cadence. Each phase has a definition of done. No phase starts until the previous phase's DoD is met.

## Phase 1: Founder Brief

The founder gives the CEO a project directive. The CEO's job is to deeply understand what the founder wants before involving anyone else.

**What happens**:
- Founder posts brief to CEO
- CEO asks clarifying questions — scope, priorities, constraints, business model, timeline
- CEO drafts acceptance stories per the playbook
- Back-and-forth until both sides are aligned

**Definition of Done**: Founder explicitly approves the acceptance stories. No ambiguity remains on what "done" looks like.

## Phase 2: Team Kickoff

The CEO presents the approved scope to the full team. This is a structured meeting, not a chat thread.

**What happens**:
- CEO posts the approved acceptance stories, design direction, technical requirements, task assignments, and deadline to the team channel
- Every team member reads and acknowledges
- Team members ask questions — about their specific assignments, dependencies, unknowns
- CEO answers or escalates back to founder if needed

**Definition of Done**: Every team member understands the full scope and their specific role. All important questions are answered. If any important questions remain unanswered, work does NOT start — the founder goes back and gets the answers.

## Phase 3: Build

The team builds. Standups keep everyone aligned.

**What happens**:
- Each agent works on their assigned tasks
- **Standup every 30 minutes**: each agent briefly reports:
  - What I did since last standup
  - What I'm doing next
  - Any blockers
- CEO monitors progress, unblocks, makes decisions
- Keep standups short — status, not discussion. If something needs discussion, take it offline to the relevant channel.

**Definition of Done**: All must-have acceptance stories are implemented and the builder has self-verified each one (per playbook Rule 4: Build phase).

## Phase 4: QA Review

QA walks through every must-have story in a real browser.

**What happens**:
- QA opens the app and executes each acceptance story step by step
- Each step: PASS or FAIL with evidence
- Posts a verification report
- If any must-have fails: rejected back to Build with specific failures

**Definition of Done**: All must-have stories pass QA verification with evidence.

## Phase 5: Full Team Review

The whole team walks through the product together and provides feedback.

**What happens**:
- CEO leads a walkthrough of the product
- Every team member reviews from their perspective:
  - Engineer: code quality, performance, edge cases
  - QA: verification completeness
  - Growth: messaging, positioning, user experience
  - CoS: ops readiness, deployment, monitoring
- Feedback is collected and prioritized

**Definition of Done**: All feedback is captured. CEO decides what gets fixed (must-fix vs nice-to-have).

## Phase 6: Iteration

Fix issues from the team review. Then repeat Phase 5.

**What happens**:
- Builder fixes must-fix issues
- QA re-verifies fixed items
- Full team review again
- Repeat until no must-fix issues remain

**Definition of Done**: Full team review passes with no must-fix issues.

## Phase 7: CEO Sign-Off

CEO does a final review and signs off.

**What happens**:
- CEO walks through every must-have story personally
- Checks design, UX, polish, completeness
- Signs off or sends back for fixes

**Definition of Done**: CEO explicitly approves the product for handoff.

## Phase 8: Founder Handoff

CEO presents the finished product to the founder.

**What happens**:
- CEO posts in #leadership with evidence: screenshots, demo URL, verification report
- Founder reviews the product
- Founder either accepts or requests changes
- If changes requested → loops back to Phase 3 (Build) with new/revised stories

**Definition of Done**: Founder explicitly accepts the deliverable. Ship it.

---

## Standup Format

```
STANDUP — [Agent Name]
- Done: [what I completed]
- Next: [what I'm working on now]
- Blockers: [anything blocking me, or "none"]
```

Keep it to 3 lines. No essays. If there's nothing new, say "no update."

## Meeting Rules

- Meetings are structured posts, not freeform chat
- The CEO runs every meeting
- One person talks at a time (post, then wait for responses)
- If a meeting is going off track, CEO redirects
- Meetings have a purpose — when the purpose is met, the meeting is over
