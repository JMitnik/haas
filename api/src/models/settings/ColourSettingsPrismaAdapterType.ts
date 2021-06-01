import { ColourSettings } from "@prisma/client";

export interface ColourSettingsPrismaAdapterType {
  delete(colourSettingsId: number): Promise<ColourSettings>;
}