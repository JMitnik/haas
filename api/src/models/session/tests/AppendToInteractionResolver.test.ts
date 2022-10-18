import { makeTestContext } from '../../../test/utils/makeTestContext';
import { clearDatabase, seedWorkspace, seedSession } from './testUtils';
import { prisma } from '../../../test/setup/singletonDeps';

jest.setTimeout(30000);

const ctx = makeTestContext(prisma);

const Mutation = `
mutation appendToInteraction($input: AppendToInteractionInput) {
  appendToInteraction(input: $input) {
    id
  }
}
`;

describe('Create Session Resolver', () => {
  afterEach(async () => {
    await clearDatabase(prisma);
    await prisma.$disconnect();
  });

  it('Can create action request when form is filled in for negative interaction', async () => {
    const { dialogue, sliderQuestion, choiceQuestion } = await seedWorkspace(prisma);

    const negativeSession = await seedSession(prisma, dialogue.id, sliderQuestion.id, 54, choiceQuestion.id, 'Home')
    const formNodeField = await prisma.formNodeField.create({
      data: {
        label: 'Email',
        position: 1,
        type: 'email',
      },
    });

    await ctx.client.request(Mutation,
      {
        input: {
          'data': {
            'form': {
              'values': [
                {
                  'relatedFieldId': formNodeField.id,
                  'email': 'daan@haas.live',
                },
              ],
            },
          },
          'sessionId': negativeSession.id,
        },
      }
    );

    const session = await prisma.session.findUnique({
      where: {
        id: negativeSession.id,
      },
      include: {
        actionRequest: {
          include: {
            issue: {
              include: {
                topic: true,
              },
            },
          },
        },
      },
    });

    expect(session?.actionRequestId).not.toBeNull();
    expect(session?.actionRequest?.issue?.topic.name).toBe('Home');
  });

});
