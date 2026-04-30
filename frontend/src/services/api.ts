import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

export const uploadCSV = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await axios.post(`${API_BASE_URL}/upload`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });

    return response.data;
};

export const getProfile = async (tableName: string) => {
    const response = await axios.get(`${API_BASE_URL}/profile`, {
        params: { table_name: tableName }
    });
    return response.data;
};

export const getChartData = async (endpoint: string, tableName: string) => {
    const response = await axios.get(`${API_BASE_URL}/charts/${endpoint}`, {
        params: { table_name: tableName }
    });
    return response.data;
};
