import { UserInputError } from 'apollo-server-express';

const formatDate = (dateString: string): Date => {
  try {
    const date = new Date(dateString);
    return date;
  } catch (e) {
    throw new UserInputError('Invalid date');
  }
};

export default formatDate;
