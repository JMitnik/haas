import { CustomerSettingsPrismaAdapterType } from "./CustomerSettingsPrismaAdapterType";
import { PrismaClient, CustomerSettingsUpdateInput, CustomerSettings } from "@prisma/client";

class CustomerSettingsPrismaAdapter implements CustomerSettingsPrismaAdapterType {
  prisma: PrismaClient;

  constructor(prismaClient: PrismaClient) {
    this.prisma = prismaClient;
  }

  async deleteByCustomerId(customerId: string): Promise<CustomerSettings> {
    return this.prisma.customerSettings.delete({
      where: {
        customerId,
      },
    });
  }

  async updateCustomerSettingsbyCustomerId(customerId: string, data: CustomerSettingsUpdateInput) {
    return this.prisma.customerSettings.update({
      where: {
        customerId: customerId,
      },
      data
    });
  }
}

export default CustomerSettingsPrismaAdapter;
