# ADR-003: Use Tool-Calling for LLM Chat

## Date
2026-04-30

## Status
Accepted

## Context
We needed the LLM to accurately answer user questions regarding the uploaded datasets. Simply sending raw, unstructured CSV text or generic prompts to the LLM often results in hallucinations, context-window limits, and inaccurate mathematical calculations.

## Options Considered
We evaluated two options. Option 1 was direct prompting where we send the entire CSV data as text to the LLM. This fails for large datasets that exceed context windows and produces hallucinated statistics. Option 2 was tool-calling where we expose specific backend functions that the LLM can call to fetch only the data it needs. This grounds answers in real computed values and works for any dataset size. We chose tool-calling.

## Decision
We exposed 3 specific backend tools (`query_data`, `get_statistics`, and `get_column_values`) directly to the LLM using Gemini's native tool-calling feature. This architecture forces the LLM to request and evaluate specific data it needs before formulating an answer.

## Consequences
- **Pro:** Responses are strictly grounded in real, verifiable data. Mathematical and statistical inquiries are perfectly accurate since they are computed securely by the backend rather than hallucinated by the model.
- **Con:** Slightly more complex to implement, requiring rigorous error handling and function schema definitions compared to standard text prompting.
