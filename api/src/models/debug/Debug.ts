import { objectType, mutationField } from '@nexus/schema';
import { mailService } from '../../services/mailings/mail-service';
import { smsService } from '../../services/sms/sms-service';

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
    smsService.send();
    return 'haha'
  },
});
