export const getApiEndpoint = () => import.meta.env.VITE_API_ENDPOINT?.toString() || 'http://localhost:4000/graphql';
