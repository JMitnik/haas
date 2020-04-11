/* eslint-disable import/prefer-default-export */
import * as Knex from 'knex';

export async function up(knex: Knex): Promise<any> {
  knex.schema.withSchema('public').createTable('Customer', (table) => {
    table.increments();
    table.string('name');
  });

  knex.schema.withSchema('public').createTable('Dialogue', (table) => {
    table.increments();
    table.string('title');
  });

  knex.schema.withSchema('public').createTable('_CustomerToDialogue', (table) => {
    table.index('A');
    table.index('B');
  });
}
