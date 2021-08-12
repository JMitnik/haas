import { Prisma } from "@prisma/client";
import { makeTestPrisma } from "../../../test/utils/makeTestPrisma";
import NodeEntryPrismaAdapter from '../../node-entry/NodeEntryPrismaAdapter';
import { clearDatabase } from './testUtils';

const prisma = makeTestPrisma();
const nodeEntryPrismaAdapter = new NodeEntryPrismaAdapter(prisma);

const defaultDialogueCreateInput: Prisma.DialogueCreateInput = {
    id: 'DIALOGUE_ID',
    title: 'DEFAULT_DIALOGUE',
    slug: 'default',
    description: 'description',
    customer: {
        create: {
            name: 'DEFAULT_CUSTOMER',
            slug: 'customerSlug',
        },
    },
};

const defaultFormNodeEntryInput: Prisma.FormNodeEntryCreateInput = {
    nodeEntry: {
        create: {
            id: 'DEFAULT_FORM_NODE_ENTRY_ID',
            depth: 3,
            session: {
                connect: {
                    id: 'SESSION_ID'
                },
            },
        },
    },
    values: {
        create: [
            {
                email: 'daan@haas.live',
                relatedField: {
                    create: {
                        label: 'Email',
                        position: 0,
                        type: 'email'
                    }
                }
            },
            {
                longText: 'loooong',
                relatedField: {
                    create: {
                        label: 'Long text',
                        position: 1,
                        type: 'longText',
                    },
                },
            },
            {
                number: 123,
                relatedField: {
                    create: {
                        label: 'Number',
                        position: 2,
                        type: 'number',
                    },
                },
            },
            {
                phoneNumber: '+31681451819',
                relatedField: {
                    create: {
                        label: 'Phone',
                        position: 3,
                        type: 'phoneNumber',
                    },
                },
            },
            {
                shortText: 'short.',
                relatedField: {
                    create: {
                        label: 'Short text',
                        position: 4,
                        type: 'shortText',
                    },
                },
            },
            {
                url: 'https://fake-link.here',
                relatedField: {
                    create: {
                        label: 'Link',
                        position: 5,
                        type: 'url'
                    },
                },
            },
        ],
    },
};

const defaultVideoNodeEntryCreateInput: Prisma.NodeEntryCreateInput = {
    id: 'DEFAULT_VIDEO_ENTRY_ID',
    depth: 2,
    videoNodeEntry: {
        create: {
            value: 'Video'
        }
    }
};

const sliderNodeEntryCreateInput: Prisma.SliderNodeEntryCreateInput = {
    value: 69,
    nodeEntry: {
        create: {
            id: 'DEFAULT_SLIDER_ENTRY_ID',
            depth: 0,
        },
    },
};

const defaultChoiceEntryCreateInput: Prisma.ChoiceNodeEntryCreateInput = {
    value: 'CHOICE',
    nodeEntry: {
        create: {
            id: 'DEFAULT_CHOICE_ENTRY_ID',
            depth: 1,
        },
    },
};


const defaultSessionCreateInput: Prisma.SessionCreateInput = {
    id: 'SESSION_ID',
    dialogue: {
        connect: {
            id: defaultDialogueCreateInput.id,
        },
    },
    // nodeEntries: {
    //     connect: [
    //         {
    //             id: 'DEFAULT_FORM_NODE_ENTRY_ID',
    //         },
    //         {
    //             id: 'DEFAULT_VIDEO_ENTRY_ID',
    //         },
    //         {
    //             id: 'DEFAULT_SLIDER_ENTRY_ID',
    //         },
    //         {
    //             id: 'DEFAULT_CHOICE_ENTRY_ID',
    //         },
    //     ]
    // }
};


describe('NodeEntryPrismaAdapter', () => {
    beforeEach(async () => {
        await prisma.dialogue.create({
            data: defaultDialogueCreateInput,
        });

        await prisma.nodeEntry.create({
            data: defaultVideoNodeEntryCreateInput,
        });

        await prisma.sliderNodeEntry.create({
            data: sliderNodeEntryCreateInput,
        });

        await prisma.choiceNodeEntry.create({
            data: defaultChoiceEntryCreateInput,
        });

        await prisma.session.create({
            data: defaultSessionCreateInput,
        });
    });

    afterEach(async () => {
        await clearDatabase(prisma);
        prisma.$disconnect();
    });

    test('Finds node entries by session ID', async () => {

        const foundNodeEntries = await prisma.session.findUnique({
            where: {
                id: 'SESSION_ID',
            },
        }); // await nodeEntryPrismaAdapter.getNodeEntriesBySessionId('SESSION_ID');
        console.log(foundNodeEntries);
        // expect(foundNodeEntries).toHaveLength(4);
    });
});