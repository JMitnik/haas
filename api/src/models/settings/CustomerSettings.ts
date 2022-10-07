import { objectType } from 'nexus';

export const ColourSettingsType = objectType({
  name: 'ColourSettings',

  definition(t) {
    t.int('id');
    t.string('primary');
    t.string('secondary', { nullable: true });
    t.string('primaryAlt', { nullable: true });
  },
});

export const FontSettingsType = objectType({
  name: 'FontSettings',

  definition(t) {
    t.int('id');
  },
});

export const CustomerSettingsType = objectType({
  name: 'CustomerSettings',

  definition(t) {
    t.int('id');
    t.string('logoUrl', { nullable: true });

    // On a schale of 1-100
    t.int('logoOpacity', { nullable: true, resolve: (parent) => (parent as any).logoOpacity ?? 30 });

    t.int('colourSettingsId');

    t.field('colourSettings', {
      type: ColourSettingsType,
      nullable: true,

      async resolve(parent, args, ctx) {
        if (!parent.colourSettingsId) return null;

        const colourSettings = await ctx.services.customerService.getColourSettings(parent.colourSettingsId);

        return colourSettings;
      },
    });

    t.int('fontSettingsId');

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
