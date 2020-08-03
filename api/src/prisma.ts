/* eslint-disable @typescript-eslint/no-unused-expressions */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

prisma.use(async (params, next) => next(params));

export default prisma;
