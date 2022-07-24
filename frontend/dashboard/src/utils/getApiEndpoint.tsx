const apiEndpoint = process.env.VITE_API_ENDPOINT?.toString();

export const getApiEndpoint = () => apiEndpoint || 'http://localhost:4000/graphql';
