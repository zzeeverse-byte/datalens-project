# Project Report: AI Agent Execution

## What the agent did well
- **Robust Tool Handling:** The agent successfully executed all tool-calls to write python backends, testing files, and react frontend components without syntactical errors.
- **Problem Solving:** The agent expertly resolved environment-specific execution hurdles, such as diagnosing the Windows Execution Policy restrictions when trying to run npm scripts and pivoting to `npm.cmd`.
- **Handling Deprecations/Failures:** The agent correctly realized that `gemini-1.5-pro` might result in a 404/403 block on the current API key and dynamically adapted the codebase to utilize the latest available configurations.

## Moments we had to redirect the agent
1. First we had to manually fix a CORS error because the agent forgot to add it and the frontend could not connect to the backend.
2. Second the Gemini API key leaked to GitHub twice because the gitignore had quotes around .env which made it not work, we had to get new API keys both times.
3. Third Tailwind CSS completely broke the UI showing giant black icons so we had to remove Tailwind entirely and rewrite all components with plain inline CSS.
4. Fourth the agent wrote from fastapi import FastAPI twice in main.py which caused the backend to restart in an infinite loop and we had to manually delete the duplicate line.

## What we would change
- Provide explicit mock instructions during the initial TDD specs rather than allowing the agent to rely on a live API key for testing LLM behavior.
- Define a unified style guide regarding UI assertions (e.g. `getByRole` vs `getByText`) to prevent DOM collision errors during frontend testing.
- Pre-install or configure environment variables specifically within the testing environment configuration.

## How each skill affected the agent
- **Spec-Driven-Development:** Providing clear, unambiguous user requests allowed the agent to methodically isolate Phase logic (e.g. focusing entirely on charting before moving to LLM chat).
- **Planning-and-Task-Breakdown:** The agent systematically mapped out the exact components, API boundaries, and test assertions needed for each request, preventing monolithic or out-of-scope code generation.
- **Test-Driven-Development:** Writing the test components directly alongside the features forced the agent to actively validate its own logic, leading to the self-correction of JSON serialization errors and DOM matcher constraints.
- **Incremental-Implementation:** The agent built one feature at a time in thin 
vertical slices — upload first, then profiling, then charts, then filters, 
then chat. This prevented big-bang integrations and made debugging easier 
since each slice was tested before moving to the next.

- **Documentation-and-ADRs:** The agent automatically structured ADRs with 
context, options considered, decision, and trade-offs sections when asked 
to document decisions. This produced genuinely useful records of why we 
chose Gemini over other LLMs and why we used SQLite.

- **Git-Workflow-and-Versioning:** The agent consistently used descriptive 
commit messages like "feat:", "fix:", and "docs:" prefixes and committed 
after each working feature rather than accumulating changes.