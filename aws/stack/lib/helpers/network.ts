import fetch from "node-fetch";

/**
 * Authenticate Lambda with our GraphQL API
 */
 export const authenticateLambda = async (
  url: string,
  authenticateEmail: string,
  workspaceEmail: string,
  authToken: string
 ) => {
  const req = await fetch(url, {
    body: JSON.stringify({
      query: `
      mutation authenticateLambda($input: AuthenticateLambdaInput) {
        authenticateLambda(input: $input)
      }`,
      operationName: "authenticateLambda",
      variables: {
        input: { "authenticateEmail": authenticateEmail, "workspaceEmail": workspaceEmail }
      }
    }),
    headers: {
      lambda: authToken,
    }
  });
  const data = await req.json();

  return data;
}
