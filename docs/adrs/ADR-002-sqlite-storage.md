# ADR-002: Use SQLite for Storing Uploaded CSV Data

## Date
2026-04-30

## Status
Accepted

## Context
We needed to securely and persistently store uploaded CSV dataset files in a structured format so that our data service layer could query, aggregate, and perform analytics on them seamlessly without continually re-parsing the raw file.

## Decision
We chose SQLite because it requires absolutely no server setup or background daemon processes. It runs entirely locally within a single file, and the `pandas` library integrates with it natively via the `to_sql` and `read_sql` methods.

## Consequences
- **Pro:** Extremely simple to set up with zero configuration needed. Fits perfectly into the Python standard library workflow.
- **Con:** Not suitable or designed for high-concurrency environments or multiple simultaneous users updating the dataset concurrently.
