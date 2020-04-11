import { TableBuilder } from 'knex';

/**
 * type Customer {
    id: ID! @id
    name: String!
    questionnaires: [Questionnaire] @relation(name: "CustomerToQuestionnaire", onDelete: CASCADE)
    settings: CustomerSettings @relation(name: "CustomerCustomerSettings", onDelete: CASCADE)
}

type CustomerSettings {
    id: ID! @id
    logoUrl: String
    colourSettings: ColourSettings @relation(name: "CustomerSettingsColourSettings", onDelete: CASCADE)
    fontSettings: FontSettings
}

 */

class CustomerModel {
  static schema: TableBuilder = {

  };
}
