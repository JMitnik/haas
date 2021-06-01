import { FontSettings } from "@prisma/client";

export interface FontSettingsPrismaAdapterType {
  delete(fontSettingsId: number): Promise<FontSettings>;
}