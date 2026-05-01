# Spec: DataLens

## Objective
The app is called DataLens. It is a full-stack web application that lets users upload ANY CSV file and get automated data profiling, interactive visualizations, an AI chat interface, and an executive summary. It is developed against student-mat.csv but must work with any CSV.

The 5 chat questions for the student dataset are:
- What is the average final grade by school?
- How does study time correlate with final grade G3?
- Do students with internet access perform better?
- What is the relationship between absences and grades?
- How do parent education levels affect student performance?

## Tech Stack
- **Frontend**: React plus Vite, TypeScript, TailwindCSS, Recharts, Vitest (running on port 5173).
- **Backend**: FastAPI, Python 3.11, Pandas, SQLite, pytest (running on port 8000).
- **AI/LLM**: Gemini API with tool-calling for the LLM chat feature.

## Commands
- **Frontend**: 
  - `npm install`
  - `npm run dev`
  - `npm run test`
  - `npm run build`
- **Backend**: 
  - `pip install -r requirements.txt`
  - `uvicorn main:app --reload --port 8000`
  - `pytest`

## Project Structure
- `frontend/`:
  - `src/`: containing `components`, `pages`, `services`, `App.tsx`.
- `backend/`: 
  - `main.py`, `csv_service.py`, `data_service.py`, `chat_service.py`, `models.py`, `database.py`
  - `tests/` folder
- `docs/adrs/`: folder for Architecture Decision Records.
- `.agent/skills/`: folder with the 6 skills.

## Key Features
1. **CSV upload**: drag and drop, stores data in SQLite, validates size up to 50MB.
2. **Data profiling**: detects column types, computes stats, handles yes/no string columns.
3. **Dashboard**: at least 4 charts using real SQLite data, auto-selects chart types.
4. **Global filters**: dropdowns and sliders that update ALL charts simultaneously.
5. **LLM chat**: Gemini with tool-calling, tools are `query_data`, `get_statistics`, `get_column_values`, answers use real numbers not hallucinated ones.
6. **Executive summary**: LLM generates written narrative with actual numbers from the data.

## Success Criteria
- CSV upload works for any valid CSV and rejects invalid files with clear error.
- Profiling displays within 2 seconds.
- Dashboard renders within 2 seconds.
- Filters update all charts at once.
- LLM chat correctly answers all 5 sample questions.
- Executive summary references actual numbers.
- Data persists after page refresh.
- App works with a completely different CSV without code changes.

## Testing Strategy
- **Backend**: `pytest`
- **Frontend**: `Vitest`
- **Coverage**: 80% coverage target.
- Write tests before code.

## Environment Variables
- `GEMINI_API_KEY`
- `LLM_PROVIDER=gemini`

## Boundaries
- **Always do**: handle missing CSV data gracefully, use TypeScript types, write tests before code, commit after each working feature.
- **Ask first**: before adding new libraries or changing database schema.
- **Never do**: hardcode file paths, commit the .env file, use hardcoded data in charts, assume CSV always uses commas.

