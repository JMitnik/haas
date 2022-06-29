import { PrismaClient } from '@prisma/client';
import { sub } from 'date-fns';

import { toUTC } from '../../../utils/dateUtils';
import { GetOrCreateOptions, PrismaTableName } from './Cache.types';

export class PrismaCacheService {
  constructor(private readonly prisma: PrismaClient) { }

  /**
   * Gets a list of records from the cache.
   */
  async getBatch<T>(tableName: PrismaTableName, keys: string[]): Promise<T[]> {
    // @ts-ignore
    const records = await this.prisma[tableName].findMany({
      where: {
        id: {
          in: keys,
        },
      },
    });

    return records;
  }

  /**
   * Gets a record, or creates a new record if it doesn't exist.
   *
   * Preconditions:
   * - The record must have a non-incremental unique ID key. The key
   * - The record must have an `updatedAt` field.
   * - The `createFn()` callback must return a record that can be directly serialized to the Prisma data model.
   *
   * @param tableName The name of the Prisma Data model
   * @param key The constructed key. This should be unique, and preferably derivable based on known fields.
   * @param createFn A callback that creates the record (and returns it) if it doesn't exist.
   * @param options Options that control the behavior of the cache.
   * @returns The record
   */
  public async getOrCreate<T>(
    tableName: PrismaTableName,
    key: string,
    createFn: () => Promise<T>,
    options: GetOrCreateOptions = { enabled: true, ttl: 60 },
  ): Promise<T> {
    // If the options are disabled, just return the result of the createFn
    if (!options.enabled || !options.ttl) {
      return await createFn();
    }

    const ttlThreshold = sub(toUTC(new Date(Date.now())), { seconds: options.ttl });

    // @ts-ignore
    const record = await this.prisma[tableName].findUnique({
      where: {
        id: key,
      },
    });

    // If record exists and is newer than the time-to-live threshold, return record
    if (record !== undefined && record?.updatedAt > ttlThreshold) {
      return record;
    }

    // Else, create record payload, and store record
    const newRecordData = await createFn();

    await this.createOrUpdate(tableName, key, newRecordData);

    return newRecordData;
  }

  /**
   * Creates or updates a record in the cache.
   * @param tableName The name of the Prisma Data Model.
   * @param key The constructed key.
   * @param data The record data to store.
   */
  async createOrUpdate(tableName: PrismaTableName, key: string, data: any): Promise<void> {
    try {
      // @ts-ignore
      await this.prisma[tableName].upsert({
        where: {
          id: key,
        },
        update: data,
        create: data,
      });
    }
    catch (error) {
      // TODO: Due to some race conditions, sometimes we might have an error: this prevents it from blocking the flow.
      // TODO: We should move over to redis to prevent this.
      console.error(error);
      console.log(data);
    }
  }
}
