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
    t.string('logoUrl', { nullable: true });

    // On a schale of 1-100
    t.int('logoOpacity', { nullable: true, resolve: (parent) => parent.logoOpacity ?? 30 });

    t.field('colourSettings', {
      type: ColourSettingsType,
      nullable: true,

      resolve(parent, args, ctx) {
        if (!parent.colourSettingsId) return null;

        const colourSettings = ctx.prisma.colourSettings.findOne({
          where: { id: parent.colourSettingsId || undefined },
        });

        return colourSettings;
      },
    });

    t.field('fontSettings', {
      nullable: true,
      type: FontSettingsType,

      resolve(parent, args, ctx) {
        const colourSettings = ctx.prisma.fontSettings.findOne({
          where: { id: parent.fontSettingsId || undefined },
        });

        return colourSettings;
      },
    });
  },
});

const customerSettingsNexus = [CustomerSettingsType, FontSettingsType, ColourSettingsType];

export default customerSettingsNexus;
