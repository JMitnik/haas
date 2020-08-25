import { objectType, mutationField } from '@nexus/schema';
import { mailService } from '../../services/mailings/mail-service';

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
    mailService.sendMail({
      from: 'test',
      to: 'test',
      body: 'test',
      subject: 'test'
    });
    return 'haha'
  },
});
