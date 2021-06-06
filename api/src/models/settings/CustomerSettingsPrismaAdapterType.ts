import { CustomerSettingsUpdateInput, CustomerSettings, ColourSettings } from "@prisma/client";

export interface CustomerSettingsPrismaAdapterType {
  deleteByCustomerId(customerId: string): Promise<CustomerSettings>;
  updateCustomerSettingsbyCustomerId(customerId: string, data: CustomerSettingsUpdateInput): Promise<CustomerSettings>;
  getCustomerSettingsByCustomerId(customerId: string): Promise<CustomerSettings | null>;
}