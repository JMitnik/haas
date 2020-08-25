import { objectType, mutationField } from '@nexus/schema';
import { mailService } from '../../services/mailings/MailService';
import makeBasicTriggerTemplate from '../../services/mailings/templates/makeBasicTriggerTemplate';

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
    const body = makeBasicTriggerTemplate('Lev', '123132ae', 7.3);


    mailService.send({
      body,
      recipient: 'lev@haas.live',
      subject: 'A new trigger alert from HAAS',
    });
  },
});
