import axios from 'axios';

const apiClient = axios.create({
    baseURL: process.env.REACT_APP_BASE_API_URL
});

export const addAccessTokenInterceptor = (
    jwtToken: string
) => {
    apiClient.interceptors.request.use(async (config) => {
        if (config && config.headers) {
            config.headers.Authorization = `Bearer ${jwtToken}`;
        }
        return config;
    });
};

export default apiClient;