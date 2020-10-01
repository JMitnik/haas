const readBearerToken = (authHeader: string) => authHeader.slice(7);

export default readBearerToken;
