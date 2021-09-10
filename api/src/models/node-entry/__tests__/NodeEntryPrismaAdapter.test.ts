import { Dialogue, Prisma } from "@prisma/client";
import { makeTestPrisma } from "../../../test/utils/makeTestPrisma";
import NodeEntryPrismaAdapter from '../../node-entry/NodeEntryPrismaAdapter';
import SessionPrismaAdapter from '../../session/SessionPrismaAdapter';
import { clearDatabase } from './testUtils';

const prisma = makeTestPrisma();
const nodeEntryPrismaAdapter = new NodeEntryPrismaAdapter(prisma);
const sessionPrismaAdapter = new SessionPrismaAdapter(prisma);

let defaultDialogue: Dialogue;

describe('NodeEntryPrismaAdapter', () => {
    beforeEach(async () => {
        defaultDialogue = await prisma.dialogue.create({
            data: {
                title: 'DEFAULT_DIALOGUE',
                slug: 'default',
                description: 'description',
                customer: {
                    create: {
                        name: 'DEFAULT_CUSTOMER',
                        slug: 'customerSlug',
                    },
                },
            },
        });

        await prisma.formNode.create({
            data: {
                fields: {
                    create: [
                        {
                            id: 'shortTextId',
                            label: 'Short Text',
                            position: 0,
                            type: 'shortText',
                        },
                        {
                            id: 'longTextId',
                            label: 'Long text',
                            position: 1,
                            type: 'longText',
                        },
                        {
                            id: 'emailId',
                            label: 'Email',
                            position: 2,
                            type: 'email'
                        },
                        {
                            id: 'numberId',
                            label: 'Number',
                            position: 3,
                            type: 'number',
                        },
                        {
                            id: 'phoneNumberId',
                            label: 'Phone Number',
                            position: 4,
                            type: 'phoneNumber',
                        },
                        {
                            id: 'urlId',
                            label: 'Url',
                            position: 5,
                            type: 'url'
                        },
                    ]
                }
            }
        })
    });

    afterEach(async () => {
        await clearDatabase(prisma);
        await prisma.$disconnect();
    });

    test('Finds node entries by session ID', async () => {
        await sessionPrismaAdapter.createSession({
            dialogueId: defaultDialogue.id,
            originUrl: 'does not matter',
            device: 'Android',
            totalTimeInSec: 0,
            entries: [
                {
                    depth: 0,
                    data: {
                        slider: {
                            value: 100,
                        }
                    }
                }
            ]
        })

        const sesh = await sessionPrismaAdapter.createSession({
            dialogueId: defaultDialogue.id,
            originUrl: 'https/placeholder.com',
            device: 'Android',
            totalTimeInSec: 69,
            entries: [
                {
                    depth: 0,
                    data: {
                        slider: {
                            value: 22
                        }
                    },
                },
                {
                    depth: 1,
                    data: {
                        choice: {
                            value: 'CHOICE',
                        }
                    }
                },
                {
                    depth: 2,
                    data: {
                        video: {
                            value: 'I understand',
                        },
                    },
                },
                {
                    depth: 3,
                    data: {
                        form: {
                            values: [
                                {
                                    email: 'email@haas.nl',
                                    relatedFieldId: 'emailId',
                                },
                                {
                                    longText: 'longText',
                                    relatedFieldId: 'longTextId',
                                },
                                {
                                    number: 123,
                                    relatedFieldId: 'numberId',
                                },
                                {
                                    phoneNumber: '+316123456789',
                                    relatedFieldId: 'phoneNumberId',
                                },
                                {
                                    shortText: 'shortText',
                                    relatedFieldId: 'shortTextId',
                                },
                                {
                                    url: 'https://url-here.nl',
                                    relatedFieldId: 'urlId',
                                }
                            ]
                        }
                    }
                }
            ]
        });

        const foundNodeEntries = await nodeEntryPrismaAdapter.getNodeEntriesBySessionId(sesh.id);
        expect(foundNodeEntries).not.toBeNull();

        // Only finds node entries of session id
        expect(foundNodeEntries).toHaveLength(4);

        // Finds slider value of correct node entry
        const sliderNodeEntry = foundNodeEntries.find((nodeEntry) => nodeEntry?.sliderNodeEntry?.value);
        expect(sliderNodeEntry).not.toBeNull();
        expect(sliderNodeEntry?.sliderNodeEntry?.value).toBe(22);

        // Empty list for incorrect session id
        const noNodeEntries = await nodeEntryPrismaAdapter.getNodeEntriesBySessionId('INVALID_ID');
        expect(noNodeEntries).toHaveLength(0);
    });

    test('Counts amount of node entries in session', async () => {
        await sessionPrismaAdapter.createSession({
            dialogueId: defaultDialogue.id,
            originUrl: 'does not matter',
            device: 'Android',
            totalTimeInSec: 0,
            entries: [
                {
                    depth: 0,
                    data: {
                        slider: {
                            value: 100,
                        }
                    }
                }
            ]
        });

        const sesh = await sessionPrismaAdapter.createSession({
            dialogueId: defaultDialogue.id,
            originUrl: 'does not matter',
            device: 'Android',
            totalTimeInSec: 0,
            entries: [
                {
                    depth: 0,
                    data: {
                        slider: {
                            value: 50,
                        }
                    }
                },
                {
                    depth: 1,
                    data: {
                        choice: {
                            value: 'kaas'
                        }
                    }
                }
            ]
        });

        const countedEntries = await nodeEntryPrismaAdapter.countNodeEntriesBySessionId(sesh.id);
        expect(countedEntries).toBe(2);
    });

    test('Finds value of node entry', async () => {
        await sessionPrismaAdapter.createSession({
            dialogueId: defaultDialogue.id,
            originUrl: 'does not matter',
            device: 'Android',
            totalTimeInSec: 0,
            entries: [
                {
                    depth: 0,
                    data: {
                        slider: {
                            value: 10,
                        }
                    }
                },
            ]
        });

        const sesh = await sessionPrismaAdapter.createSession({
            dialogueId: defaultDialogue.id,
            originUrl: 'does not matter',
            device: 'Android',
            totalTimeInSec: 0,
            entries: [
                {
                    depth: 0,
                    data: {
                        slider: {
                            value: 100,
                        }
                    }
                },
                {
                    depth: 1,
                    data: {
                        choice: {
                            value: 'kaas'
                        }
                    }
                }
            ]
        });

        const nodeEntryId = sesh?.nodeEntries?.[0]?.id;

        // Finds corrrect slider node entry with value 100
        const nodeEntry = await nodeEntryPrismaAdapter.findNodeEntryValuesById(nodeEntryId);
        expect(nodeEntry).not.toBeNull();
        expect(nodeEntry?.sliderNodeEntry?.value).toBe(100);
    });

    test('Deletes all node entries by session id', async () => {
        const sesh = await sessionPrismaAdapter.createSession({
            dialogueId: defaultDialogue.id,
            originUrl: 'https/placeholder.com',
            device: 'Android',
            totalTimeInSec: 69,
            entries: [
                {
                    depth: 0,
                    data: {
                        slider: {
                            value: 22
                        }
                    },
                },
                {
                    depth: 1,
                    data: {
                        choice: {
                            value: 'CHOICE',
                        }
                    }
                },
                {
                    depth: 2,
                    data: {
                        video: {
                            value: 'I understand',
                        },
                    },
                },
                {
                    depth: 3,
                    data: {
                        form: {
                            values: [
                                {
                                    email: 'email@haas.nl',
                                    relatedFieldId: 'emailId',
                                },
                                {
                                    longText: 'longText',
                                    relatedFieldId: 'longTextId',
                                },
                                {
                                    number: 123,
                                    relatedFieldId: 'numberId',
                                },
                                {
                                    phoneNumber: '+316123456789',
                                    relatedFieldId: 'phoneNumberId',
                                },
                                {
                                    shortText: 'shortText',
                                    relatedFieldId: 'shortTextId',
                                },
                                {
                                    url: 'https://url-here.nl',
                                    relatedFieldId: 'urlId',
                                }
                            ]
                        }
                    }
                }
            ]
        });

        const sessionTwo = await sessionPrismaAdapter.createSession({
            dialogueId: defaultDialogue.id,
            originUrl: 'does not matter',
            device: 'Android',
            totalTimeInSec: 0,
            entries: [
                {
                    depth: 0,
                    data: {
                        slider: {
                            value: 100,
                        }
                    }
                },
                {
                    depth: 1,
                    data: {
                        choice: {
                            value: 'kaas'
                        }
                    }
                }
            ]
        });

        await sessionPrismaAdapter.createSession({
            dialogueId: defaultDialogue.id,
            originUrl: 'does not matter',
            device: 'Android',
            totalTimeInSec: 0,
            entries: [
                {
                    depth: 0,
                    data: {
                        slider: {
                            value: 42,
                        }
                    }
                },
            ]
        });

        const totalNodeEntriesPreDelete = await prisma.nodeEntry.findMany({ });
        expect(totalNodeEntriesPreDelete).toHaveLength(7);

        const sessionIds = [sesh.id, sessionTwo.id]
        const nodeEntries = await nodeEntryPrismaAdapter.getNodeEntriesBySessionIds(sessionIds || []);

        const nodeEntryIds = nodeEntries.map((nodeEntry) => nodeEntry.id);

        await nodeEntryPrismaAdapter.deleteManySliderNodeEntries(nodeEntryIds);

        await nodeEntryPrismaAdapter.deleteManyVideoNodeEntries(nodeEntryIds);

        await nodeEntryPrismaAdapter.deleteManyFormNodeEntries(nodeEntryIds);

        await nodeEntryPrismaAdapter.deleteManyTextBoxNodeEntries(nodeEntryIds);

        await nodeEntryPrismaAdapter.deleteManyRegistrationNodeEntries(nodeEntryIds);

        await nodeEntryPrismaAdapter.deleteManyLinkNodeEntries(nodeEntryIds);

        await nodeEntryPrismaAdapter.deleteManyChoiceNodeEntries(nodeEntryIds);

        await nodeEntryPrismaAdapter.deleteManyNodeEntries(sessionIds);

        const totalNodeEntriesPostDelete = await prisma.nodeEntry.findMany({ });
        expect(totalNodeEntriesPostDelete).toHaveLength(1)

    });

});