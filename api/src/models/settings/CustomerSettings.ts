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

      async resolve(parent, args, ctx) {
        if (!parent.colourSettingsId) return null;

        const colourSettings = await ctx.services.customerService.getColourSettings(parent.colourSettingsId);

        return colourSettings;
      },
    });

    t.field('fontSettings', {
      nullable: true,
      type: FontSettingsType,

      async resolve(parent, args, ctx) {
        if (!parent.fontSettingsId) return null;
        const colourSettings = await ctx.services.customerService.getFontSettings(parent.fontSettingsId);

        return colourSettings;
      },
    });
  },
});

const customerSettingsNexus = [CustomerSettingsType, FontSettingsType, ColourSettingsType];

export default customerSettingsNexus;
