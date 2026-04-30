# Spec: DataLens

## Objective
We are building a full-stack web application called DataLens to analyze and visualize student performance data based on the `student-mat.csv` dataset. The application will answer five specific analytical questions:
1. What is the average final grade by school?
2. How does study time correlate with final grade (G3)?
3. Do students with internet access perform better?
4. What is the relationship between absences and grades?
5. How do parent education levels affect student performance?

## Tech Stack
- **Frontend**: React (via Vite), TypeScript, TailwindCSS for styling, Recharts (or Chart.js) for data visualization.
- **Backend**: FastAPI (Python), Pandas for data processing.
- **Data Source**: `student-mat.csv` (Note: Uses semicolons `;` as separators).

## Commands
- **Frontend**:
  - Install dependencies: `npm install`
  - Dev: `npm run dev`
  - Build: `npm run build`
  - Lint: `npm run lint`
- **Backend**:
  - Install dependencies: `pip install -r requirements.txt`
  - Dev: `uvicorn main:app --reload`
  - Test: `pytest`

## Project Structure
```text
datalens-project/
├── frontend/             → React Vite application
│   ├── src/
│   │   ├── components/   → Reusable UI & Chart components
│   │   ├── pages/        → Page layouts
│   │   ├── services/     → API clients
│   │   └── App.tsx       → Main application component
│   └── package.json
├── backend/              → FastAPI application
│   ├── main.py           → API entry point
│   ├── data_service.py   → Pandas logic for CSV analysis
│   ├── models.py         → Pydantic models
│   └── tests/            → Backend tests
└── student-mat.csv       → Semicolon-separated data file
```

## Code Style
### Frontend (React/TS)
```tsx
import React from 'react';

interface Props {
  title: string;
  data: number[];
}

export const ChartCard: React.FC<Props> = ({ title, data }) => {
  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h2 className="text-xl font-bold">{title}</h2>
      {/* Chart implementation */}
    </div>
  );
};
```

### Backend (Python)
```python
from fastapi import FastAPI
import pandas as pd

app = FastAPI()

def load_data() -> pd.DataFrame:
    # Important: CSV uses semicolons as separators
    return pd.read_csv('../student-mat.csv', sep=';')
```

## Testing Strategy
- **Backend**: `pytest` for testing the Pandas data aggregation logic and FastAPI endpoints.
- **Frontend**: React Testing Library for component rendering tests.
- **Coverage**: Aim for 80% coverage on backend data processing logic.

## Boundaries
- **Always do**: Handle missing or malformed data in the CSV gracefully, ensure proper TypeScript typing for API responses.
- **Ask first**: Before adding complex third-party dependencies (e.g., heavy state management libraries) or changing the application architecture.
- **Never do**: Hardcode the CSV path in a way that breaks if the app is run from a different directory; commit large datasets to source control if not required.

## Success Criteria
- [ ] Backend provides 5 distinct API endpoints (or one comprehensive endpoint) accurately returning the aggregated data for each of the 5 questions.
- [ ] Frontend successfully fetches and displays this data using clear, distinct visualizations (e.g., bar charts, scatter plots).
- [ ] The application correctly parses `student-mat.csv` using the `;` separator.
- [ ] The application runs locally without errors using the specified dev commands.

## Open Questions
ASSUMPTIONS I'M MAKING:
1. We will use Vite with React + TypeScript for the frontend.
2. We will use TailwindCSS for styling and Recharts for charts.
3. The backend will use Pandas for data manipulation.
4. The `student-mat.csv` is static and won't be updated by users.
→ Are these assumptions correct? Should we use different libraries for charts or styling?
