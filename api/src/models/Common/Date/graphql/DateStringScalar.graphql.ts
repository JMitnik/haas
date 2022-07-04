import { scalarType } from '@nexus/schema';
import { Kind } from 'graphql';
import { DateValidator } from '../../Validators/DateValidator';

/**
 * Scalar which allows us to input and output date-strings following the `dd-MM-yyyy HH:mm` or `dd-MM-yyyy` format.
 */
export const DateStringScalar = scalarType({
  name: 'DateString',
  asNexusMethod: 'dateString',
  description: `
    A date-string follows format "dd-MM-yyyy HH:mm", "dd-MM-yyyy" or ISO format, and is resolved to a relevant Date object.
  `,
  parseValue(value) {
    return DateValidator.resolveFromString(value);
  },
  serialize(value) {
    return DateValidator.resolveToString(value);
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.STRING) {
      return DateValidator.resolveFromString(ast.value);
    }
    return null;
  },
});
