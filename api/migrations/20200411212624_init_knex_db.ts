/* eslint-disable import/prefer-default-export */
import * as Knex from 'knex';

export async function up(knex: Knex): Promise<any> {
  await knex.schema.createTable('Customer', (table) => {
    table.increments('id').primary();
    table.string('name');
  });

  await knex.schema.createTable('Dialogue', (table) => {
    table.increments('id').primary();
    table.string('title');
  });

  // TODO: Make this its own helper function for two models (Customer and Dialogue)
  await knex.schema.createTable('_customersTodialogues', (table) => {
    table.integer('A');
    table.integer('B').index();

    table.unique(['A', 'B']);

    table.foreign('A')
      .references('Customer.id');
    table.foreign('B')
      .references('Dialogue.id');
  });
}

export async function down(knex: Knex): Promise<any> {
  await knex.schema.dropTable('_customersTodialogues');
  await knex.schema.dropTable('Customer');
  await knex.schema.dropTable('Post');
}
