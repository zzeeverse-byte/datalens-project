# DataLens

A comprehensive full-stack analytics dashboard for exploring datasets, running natural-language SQL queries, and generating AI executive summaries.

## Prerequisites
- Python 3.11 or higher
- Node.js 18 or higher
- Git
- A Gemini API key from [aistudio.google.com](https://aistudio.google.com/)

## Setup Instructions
1. Clone the repository to your local machine.
2. Create a `.env` file in the root directory and add your API key:
   ```env
   GEMINI_API_KEY=your_api_key_here
   ```
3. Install the backend dependencies:
   ```bash
   cd backend
   pip install -r requirements.txt
   ```
4. Install the frontend dependencies:
   ```bash
   cd frontend
   npm install
   ```

## How to Run
1. **Start the Backend:**
   Navigate into the `backend` folder and run the FastAPI server:
   ```bash
   cd backend
   uvicorn main:app --reload
   ```
2. **Start the Frontend:**
   In a new terminal window, navigate into the `frontend` folder and run the Vite development server:
   ```bash
   cd frontend
   npm run dev
   ```
3. Open your browser and navigate to [http://localhost:5173](http://localhost:5173).

## How to Run Tests
- **Backend Tests:** Run the pytest suite inside the `backend` folder:
  ```bash
  cd backend
  pytest
  ```
- **Frontend Tests:** Run the vitest suite inside the `frontend` folder:
  ```bash
  cd frontend
  npm run test
  ```

## How to Use the App
1. **Upload Data:** Drag and drop the `student-mat.csv` dataset into the upload zone.
2. **Analyze:** View the automatically generated profiling statistics and visually explore the 5 different Recharts metrics.
3. **Filter:** Use the global dropdown filters to dynamically adjust all charts simultaneously.
4. **Chat:** Ask natural language questions in the ChatPanel. The AI will autonomously query your dataset to return statistically accurate answers.
5. **Summarize:** Click the "Generate Executive Summary" button to receive a detailed, AI-generated professional report based on the real dataset profile.

## Team Members
- [Placeholder Name 1]
- [Placeholder Name 2]