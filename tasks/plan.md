# Implementation Plan

Phase 1 - Backend foundation: set up FastAPI project structure, install dependencies, create SQLite database connection
Phase 2 - CSV upload: create upload endpoint, parse CSV with pandas, store data in SQLite, handle semicolon separator for student dataset
Phase 3 - Data profiling: detect column types, compute stats for numeric columns, count unique values for categorical columns, convert yes/no strings to booleans
Phase 4 - Dashboard charts: create API endpoints for each chart, build React frontend with Recharts, show at least 4 charts from real SQLite data
Phase 5 - Global filters: add filter controls to frontend, make all charts update simultaneously when filter is applied
Phase 6 - LLM chat: connect Gemini API with tool-calling, expose query_data and get_statistics tools, make sure it answers the 5 sample questions correctly
Phase 7 - Executive summary: add button that triggers LLM to generate written narrative with real numbers from the data
Phase 8 - Testing: write pytest tests for backend, write Vitest tests for frontend, aim for 80% coverage
Phase 9 - Documentation: write README with setup instructions, write 3 ADRs in docs/adrs folder, write docs/report.md
