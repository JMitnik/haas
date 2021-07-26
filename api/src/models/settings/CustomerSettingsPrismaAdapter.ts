import { PrismaClient, CustomerSettingsUpdateInput, CustomerSettings } from "@prisma/client";

class CustomerSettingsPrismaAdapter {
  prisma: PrismaClient;

  constructor(prismaClient: PrismaClient) {
    this.prisma = prismaClient;
  }

  async getCustomerSettingsByCustomerId(customerId: string) {
    return this.prisma.customerSettings.findOne({
      where: { customerId },
    });
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
