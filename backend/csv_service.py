import pandas as pd
from backend.database import get_db_connection

def parse_csv(file_path: str) -> pd.DataFrame:
    # Use sep=None and engine='python' to auto-detect separator
    df = pd.read_csv(file_path, sep=None, engine='python')
    return df

def store_csv_in_sqlite(df: pd.DataFrame, table_name: str):
    conn = get_db_connection()
    # Write to SQLite, replace if exists
    df.to_sql(table_name, conn, if_exists='replace', index=False)
    conn.close()
