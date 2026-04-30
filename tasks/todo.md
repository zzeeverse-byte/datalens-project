# Todo List

## Phase 1 - Backend foundation
Task: Initialize Backend Project and SQLite DB
Files: backend/requirements.txt, backend/main.py, backend/database.py, backend/models.py, backend/config.py
Done looks like: FastAPI app runs locally on port 8000; a SQLite data.db file is created upon startup; dependencies are defined in requirements.txt.

## Phase 2 - CSV upload
Task: Implement CSV Upload API
Files: backend/main.py, backend/csv_service.py, backend/database.py, frontend/package.json, frontend/src/components/Upload.tsx
Done looks like: User can drag/drop a CSV file on the frontend; backend receives it, parses it with Pandas (handling `;` separators for student dataset), and loads the rows into a new SQLite table.

## Phase 3 - Data profiling
Task: Add Data Profiling Service
Files: backend/main.py, backend/data_service.py, backend/models.py, frontend/src/services/api.ts, frontend/src/components/DataProfile.tsx
Done looks like: Uploading a CSV automatically triggers data profiling; frontend displays column stats (numeric means/mins/maxs, categorical counts); yes/no strings are correctly transformed to booleans.

## Phase 4 - Dashboard charts
Task: Implement Dashboard Visualizations
Files: backend/main.py, backend/data_service.py, frontend/src/pages/Dashboard.tsx, frontend/src/components/ChartCard.tsx, frontend/src/App.tsx
Done looks like: Frontend fetches data from SQLite; at least 4 Recharts display using real data (e.g., average grade by school, study time vs grade, etc.).

## Phase 5 - Global filters
Task: Build Global Filtering System
Files: frontend/src/pages/Dashboard.tsx, frontend/src/components/Filters.tsx, frontend/src/services/api.ts, backend/main.py, backend/data_service.py
Done looks like: Dropdowns and sliders are present in the UI; changing them updates all dashboard charts concurrently via filtered backend API queries.

## Phase 6 - LLM chat
Task: Integrate Gemini Chat with Tools
Files: backend/main.py, backend/chat_service.py, backend/data_service.py, frontend/src/components/Chat.tsx, frontend/src/App.tsx
Done looks like: User can type questions; Gemini API handles requests using query_data and get_statistics tools; answers reference real numeric results for the 5 sample questions correctly.

## Phase 7 - Executive summary
Task: Add Executive Summary Generation
Files: backend/main.py, backend/chat_service.py, frontend/src/pages/Dashboard.tsx, frontend/src/components/Summary.tsx, frontend/src/services/api.ts
Done looks like: A "Generate Summary" button exists on the dashboard; clicking it displays an LLM-authored narrative report describing key insights and exact figures from the CSV.

## Phase 8 - Testing
Task: Backend Pytest Implementation
Files: backend/tests/conftest.py, backend/tests/test_main.py, backend/tests/test_csv_service.py, backend/tests/test_data_service.py, backend/tests/test_chat_service.py
Done looks like: Running pytest successfully executes unit and integration tests covering at least 80% of backend logic.

Task: Frontend Vitest Implementation
Files: frontend/package.json, frontend/vite.config.ts, frontend/src/tests/Upload.test.tsx, frontend/src/tests/ChartCard.test.tsx, frontend/src/tests/Chat.test.tsx
Done looks like: Running npm run test executes component and utility tests using Vitest; everything passes.

## Phase 9 - Documentation
Task: Final Documentation and ADRs
Files: README.md, docs/adrs/001-database.md, docs/adrs/002-frontend.md, docs/adrs/003-llm-tools.md, docs/report.md
Done looks like: The project has clear local setup instructions in the README; architecture decisions are documented; the final project report is complete.
