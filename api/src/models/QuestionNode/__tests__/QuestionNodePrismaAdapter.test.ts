import { Prisma } from "@prisma/client";
import cuid from 'cuid';

import { makeTestPrisma } from "../../../test/utils/makeTestPrisma";
import { clearDatabase } from './testUtils';
import QuestionNodePrismaAdapter from '../QuestionNodePrismaAdapter';
import { CreateLinkInput, CreateShareInput, UpdateLinkInput, UpdateShareInput } from "../QuestionNodePrismaAdapterType";


const prisma = makeTestPrisma();
const questionNodePrismaAdapter = new QuestionNodePrismaAdapter(prisma);

describe('QuestionNodePrismaAdapter', () => {

    afterEach(async () => {
        await clearDatabase(prisma);
        await prisma.$disconnect();
    });

    test('Creates, reads, updates and deletes a video node', async () => {
        const questionNode = await prisma.questionNode.create({
            data: {
                title: 'questionNodeOne',
            }
        });

        // Creates a video node
        const videoNode = await questionNodePrismaAdapter.createVideoNode({
            parentNodeId: questionNode.id,
            videoUrl: 'https://video-url.here',
        });

        // Reads a video node
        const existingVideoNode = await questionNodePrismaAdapter.getVideoNodeById(videoNode.id);
        expect(existingVideoNode).not.toBeNull();
        expect(existingVideoNode?.videoUrl).toBe('https://video-url.here');

        // Updates a video node
        await questionNodePrismaAdapter.updateVideoNode(videoNode.id, { videoUrl: 'https://new-url.now' });
        const nodeWithUpdatedVideoUrl = await questionNodePrismaAdapter.findNodeById(questionNode.id);
        expect(nodeWithUpdatedVideoUrl?.videoEmbeddedNode?.videoUrl).toBe('https://new-url.now');

        // Deletes a video node
        await questionNodePrismaAdapter.deleteVideoNode(videoNode.id);
        const nonExistingVideoNode = await questionNodePrismaAdapter.getVideoNodeById(videoNode.id);
        expect(nonExistingVideoNode).toBeNull();
    });

    test('Creates, reads, updates and deletes a slider node', async () => {
        const questionNode = await prisma.questionNode.create({
            data: {
                title: 'questionNodeOne',
            }
        });

        // Creates slider node
        const sliderNode = await questionNodePrismaAdapter.createSliderNode({
            parentNodeId: questionNode.id,
            happyText: 'Satisfied',
            unhappyText: 'Dissatisfied',
            markers: [
                {
                    id: '-1',
                    label: 'Amazing!',
                    subLabel: 'This is excellent.',
                    range: { start: 9.5 },
                },
                {
                    id: '-2',
                    label: 'Good!',
                    subLabel: 'This is good.',
                    range: { start: 6, end: 9.5 },
                },
                {
                    id: '-3',
                    label: 'Neutral!',
                    subLabel: 'Something is not great.',
                    range: { start: 5, end: 6 },
                },
                {
                    id: '-4',
                    label: 'Bad',
                    subLabel: 'This is bad.',
                    range: { start: 3, end: 5 },
                },
                {
                    id: '-5',
                    label: 'Terrible',
                    subLabel: 'This is terrible',
                    range: { end: 3 },
                },
            ],
        });

        // Reads slider node
        const nodeWithSliderNode = await prisma.questionNode.findUnique({
            where: {
                id: questionNode.id,
            },
            include: {
                sliderNode: {
                    include: {
                        markers: true,
                    }
                },
            },
        });

        expect(nodeWithSliderNode?.sliderNode).not.toBeNull();
        expect(nodeWithSliderNode?.sliderNode?.happyText).toBe('Satisfied');
        expect(nodeWithSliderNode?.sliderNode?.unhappyText).toBe('Dissatisfied');
        expect(nodeWithSliderNode?.sliderNode?.markers).toHaveLength(5);

        // Updates slider node 
        await questionNodePrismaAdapter.updateSliderNode(nodeWithSliderNode?.sliderNode?.id || '-1', {
            happyText: 'Happy',
            unhappyText: 'Unhappy',
            markers: [
                {
                    id: '-1',
                    label: 'Great!',
                    subLabel: 'This is awesome.',
                },
            ],
        });

        const nodeWithUpdatedSliderNode = await prisma.questionNode.findUnique({
            where: {
                id: questionNode.id,
            },
            include: {
                sliderNode: {
                    include: {
                        markers: true,
                    }
                },
            },
        });

        expect(nodeWithUpdatedSliderNode?.sliderNode?.happyText).toBe('Happy');
        expect(nodeWithUpdatedSliderNode?.sliderNode?.unhappyText).toBe('Unhappy');
        const updatedMarker = nodeWithUpdatedSliderNode?.sliderNode?.markers.find((marker) => marker.id === '-1');
        expect(updatedMarker?.label).toBe('Great!');
        expect(updatedMarker?.subLabel).toBe('This is awesome.');

        // Deletes slider node
        await questionNodePrismaAdapter.deleteSliderNode(nodeWithUpdatedSliderNode?.sliderNodeId || '-1');
        const nodeWithoutSliderNode = await prisma.questionNode.findUnique({
            where: {
                id: questionNode.id,
            },
            include: {
                sliderNode: true,
            },
        });

        expect(nodeWithoutSliderNode?.sliderNode).toBeNull();

    });

    test('Upserts a share CTA node', async () => {
        const questionNode = await prisma.questionNode.create({
            data: {
                title: 'questionNodeOne',
            }
        });
        const createShareInput: CreateShareInput = {
            title: 'createTitle',
            tooltip: 'createTooltip',
            url: 'https://create.url',
            questionId: questionNode.id,
        };

        const updateShareInput: UpdateShareInput = {
            title: 'updateTitle',
            tooltip: 'updateTooltip',
            url: 'https://update.url',
        }

        const createShare = await questionNodePrismaAdapter.upsertShareNode('', createShareInput, updateShareInput);
        expect(createShare?.title).toBe(createShareInput.title);
        expect(createShare?.tooltip).toBe(createShareInput.tooltip);
        expect(createShare?.url).toBe(createShareInput.url);

        const updateShare = await questionNodePrismaAdapter.upsertShareNode(createShare.id, createShareInput, updateShareInput);

        expect(updateShare?.title).toBe(updateShareInput.title);
        expect(updateShare?.tooltip).toBe(updateShareInput.tooltip);
        expect(updateShare?.url).toBe(updateShareInput.url);
    });

    test('Finds share CTA node based on parent question node', async () => {
        const questionNode = await prisma.questionNode.create({
            data: {
                title: 'questionNodeOne',
                share: {
                    create: {
                        title: 'createTitle',
                        tooltip: 'createTooltip',
                        url: 'https://create.url',
                    }
                }
            }
        });

        const shareNotFound = await questionNodePrismaAdapter.getShareNodeByQuestionId('')
        expect(shareNotFound).toBeNull();

        const shareFound = await questionNodePrismaAdapter.getShareNodeByQuestionId(questionNode.id);
        expect(shareFound).not.toBeNull();
        expect(shareFound?.title).toBe('createTitle');
        expect(shareFound?.tooltip).toBe('createTooltip');
        expect(shareFound?.url).toBe('https://create.url');
    });

    test('Deletes share node based on ID', async () => {
        const questionNode = await prisma.questionNode.create({
            data: {
                title: 'questionNodeOne',
                share: {
                    create: {
                        title: 'createTitle',
                        tooltip: 'createTooltip',
                        url: 'https://create.url',
                    }
                }
            }
        });
        const shareNode = await questionNodePrismaAdapter.getShareNodeByQuestionId(questionNode.id);
        expect(shareNode).not.toBeNull();

        await questionNodePrismaAdapter.deleteShareNode(shareNode?.id || '');

        const shareNodeNotFound = await questionNodePrismaAdapter.getShareNodeByQuestionId(questionNode.id);
        expect(shareNodeNotFound).toBeNull();
    });

    test('Deletes options of a question node by its ID', async () => {
        const questionNodeOne = await prisma.questionNode.create({
            data: {
                title: 'questionNodeOne',
                options: {
                    create: [
                        {
                            value: 'optionOne'
                        },
                        {
                            value: 'optionTwo'
                        }
                    ]
                }
            }
        });

        const questionNodeTwo = await prisma.questionNode.create({
            data: {
                title: 'questionNodeTwo',
                options: {
                    create: {
                        value: 'optionThree'
                    },
                }
            }
        });

        const questionNodeThree = await prisma.questionNode.create({
            data: {
                title: 'questionNodeTwo',
                options: {
                    create: {
                        value: 'optionFour'
                    },
                }
            }
        });

        // Deletes question options of first two questions
        await questionNodePrismaAdapter.deleteOptionsByQuestionIds([questionNodeOne.id, questionNodeTwo.id]);

        const questionOneWithoutOptions = await questionNodePrismaAdapter.findNodeById(questionNodeOne.id);
        expect(questionOneWithoutOptions?.options).toHaveLength(0);

        const questionTwoWithoutOptions = await questionNodePrismaAdapter.findNodeById(questionNodeTwo.id);
        expect(questionTwoWithoutOptions?.options).toHaveLength(0);

        const questionThreeWithOptions = await questionNodePrismaAdapter.findNodeById(questionNodeThree.id);
        expect(questionThreeWithOptions?.options).toHaveLength(1);
    });

    test('Upserts a Link for a CTA node', async () => {
        const cta = await prisma.questionNode.create({
            data: {
                type: 'LINK',
                isLeaf: true,
                title: 'linkNode',
            }
        })
        const createLinkInput: CreateLinkInput = {
            questionId: cta.id,
            title: 'createLinkTitle',
            backgroundColor: '#fffff',
            iconUrl: 'https://icon.create',
            type: 'SOCIAL',
            url: 'https://url.create',
        }

        const updateLinkInput: UpdateLinkInput = {
            title: 'updateLinkTitle',
            backgroundColor: '#00000',
            iconUrl: 'https://icon.update',
            type: 'FACEBOOK',
            url: 'https://url.update',
        }

        const createdLink = await questionNodePrismaAdapter.upsertLink('', createLinkInput, updateLinkInput);
        expect(createdLink?.title).toBe(createLinkInput.title);
        expect(createdLink?.backgroundColor).toBe(createLinkInput.backgroundColor);
        expect(createdLink?.iconUrl).toBe(createLinkInput?.iconUrl);
        expect(createdLink?.type).toBe(createLinkInput?.type);
        expect(createdLink?.url).toBe(createLinkInput?.url);

        const updatedLink = await questionNodePrismaAdapter.upsertLink(createdLink?.id || '', createLinkInput, updateLinkInput);
        expect(updatedLink?.title).toBe(updateLinkInput.title);
        expect(updatedLink?.backgroundColor).toBe(updateLinkInput.backgroundColor);
        expect(updatedLink?.iconUrl).toBe(updateLinkInput?.iconUrl);
        expect(updatedLink?.type).toBe(updateLinkInput?.type);
        expect(updatedLink?.url).toBe(updateLinkInput?.url);
    });

    test('Deletes links based on their IDs', async () => {
        const nodeWithLinks = await prisma.questionNode.create({
            data: {
                title: 'questionNodeOne',
                links: {
                    create: [
                        {
                            id: 'linkOneId',
                            title: 'linkOneTitle',
                            backgroundColor: '#fffff',
                            iconUrl: 'https://icon.create',
                            type: 'SOCIAL',
                            url: 'https://url.create',
                        },
                        {
                            id: 'linkTwoId',
                            title: 'linkTwoTitle',
                            backgroundColor: '#fffff',
                            iconUrl: 'https://icon.create',
                            type: 'SOCIAL',
                            url: 'https://url.create',
                        },
                        {
                            id: 'linkThreeId',
                            title: 'linkThreeTitle',
                            backgroundColor: '#fffff',
                            iconUrl: 'https://icon.create',
                            type: 'SOCIAL',
                            url: 'https://url.create',
                        },
                    ],
                },
            },
        });

        await questionNodePrismaAdapter.deleteLinks(['linkOneId', 'linkThreeId']);
        const ctaWithOneLink = await prisma.questionNode.findUnique({
            where: {
                id: nodeWithLinks.id,
            },
            include: {
                links: true,
            }
        });
        expect(ctaWithOneLink?.links).toHaveLength(1);
        expect(ctaWithOneLink?.links?.[0]?.id).toBe('linkTwoId')
    });

    test('Finds links based on its parent question ID', async () => {
        const nodeOne = await prisma.questionNode.create({
            data: {
                title: 'questionNodeOne',
                links: {
                    create: [
                        {
                            id: 'linkOneId',
                            title: 'linkOneTitle',
                            backgroundColor: '#fffff',
                            iconUrl: 'https://icon.create',
                            type: 'SOCIAL',
                            url: 'https://url.create',
                        },
                        {
                            id: 'linkTwoId',
                            title: 'linkTwoTitle',
                            backgroundColor: '#fffff',
                            iconUrl: 'https://icon.create',
                            type: 'SOCIAL',
                            url: 'https://url.create',
                        },
                    ],
                },
            },
        });

        const nodeTwo = await prisma.questionNode.create({
            data: {
                title: 'questionNodeTwo',
                type: 'LINK',
                links: {
                    create: {
                        id: 'linkThreeId',
                        title: 'linkThreeTitle',
                        backgroundColor: '#fffff',
                        iconUrl: 'https://icon.create',
                        type: 'SOCIAL',
                        url: 'https://url.create',
                    },
                }
            }
        });

        const linksNodeOne = await questionNodePrismaAdapter.getLinksByNodeId(nodeOne.id);
        expect(linksNodeOne).toHaveLength(2);

        const linksNodeTwo = await questionNodePrismaAdapter.getLinksByNodeId(nodeTwo.id);
        expect(linksNodeTwo).toHaveLength(1);
        expect(linksNodeTwo?.[0]?.id).toBe('linkThreeId');
    });

    test('Creates fields for a form CTA node', async () => {
        const nodeOne = await prisma.questionNode.create({
            data: {
                title: 'formNodeOne',
                type: 'FORM',
            }
        });

        await questionNodePrismaAdapter.createFieldsOfForm({
            questionId: nodeOne.id,
            fields: {
                fields: {
                    create: [
                        {
                            isRequired: false,
                            label: 'First name',
                            type: 'shortText',
                            position: 1,
                        },
                        {
                            isRequired: false,
                            label: 'Last name',
                            type: 'shortText',
                            position: 2,
                        },
                        {
                            isRequired: true,
                            placeholder: 'email address',
                            label: 'Email',
                            type: 'email',
                            position: 3,
                        },
                    ],
                },
            },
        });

        const nodeWithFormFields = await prisma.questionNode.findUnique({
            where: {
                id: nodeOne.id,
            },
            include: {
                form: {
                    include: {
                        fields: true,
                    }
                },
            },
        });
        expect(nodeWithFormFields?.form?.fields).toHaveLength(3);
        const formFieldThree = nodeWithFormFields?.form?.fields.find((field) => field.type === 'email');
        expect(formFieldThree?.isRequired).toBe(true);
        expect(formFieldThree?.type).toBe('email');
        expect(formFieldThree?.position).toBe(3);
        expect(formFieldThree?.placeholder).toBe('email address');
    });
});