import { ColourSettings, PrismaClient } from "@prisma/client";

class ColourSettingsPrismaAdapter {
  prisma: PrismaClient;
  constructor(prismaClient: PrismaClient) {
    this.prisma = prismaClient;
  }
  getById(colourSettingsId: number) {
    return this.prisma.colourSettings.findOne({
      where: { id: colourSettingsId },
    });
  }

  async delete(colourSettingsId: number): Promise<ColourSettings> {
    return this.prisma.colourSettings.delete({
      where: {
        id: colourSettingsId,
      },
    });
  }

}

export default ColourSettingsPrismaAdapter;
