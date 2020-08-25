import { objectType, mutationField } from '@nexus/schema';
import { mailService } from '../../services/mailings/MailService';
import { smsService } from '../../services/sms/SmsService';

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
    
    mailService.send({
      body: 'Test123',
      recipient: 'jonathan@haas.live',
      subject: 'Test test test',
    });
  },
});
