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

export const getChartData = async (endpoint: string, tableName: string, filters: any = {}) => {
    const response = await axios.get(`${API_BASE_URL}/charts/${endpoint}`, {
        params: { table_name: tableName, ...filters }
    });
    return response.data;
};

export const getGenericCharts = async (tableName: string, filters: any = {}) => {
    const response = await axios.get(`${API_BASE_URL}/charts/generic`, {
        params: { table_name: tableName, ...filters }
    });
    return response.data;
};

export const getFilterOptions = async (tableName: string) => {
    const response = await axios.get(`${API_BASE_URL}/filters`, {
        params: { table_name: tableName }
    });
    return response.data;
};

export const sendChatMessage = async (message: string, tableName: string) => {
    const response = await axios.post(`${API_BASE_URL}/chat`, {
        message: message,
        table_name: tableName
    });
    return response.data;
};

export const generateSummary = async (tableName: string) => {
    const response = await axios.post(`${API_BASE_URL}/summary`, {
        table_name: tableName
    });
    return response.data;
};


