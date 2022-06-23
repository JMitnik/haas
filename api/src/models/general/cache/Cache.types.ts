import { PrismaClient } from '@prisma/client';

/** Utility for TableName */
type IgnorePrismaBuiltins<S extends string> = string extends S
? string
: S extends ''
? S
: S extends `$${infer T}`
? never
: S;

/** All table names of prisma as union */
export type PrismaTableName = IgnorePrismaBuiltins<keyof PrismaClient>;

export interface GetOrCreateOptions {
  enabled?: boolean;
  /** Time to live in seconds */
  ttl?: number;
}
