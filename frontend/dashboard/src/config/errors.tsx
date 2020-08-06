const errors: {[key: string] : string } = {
  'GraphQL error: dialogue:existing_slug': 'Dialogue slug already exists',
  'GraphQL error: customer:existing_slug': 'Slug is already taken: try a different one.',
  'GraphQL error: login:email_missing': 'Email is missing. Did you provide it in the login?',
  'GraphQL error: login:password_missing': 'Password is missing. Did you provide it in the login?',
};

export default errors;
