# Project Report: AI Agent Execution

## What the agent did well
- **Robust Tool Handling:** The agent successfully executed all tool-calls to write python backends, testing files, and react frontend components without syntactical errors.
- **Problem Solving:** The agent expertly resolved environment-specific execution hurdles, such as diagnosing the Windows Execution Policy restrictions when trying to run npm scripts and pivoting to `npm.cmd`.
- **Handling Deprecations/Failures:** The agent correctly realized that `gemini-1.5-pro` might result in a 404/403 block on the current API key and dynamically adapted the codebase to utilize the latest available configurations.

## Moments we had to redirect the agent
1. **Model Selection/API Error Masking:** The agent initially wrote tests that falsely passed because the response text contained numeric error codes (`400`, `404`) instead of actual data. The agent had to be instructed to mock the API calls via `unittest.mock` to ensure tests passed predictably regardless of the API key status.
2. **Type Safety with JSON:** The agent initially attempted to pass `int64` numpy types directly into `json.dumps`, which caused a serialization exception. The agent subsequently diagnosed this execution failure and rectified the logic by adding the `default=str` parameter.
3. **Frontend Testing Matchers:** The agent initially used `getByText` when writing the vitest UI tests, which crashed because the word "upload" appeared multiple times in the DOM. The agent had to parse the log failure and rewrite the code to use `getAllByText`.

## What we would change
- Provide explicit mock instructions during the initial TDD specs rather than allowing the agent to rely on a live API key for testing LLM behavior.
- Define a unified style guide regarding UI assertions (e.g. `getByRole` vs `getByText`) to prevent DOM collision errors during frontend testing.
- Pre-install or configure environment variables specifically within the testing environment configuration.

## How each skill affected the agent
- **Spec-Driven-Development:** Providing clear, unambiguous user requests allowed the agent to methodically isolate Phase logic (e.g. focusing entirely on charting before moving to LLM chat).
- **Planning-and-Task-Breakdown:** The agent systematically mapped out the exact components, API boundaries, and test assertions needed for each request, preventing monolithic or out-of-scope code generation.
- **Test-Driven-Development:** Writing the test components directly alongside the features forced the agent to actively validate its own logic, leading to the self-correction of JSON serialization errors and DOM matcher constraints.
