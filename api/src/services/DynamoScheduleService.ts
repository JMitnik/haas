/* eslint-disable class-methods-use-this */
import * as _ from 'lodash';
import { DynamoDB } from 'aws-sdk';
import AWS from '../config/aws';

import config from '../config/config';

const dynamoClient = new AWS.DynamoDB();

export interface MailSendInput {
  recipient: string;
  body: string;
  subject: string;
  from?: string | null;
}

const MAX_BATCH_SIZE = 25;

export interface SchedulerOptions {
  tableName: string;
}

export interface ScheduleItem {
  attributes: ScheduleAttribute[];
}

export interface ScheduleAttribute {
  key: string;
  value: string | number;
  type: 'string' | 'number';
}

const mapScheduleTypeToDynamoType = {
  string: 'S',
  number: 'N',
};

class DynamoScheduleService {
  /**
   * Schedules a batch of `one-off` items (>25 items) and send write requests to DynamoDB.
   * @param items
   */
  static async batchScheduleOneOffs(items: ScheduleItem[], schedulerOptions: SchedulerOptions) {
    const batchGroups = _.chunk(items, MAX_BATCH_SIZE);

    batchGroups.forEach(async (batch) => {
      const processedBatch = DynamoScheduleService.processBatchForDynamo(batch, schedulerOptions);

      console.log(JSON.stringify(processedBatch));

      dynamoClient.batchWriteItem(processedBatch, (err, data) => {
        if (err) console.log(err, err.stack); // an error occurred
        else console.log(data); // successful response
      });
    });
  }

  /**
   * Converts a batch of `ScheduledItems` to a DynamoDB friendly format.
   */
  static processBatchForDynamo(
    items: ScheduleItem[],
    schedulerOptions: SchedulerOptions,
  ): DynamoDB.BatchWriteItemInput {
    return {
      RequestItems: {
        [schedulerOptions.tableName]: [
          ...items.map((item) => ({
            PutRequest: {
              Item: {
                ...item.attributes.reduce((acc: any, attr) => {
                  acc[attr.key] = {
                    [mapScheduleTypeToDynamoType[attr.type]]: attr.value,
                  };

                  return acc;
                }, {}),
              },
            },
          })),
        ],
      },
    };
  }
}

export const scheduleService = new DynamoScheduleService();

export default DynamoScheduleService;
