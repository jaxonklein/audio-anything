# The Playbook

## Rule 1: Scope Before Building

No work begins until acceptance stories exist. An acceptance story is a falsifiable, step-by-step path that a person walks through to verify the deliverable works.

**Format**:
```
STORY [N]: [Name]
As a [person], I can:
1. [Do or see something specific]
2. [Do or see something specific]
3. [And a specific result happens]
```

Every step must be verifiable — a script, a browser, or a human can walk through it and get a PASS or FAIL. No vague criteria ("looks good", "works well"). If you can't test it, rewrite it.

Stories are **prioritized**: must-have stories are ship-blocking. Should-have and could-have are not. Must-haves are completed first, always.

Stories are **immutable once approved**. Do not redefine "done" to match what was built. If the spec is wrong, raise it before building — don't silently deviate.

The orchestrator's job is to produce these stories before delegating. If the brief is vague, push back until it's concrete.

## Rule 2: No Shortcuts

Build the full implementation. Not a mock. Not a placeholder. Not a TODO. The real thing.

If the task feels too large to build fully, break it into smaller tasks — each one built completely. The answer to "this is hard" is decomposition, not shortcuts.

Mock data, placeholder styling, hardcoded values, TODO comments, and unverified library versions are all shortcuts. Don't use them.

## Rule 3: Track All Work

Every piece of work — engineering, marketing, ops, research — is a task in a project. If it's not tracked, it doesn't exist.

During **Scope**, the orchestrator creates a project and breaks the acceptance stories into tasks. During **Build**, agents update their task status as they work. During **Verify**, the verifier checks task completion against the acceptance stories. On every **heartbeat**, the orchestrator checks task status — not chat messages.

Use `create_project()` for the epic. Use `create_task()` for each deliverable. Use `update_task()` to mark progress. Use `my_tasks()` to see what's assigned to you. When delegating, assign the task to the person doing the work.

## Rule 4: Phase Gates

Work flows through four phases. Each phase must pass before the next begins.

**Scope** → Acceptance stories + must-have/should-have/could-have priorities. Approved by human.

**Design** → For each story: how it will be built. For visual work: what the user will see. For APIs: signatures and response shapes. For operations: component and flow diagrams. Approved by orchestrator before building starts.

**Build** → Implement, then self-verify by walking through every acceptance story. If any story fails, fix it before reporting done. Provide evidence (screenshot, test output, response log).

**Verify** → Someone other than the builder walks through every must-have story. For software: in a real browser. Each step: PASS or FAIL with evidence. If any must-have fails, rejected back to Build. Reading code is not verification. Running `build` without errors is not verification. The only valid verification is executing the acceptance stories.

**Ship** → All must-haves verified. Deployed. Post-deploy smoke test passes. Human notified with evidence.

## Rule 5: Stop and Fix

If something foundational is broken — the page is blank, CSS doesn't render, the API returns errors — stop all other work and fix it. Never build on a broken foundation.

## Rule 6: Deadlines Don't Move

Deadlines are non-negotiable. If there's a blocker, acknowledge it but keep the deadline fixed. Unblock creatively or have a contingency plan. If you reach the 11th hour and the blocker is still there, execute the contingency — but you still ship on time. The only acceptable response to a deadline risk is to solve it, work around it, or reduce scope while still launching. Never "push to tomorrow."

## Rule 7: Done Means Done

"Done" = every must-have acceptance story passes verification. Not "I wrote the code." Not "it compiles." Not "I pushed the commit." The stories pass, or it's not done. No exceptions.
