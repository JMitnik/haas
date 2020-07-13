import { CustomerSettings, PrismaClient } from '@prisma/client';
import { objectType } from '@nexus/schema';

export const ColourSettingsType = objectType({
  name: 'ColourSettings',

  definition(t) {
    t.id('id');
    t.string('primary');
    t.string('secondary', { nullable: true });
    t.string('primaryAlt', { nullable: true });
  },
});

export const FontSettingsType = objectType({
  name: 'FontSettings',

  definition(t) {
    t.id('id');
  },
});

export const CustomerSettingsType = objectType({
  name: 'CustomerSettings',

  definition(t) {
    t.id('id');
    t.string('logoUrl', { nullable: true });

    t.field('colourSettings', {
      type: ColourSettingsType,
      nullable: true,

      resolve(parent: CustomerSettings, args: any, ctx: any) {
        const { prisma }: { prisma: PrismaClient } = ctx;
        const colourSettings = prisma.colourSettings.findOne(
          { where: { id: parent.colourSettingsId || undefined } },
        );
        return colourSettings;
      },
    });
    t.field('fontSettings', {
      nullable: true,
      type: FontSettingsType,

      resolve(parent: CustomerSettings, args: any, ctx: any) {
        const { prisma }: { prisma: PrismaClient } = ctx;
        const colourSettings = prisma.fontSettings.findOne(
          { where: { id: parent.fontSettingsId || undefined } },
        );
        return colourSettings;
      },
    });
  },
});

const customerSettingsNexus = [CustomerSettingsType, FontSettingsType, ColourSettingsType];

export default customerSettingsNexus;
