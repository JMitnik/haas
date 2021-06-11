import { FontSettingsPrismaAdapterType } from "./FontSettingsPrismaAdapterType";
import { PrismaClient, FontSettings } from "@prisma/client";

class FontSettingsPrismaAdapter implements FontSettingsPrismaAdapterType {
  prisma: PrismaClient;
  constructor(prismaClient: PrismaClient) {
    this.prisma = prismaClient;
  }
  getById(fontSettingsId: number): Promise<FontSettings | null> {
    return this.prisma.fontSettings.findOne({
      where: { id: fontSettingsId },
    });
  }
  async delete(fontSettingsId: number): Promise<FontSettings> {
    return this.prisma.fontSettings.delete({
      where: {
        id: fontSettingsId,
      },
    });
  }

}

export default FontSettingsPrismaAdapter;
