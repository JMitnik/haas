import { SystemPermissionEnum } from '@prisma/client';
import { isPresent } from 'ts-is-present';

export const SystemPermissions: SystemPermissionEnum[] = Object.values(SystemPermissionEnum).filter(isPresent);
