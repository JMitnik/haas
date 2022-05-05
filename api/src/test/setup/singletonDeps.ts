/**
 * Singleton dependencies that we want to share only "ONCE".
 * 
 * Note: this is apparently an anti-pattern. But due to Prisma's reluctance to grow, we are
 * necessitated to do this.
 */

import { makeTestContext, graphqlTestContext } from '../utils/makeTestContext';
import { makeTestPrisma } from '../utils/makeTestPrisma';

console.log('I am being run once, RIGHTTTTTTT??!?!?!?!?!?!?!? 🤔');

export const rand = 'test' + Math.random();

export const prisma = makeTestPrisma();

export const graphqlContext = graphqlTestContext(prisma);