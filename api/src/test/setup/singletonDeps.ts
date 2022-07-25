/**
 * Singleton dependencies that we want to share only "ONCE".
 *
 * Note: this is apparently an anti-pattern. But due to Prisma's reluctance to grow, we are
 * necessitated to do this.
 */

import { graphqlTestContext } from '../utils/makeTestContext';
import { makeTestPrisma } from '../utils/makeTestPrisma';

export const rand = 'test' + Math.random();

export const prisma = makeTestPrisma();

export const graphqlContext = graphqlTestContext(prisma);
