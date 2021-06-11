import { FontSettings } from "@prisma/client";

export interface FontSettingsPrismaAdapterType {
  getById(fontSettingsId: number): Promise<FontSettings|null>;
  delete(fontSettingsId: number): Promise<FontSettings>;
}