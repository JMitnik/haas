import { GraphQLYogaError } from '@graphql-yoga/node';

const formatDate = (dateString: string): Date => {
  try {
    const date = new Date(dateString);
    return date;
  } catch (e) {
    throw new GraphQLYogaError('Invalid date');
  }
};

export default formatDate;
