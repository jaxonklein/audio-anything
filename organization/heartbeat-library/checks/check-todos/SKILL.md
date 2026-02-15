# Check Todos

Check for pending and in-progress tasks, then work on them.

## When This Runs
During heartbeat (agent is idle). Initial triage uses Haiku; actual work uses Sonnet.

## What To Do

### 1. Triage (Haiku)
- Use `my_tasks` (Beads) to check for tasks assigned to you
- Also use `list_todos` to check local todos
- If BOTH are empty (no pending or in-progress items in either system): report HEARTBEAT_OK and stop
- Beads tasks take priority over local todos — if you have Beads tasks, work on those first

### 2. Pick a Task
- If any item is `pending`: pick the highest-priority one, mark it `in_progress`
- If an item is already `in_progress`: continue working on it
- Prefer urgent > high > normal > low

### 3. Do the Work (Sonnet)
- Read the task description and any linked context
- Use your tools (Read, Write, Edit, Bash, Grep, Glob) to actually complete the task
- Work within your areas of responsibility and skill set
- If the task is outside your domain, reassign it to the appropriate person via @mention

### 4. Request Review
- When you believe the task is complete, post a summary of what you did
- @mention your manager or a relevant teammate to review
- Set task status to `in_review` (or keep `in_progress` with a review-requested note)

### 5. Handle Review Outcomes
- If reviewed and approved (someone confirms it's good): mark as `completed`
- If reviewed with feedback: incorporate feedback, then re-request review
- If you're the reviewer and the work looks good: approve and let the author mark done

### 6. Blocked Tasks
- If you can't make progress (missing info, waiting on someone, outside your access):
  - Add a note explaining the blocker
  - @mention whoever can unblock you
  - Move on to the next task

## Output Format
- Working: "HEARTBEAT_WORKING: Working on [task title] — [brief status]"
- Review requested: "HEARTBEAT_REVIEW: Completed [task title], requesting review from @[reviewer]"
- Blocked: "HEARTBEAT_BLOCKED: [task title] blocked on [reason]"
- Nothing to do: "HEARTBEAT_OK: No pending todos"
