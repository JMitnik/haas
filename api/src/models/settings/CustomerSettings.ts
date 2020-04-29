import { PrismaClient, CustomerSettings } from '@prisma/client';
import { objectType } from '@nexus/schema';

const prisma = new PrismaClient();

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
      resolve(parent: CustomerSettings, args: any, ctx: any, info: any) {
        const colourSettings = prisma.colourSettings.findOne(
          { where: { id: parent.colourSettingsId } },
        );
        return colourSettings;
      },
    });
    t.field('fontSettings', {
      nullable: true,
      type: FontSettingsType,
      resolve(parent: CustomerSettings, args: any, ctx: any, info: any) {
        const colourSettings = prisma.fontSettings.findOne(
          { where: { id: parent.fontSettingsId } },
        );
        return colourSettings;
      },
    });
  },
});

const customerSettingsNexus = [CustomerSettingsType, FontSettingsType, ColourSettingsType];

export default customerSettingsNexus;
