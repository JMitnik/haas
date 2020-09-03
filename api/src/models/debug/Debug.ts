import { mutationField, objectType } from '@nexus/schema';

import { mailService } from '../../services/mailings/MailService';
import makeBasicTriggerTemplate from '../../services/mailings/templates/makeBasicTriggerTemplate';
import prisma from '../../config/prisma';

export const DebugType = objectType({
  name: 'Debug',
  definition(t) {
    t.field('debugResolver', {
      type: 'String',
      nullable: true,

      async resolve(parent: any, args, ctx) {
        return {} as any;
      },
    });
  },
});

export const DebugMutation = mutationField('debugMutation', {
  type: 'String',
  nullable: true,
  async resolve(parent: any, args, ctx) {
    const roles = await prisma.role.findOne({
      where: { id: '1' },
      select: {
        permissions: true,
      },
    });

    return 'test';
  },
});
