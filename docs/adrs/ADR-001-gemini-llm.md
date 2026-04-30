# ADR-001: Use Gemini API as the LLM

## Date
2026-04-30

## Status
Accepted

## Context
We needed a Large Language Model (LLM) with robust tool-calling support to power the intelligent chat interface and the automated executive summary generator for our dataset analysis platform.

## Decision
We chose the Gemini API because it is freely accessible with a standard Google account via AI Studio, provides extremely fast inference, and natively supports automatic tool-calling functionality.

## Consequences
- **Pro:** Free to use, high performance, and natively supports complex function execution.
- **Con:** Requires manual API key setup and configuration via `.env` file by the end user.
