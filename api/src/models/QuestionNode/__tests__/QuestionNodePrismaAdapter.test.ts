import { Prisma } from "@prisma/client";
import cuid from 'cuid';

import { makeTestPrisma } from "../../../test/utils/makeTestPrisma";
import { clearDatabase } from './testUtils';
import QuestionNodePrismaAdapter from '../QuestionNodePrismaAdapter';
import { CreateCTAInput, CreateLinkInput, CreateShareInput, UpdateLinkInput, UpdateQuestionInput, UpdateShareInput } from "../QuestionNodePrismaAdapterType";
import { CreateCTAInputProps, QuestionOptionProps } from "../NodeServiceType";
import { CreateQuestionInput } from "../../questionnaire/DialoguePrismaAdapterType";
import EdgePrismaAdapter from "../../edge/EdgePrismaAdapter";
import { id } from "date-fns/locale";


const prisma = makeTestPrisma();
const questionNodePrismaAdapter = new QuestionNodePrismaAdapter(prisma);
const edgePrismaAdapter = new EdgePrismaAdapter(prisma)

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
                            id: 'firstNameId',
                            isRequired: false,
                            label: 'First name',
                            type: 'shortText',
                            position: 1,
                        },
                        {
                            id: 'lastNameId',
                            isRequired: false,
                            label: 'Last name',
                            type: 'shortText',
                            position: 2,
                        },
                        {
                            id: 'emailId',
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

    test('Updates fields of a form', async () => {
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
                            id: 'firstNameId',
                            placeholder: 'First name here',
                            isRequired: false,
                            label: 'First name',
                            type: 'shortText',
                            position: 1,
                        },
                    ],
                },
            },
        });
        const updateFormFields: Prisma.FormNodeFieldUpsertArgs[] = [
            {
                create: {
                    id: 'emailId',
                    isRequired: false,
                    label: 'Email',
                    placeholder: 'Enter email here',
                    type: 'email',
                    position: 1,
                },
                update: {
                    isRequired: true,
                    label: 'Not this email',
                    type: 'phoneNumber',
                    position: 3,
                },
                where: {
                    id: 'emailId',
                },
            },
            {
                create: {
                    isRequired: false,
                    label: 'First name',
                    type: 'shortText',
                    position: 2,
                },
                update: {
                    isRequired: true,
                    label: 'First name edit',
                    placeholder: 'First name placeholder edit',
                    type: 'longText',
                    position: 2,
                },
                where: {
                    id: 'firstNameId',
                },
            },
        ];
        const updateFields = { questionId: nodeOne.id, fields: updateFormFields };
        await questionNodePrismaAdapter.updateFieldsOfForm(updateFields);

        const updatedForm = await prisma.questionNode.findUnique({
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

        expect(updatedForm?.form?.fields).toHaveLength(2);

        // Field correctly created
        const emailField = updatedForm?.form?.fields.find((field) => field.id === 'emailId');
        expect(emailField).not.toBeNull();
        expect(emailField?.isRequired).toBe(false);
        expect(emailField?.label).toBe('Email');
        expect(emailField?.placeholder).toBe('Enter email here');
        expect(emailField?.position).toBe(1);
        expect(emailField?.type).toBe('email');

        const updatedFirstNameField = updatedForm?.form?.fields.find((field) => field.id === 'firstNameId');
        expect(updatedFirstNameField).not.toBeNull();
        expect(updatedFirstNameField?.isRequired).toBe(true);
        expect(updatedFirstNameField?.label).toBe('First name edit');
        expect(updatedFirstNameField?.placeholder).toBe('First name placeholder edit');
        expect(updatedFirstNameField?.position).toBe(2);
        expect(updatedFirstNameField?.type).toBe('longText');
    });

    test('Creates a CTA node', async () => {
        const workspaceWithDialogue = await prisma.customer.create({
            data: {
                name: 'workspace',
                slug: 'workspaceSlug',
                dialogues: {
                    create: {
                        id: 'dialogueId',
                        title: 'dialogue',
                        slug: 'dialogueSlug',
                        description: 'desc',
                    }
                }
            }
        })
        const input: CreateCTAInput = {
            dialogueId: 'dialogueId',
            title: 'AIOCTA',
            links: [
                {
                    id: 'linkThreeId',
                    title: 'linkThreeTitle',
                    backgroundColor: '#fffff',
                    iconUrl: 'https://icon.create',
                    type: 'SOCIAL',
                    url: 'https://url.create',
                }
            ],
            share: {
                id: 'shareId',
                title: 'shareTitle',
                tooltip: 'shareTooltip',
                url: 'shareUrl',
            },
            form: {
                fields: [
                    {
                        id: 'firstNameId',
                        placeholder: 'First name here',
                        isRequired: false,
                        label: 'First name',
                        type: 'shortText',
                        position: 1,
                    }
                ]
            },
            type: 'GENERIC',
        };

        await questionNodePrismaAdapter.createCTANode(input);
        const dialogueWithCTANode = await prisma.dialogue.findUnique({
            where: {
                id: 'dialogueId',
            },
            include: {
                questions: {
                    include: {
                        form: {
                            include: {
                                fields: true,
                            }
                        },
                        share: true,
                        links: true,
                    },
                },
            },
        });
        const cta = dialogueWithCTANode?.questions?.[0]
        expect(cta).not.toBeNull();

        // Links check
        expect(cta?.links).toHaveLength(1);
        expect(cta?.links?.[0]?.title).toBe('linkThreeTitle');
        expect(cta?.links?.[0]?.backgroundColor).toBe('#fffff');
        expect(cta?.links?.[0]?.iconUrl).toBe('https://icon.create');
        expect(cta?.links?.[0]?.type).toBe('SOCIAL');
        expect(cta?.links?.[0]?.url).toBe('https://url.create');

        // Share check
        expect(cta?.share?.title).toBe('shareTitle');
        expect(cta?.share?.tooltip).toBe('shareTooltip');
        expect(cta?.share?.url).toBe('shareUrl');

        // Form check
        expect(cta?.form?.fields).toHaveLength(1);
        expect(cta?.form?.fields?.[0]?.isRequired).toBe(false);
        expect(cta?.form?.fields?.[0]?.label).toBe('First name');
        expect(cta?.form?.fields?.[0]?.placeholder).toBe('First name here');
        expect(cta?.form?.fields?.[0]?.position).toBe(1);
        expect(cta?.form?.fields?.[0]?.type).toBe('shortText');
    });

    test('Deletes a question node', async () => {
        const dialogueWithQuestions = await prisma.dialogue.create({
            data: {
                title: 'dialogue',
                id: 'dialogueId',
                description: 'desc',
                slug: 'dialogueSlug',
                customer: {
                    create: {
                        name: 'customer',
                        slug: 'customerSlug',
                    },
                },
                questions: {
                    create: [
                        {
                            id: 'questionOneId',
                            title: 'questionOne'
                        },
                        {
                            id: 'questionTwoId',
                            title: 'questionTwo',
                        },
                    ],
                },
            },
            include: {
                questions: true,
            },
        });
        expect(dialogueWithQuestions?.questions).toHaveLength(2);
        await questionNodePrismaAdapter.delete('questionTwoId');

        const questions = await prisma.questionNode.findMany({
            where: {
                questionDialogueId: 'dialogueId',
            },
        });

        expect(questions).toHaveLength(1);
        expect(questions?.[0]?.title).toBe('questionOne');
    });

    test('Upserts a question option', async () => {
        const createOptionInput: Prisma.QuestionOptionCreateInput = {
            value: 'createOption',
            position: 0,
            publicValue: 'optionOne'
        }

        const updateOptionInput: Prisma.QuestionOptionUpdateInput = {
            value: 'updateOption',
            position: 1,
            publicValue: 'optionTwo',
        }
        const questionOption = await questionNodePrismaAdapter.upsertQuestionOption(-1, createOptionInput, updateOptionInput);
        expect(questionOption?.value).toBe(createOptionInput.value);
        expect(questionOption?.position).toBe(createOptionInput.position);
        expect(questionOption?.publicValue).toBe(createOptionInput.publicValue);

        const updatedQuestionOption = await questionNodePrismaAdapter.upsertQuestionOption(questionOption.id, createOptionInput, updateOptionInput);
        expect(updatedQuestionOption?.value).toBe(updateOptionInput.value);
        expect(updatedQuestionOption?.position).toBe(updateOptionInput.position);
        expect(updatedQuestionOption?.publicValue).toBe(updateOptionInput.publicValue);
    });

    test('Finds options by question Id', async () => {
        await prisma.questionNode.create({
            data: {
                title: 'questionOne',
                options: {
                    create: [
                        {
                            id: 1,
                            value: 'optionOne',
                        },
                        {
                            id: 2,
                            value: 'optionTwo',
                        }
                    ]
                }
            }
        });

        const targetQuestion = await prisma.questionNode.create({
            data: {
                title: 'questionTwo',
                options: {
                    create: [
                        {
                            id: 3,
                            value: 'optionThree',
                        },
                        {
                            id: 4,
                            value: 'optionFour',
                        },
                    ],
                },
            },
        });

        const options = await questionNodePrismaAdapter.findOptionsByQuestionId(targetQuestion.id);
        expect(options).toHaveLength(2);
        const optionThree = options.find((option) => option.id === 3);
        expect(optionThree).not.toBeNull();
        const optionFour = options.find((option) => option.id === 4);
        expect(optionFour).not.toBeNull();
    });

    test('Deletes question options based on Ids', async () => {
        const question = await prisma.questionNode.create({
            data: {
                title: 'questionOne',
                options: {
                    create: [
                        {
                            id: 1,
                            value: 'optionOne',
                        },
                        {
                            id: 2,
                            value: 'optionTwo',
                        },
                        {
                            id: 3,
                            value: 'optionThree'
                        }
                    ]
                }
            }
        });
        await questionNodePrismaAdapter.deleteQuestionOptions([1, 3]);

        const questionWithOneOption = await prisma.questionNode.findUnique({
            where: {
                id: question.id,
            },
            include: {
                options: true,
            },
        });

        expect(questionWithOneOption?.options).toHaveLength(1);
        expect(questionWithOneOption?.options?.[0]?.id).toBe(2);
    });

    test('Updates question options (upsert)', async () => {
        const inputOptions: QuestionOptionProps[] = [
            {
                value: 'optionOne',
                position: 0,
            },
            {
                value: 'optionTwo',
                position: 1,
            },
            {
                value: 'optionThree',
                position: 2,
            },
        ];

        const firstOptionsState = await questionNodePrismaAdapter.updateQuestionOptions(inputOptions);
        expect(firstOptionsState).toHaveLength(3);
        const mappedFirstOptionIds = firstOptionsState.map((option) => option.id);
        const optionsFirstState = await prisma.questionOption.findMany({
            where: {
                id: {
                    in: mappedFirstOptionIds,
                },
            },
        });
        const optionOne = optionsFirstState.find((option) => option.value === 'optionOne');
        const optionTwo = optionsFirstState.find((option) => option.value === 'optionTwo');
        const optionThree = optionsFirstState.find((option) => option.value === 'optionThree');

        const updatedInputOptions: QuestionOptionProps[] = [
            {
                id: optionOne?.id,
                value: 'optionOne',
                position: 0,
            },
            {
                id: optionThree?.id,
                value: 'optionThree',
                position: 1,
            },
            {
                value: 'optionFour',
                position: 2,
            }
        ]

        const secondOptionsState = await questionNodePrismaAdapter.updateQuestionOptions(updatedInputOptions);
        expect(secondOptionsState).toHaveLength(3);
        const mappedSecondOptionIds = firstOptionsState.map((option) => option.id);
        const optionsSecondtState = await prisma.questionOption.findMany({
            where: {
                id: {
                    in: mappedSecondOptionIds,
                },
            },
        });

        // Verify that no new entries were created for the two updated options
        const optionOneUpdated = optionsSecondtState.find((option) => option.value === 'optionOne');
        expect(optionOneUpdated).not.toBeNull();
        expect(optionOneUpdated?.id).toBe(optionOne?.id);

        const optionThreeUpdated = optionsSecondtState.find((option) => option.value === 'optionThree');
        expect(optionThreeUpdated).not.toBeNull();
        expect(optionThreeUpdated?.id).toBe(optionThree?.id);


        // Verify that a new entry was created for option #4
        const optionFour = optionsSecondtState.find((option) => option.value === 'optionFour');
        expect(optionFour?.id).not.toBe(optionTwo?.id);
    });

    test('Updates a dialogue builder node', async () => {
        // Create a 'typical' choice question node
        const choiceNode = await prisma.questionNode.create({
            data: {
                title: 'choiceNode',
                type: 'CHOICE',
                options: {
                    create: [
                        {
                            id: 1,
                            value: 'optionOne',
                            position: 0,
                        },
                        {
                            id: 2,
                            value: 'optionTwo',
                            position: 1,
                        },
                        {
                            id: 3,
                            value: 'optionThree',
                            position: 2,
                        },
                    ]
                }
            },
        });

        // Create CTA node
        const cta = await prisma.questionNode.create({
            data: {
                title: 'Please share this offer!',
                type: 'SHARE',
                share: {
                    create: {
                        title: 'shareNode',
                        url: 'shareUrl',
                    },
                },
            },
        })

        // Scenario #1: add CTA to node & question option
        const addCTAInput: UpdateQuestionInput = {
            title: 'choiceNode',
            type: 'CHOICE',
            overrideLeafId: cta.id,
            options: [
                {
                    id: 1,
                    value: 'optionOne',
                    position: 0,
                    overrideLeafId: cta.id,
                },
                {
                    id: 2,
                    value: 'optionTwo',
                    position: 1,
                },
                {
                    id: 3,
                    value: 'optionThree',
                    position: 2,
                },
            ]
        }

        const postCTAsAddedNode = await questionNodePrismaAdapter.updateDialogueBuilderNode(choiceNode.id, addCTAInput);
        expect(postCTAsAddedNode?.overrideLeafId).toBe(cta.id);

        const questionOptionWithCTA = postCTAsAddedNode?.options.find((option) => option.overrideLeafId);
        expect(questionOptionWithCTA).not.toBeUndefined();
        expect(questionOptionWithCTA?.overrideLeafId).toBe(cta.id);

        // Scenario #2: remove CTA from node
        const removeCTAInput: UpdateQuestionInput = {
            title: 'choiceNode',
            type: 'CHOICE',
            currentOverrideLeafId: cta.id,
            overrideLeafId: undefined,
            options: [
                {
                    id: 1,
                    value: 'optionOne',
                    position: 0,
                    overrideLeafId: cta.id,
                },
                {
                    id: 2,
                    value: 'optionTwo',
                    position: 1,
                },
                {
                    id: 3,
                    value: 'optionThree',
                    position: 2,
                },
            ],
        };

        const postCTAsRemovedNode = await questionNodePrismaAdapter.updateDialogueBuilderNode(choiceNode.id, removeCTAInput);

        expect(postCTAsRemovedNode?.overrideLeafId).toBeNull();

        // Switch to different type (= Video node)
        const videoNode = await prisma.questionNode.update({
            data: {
                type: 'VIDEO_EMBEDDED',
                videoEmbeddedNode: {
                    create: {
                        videoUrl: 'https://video-url.here',
                    }
                }
            },
            where: {
                id: choiceNode.id,
            },
        });

        expect(videoNode?.videoEmbeddedNodeId).not.toBeNull();

        // Scenario #4: Switch back to choice node and remove video node
        const changeChoiceTypeInput: UpdateQuestionInput = {
            title: 'choiceNode',
            type: 'CHOICE',
            videoEmbeddedNode: {
                id: videoNode?.videoEmbeddedNodeId || 'id',
            },
            options: [
                {
                    id: 1,
                    value: 'optionOne',
                    position: 0,
                    overrideLeafId: cta.id,
                },
                {
                    id: 2,
                    value: 'optionTwo',
                    position: 1,
                },
                {
                    id: 3,
                    value: 'optionThree',
                    position: 2,
                },
            ],
        };
        const postChanceChoiceTypeNode = await questionNodePrismaAdapter.updateDialogueBuilderNode(videoNode.id, changeChoiceTypeInput);
        expect(postChanceChoiceTypeNode?.title).toBe('choiceNode');
        expect(postChanceChoiceTypeNode?.type).toBe('CHOICE');
        expect(postChanceChoiceTypeNode?.videoEmbeddedNode).toBeNull();
    });

    test('Finds question node (and its relations) by its ID for updating through dialogue builder', async () => {
        const node = await prisma.questionNode.create({
            data: {
                title: 'questionTitle',
                type: 'GENERIC',
                overrideLeaf: {
                    create: {
                        title: 'overrideLeaf',
                        type: 'SHARE',
                        share: {
                            create: {
                                title: 'shareTitle',
                                url: 'shareUrl',
                            }
                        }
                    }
                },
                videoEmbeddedNode: {
                    create: {
                        videoUrl: 'videoUrlHere',
                    },
                },
                options: {
                    create: [
                        {
                            id: 1,
                            value: 'optionOne',
                        },
                        {
                            id: 2,
                            value: 'optionTwo',
                        },
                        {
                            id: 3,
                            value: 'optionThree'
                        }
                    ]
                },
                questionDialogue: {
                    create: {
                        title: 'dialogueTitle',
                        slug: 'dialogueSlug',
                        description: 'desc',
                        customer: {
                            create: {
                                slug: 'customerSlug',
                                name: 'customerName',
                            }
                        }
                    },
                }
            }
        })
        const dialogueNode = await questionNodePrismaAdapter.getDialogueBuilderNode(node.id);
        expect(dialogueNode?.videoEmbeddedNode).not.toBeNull();
        expect(dialogueNode?.options).toHaveLength(3);
        expect(dialogueNode?.overrideLeaf).not.toBeNull();
        expect(dialogueNode?.questionDialogue).not.toBeNull();
    });

    test('Creates a question', async () => {
        const dialogue = await prisma.dialogue.create({
            data: {
                description: '',
                slug: 'dialogueSlug',
                title: 'dialogue',
                customer: {
                    create: {
                        slug: 'customerSlug',
                        name: 'customer',
                    }
                }
            }
        });

        const cta = await prisma.questionNode.create(
            {
                data: {
                    title: 'ctaNode',
                    type: 'SHARE',
                    share: {
                        create: {
                            title: 'shareTitle',
                            url: 'shareUrl',
                        }
                    }
                }
            }
        )

        const createQuestionInput: CreateQuestionInput = {
            title: 'questionTitle',
            type: 'SLIDER',
            dialogueId: dialogue.id,
            form: {
                fields: [
                    {
                        isRequired: true,
                        placeholder: 'placeholder',
                        label: 'fieldLabelOne',
                        position: 0,
                        type: 'shortText',
                    },
                ],
            },
            isLeaf: true,
            isRoot: true,
            links: [
                {
                    backgroundColor: 'backgroundColor',
                    iconUrl: 'iconUrl',
                    title: 'linkTitleOne',
                    type: 'SOCIAL',
                    url: 'linkUrl',
                },
            ],
            options: [
                {
                    position: 0,
                    value: 'optionOne',
                    overrideLeafId: cta.id,
                    publicValue: 'publicValue',
                },
            ],
            overrideLeafId: cta.id,
            sliderNode: {
                markers: [
                    {
                        label: 'markerLabel',
                        subLabel: 'markerSubLabel',
                        range: {
                            start: 0,
                            end: 100,
                        },
                    }
                ],
            },
            videoEmbeddedNode: {
                videoUrl: 'videoUrl'
            },
        };

        const question = await questionNodePrismaAdapter.createQuestion(createQuestionInput);

        const createdQuestion = await prisma.questionNode.findUnique({
            where: {
                id: question.id,
            },
            include: {
                options: true,
                sliderNode: {
                    include: {
                        markers: {
                            include: {
                                range: true,
                            }
                        },
                    }
                },
                videoEmbeddedNode: true,
                links: true,
                form: {
                    include: {
                        fields: true,
                    },
                },
                overrideLeaf: true,
            }
        });

        expect(createdQuestion?.overrideLeaf?.id).toBe(createQuestionInput?.overrideLeafId);
        expect(createdQuestion?.isLeaf).toBe(createQuestionInput?.isLeaf);
        expect(createdQuestion?.isRoot).toBe(createQuestionInput?.isRoot);
        expect(createdQuestion?.type).toBe(createQuestionInput?.type);
        expect(createdQuestion?.title).toBe(createQuestionInput?.title);

        // Links
        expect(createdQuestion?.links).toHaveLength(1);
        expect(createdQuestion?.links?.[0]?.backgroundColor).toBe(createQuestionInput?.links?.[0].backgroundColor);
        expect(createdQuestion?.links?.[0]?.iconUrl).toBe(createQuestionInput?.links?.[0].iconUrl);
        expect(createdQuestion?.links?.[0]?.title).toBe(createQuestionInput?.links?.[0].title);
        expect(createdQuestion?.links?.[0]?.type).toBe(createQuestionInput?.links?.[0].type);
        expect(createdQuestion?.links?.[0]?.url).toBe(createQuestionInput?.links?.[0].url);

        // Options
        expect(createdQuestion?.options).toHaveLength(1);
        expect(createdQuestion?.options?.[0]?.overrideLeafId).toBe(createQuestionInput?.options?.[0].overrideLeafId);
        expect(createdQuestion?.options?.[0]?.position).toBe(createQuestionInput?.options?.[0]?.position);
        expect(createdQuestion?.options?.[0]?.publicValue).toBe(createQuestionInput?.options?.[0]?.publicValue);
        expect(createdQuestion?.options?.[0]?.value).toBe(createQuestionInput?.options?.[0]?.value);

        // SliderNode
        expect(createdQuestion?.sliderNode).not.toBeNull();
        expect(createdQuestion?.sliderNode?.markers).toHaveLength(1);
        expect(createdQuestion?.sliderNode?.markers?.[0]?.label).toBe(createQuestionInput?.sliderNode?.markers?.[0]?.label);
        expect(createdQuestion?.sliderNode?.markers?.[0]?.subLabel).toBe(createQuestionInput?.sliderNode?.markers?.[0]?.subLabel);
        expect(createdQuestion?.sliderNode?.markers?.[0]?.range?.start).toBe(createQuestionInput?.sliderNode?.markers?.[0]?.range.start);
        expect(createdQuestion?.sliderNode?.markers?.[0]?.range?.end).toBe(createQuestionInput?.sliderNode?.markers?.[0]?.range.end);

        // VideoNode
        expect(createdQuestion?.videoEmbeddedNode).not.toBeNull();
        expect(createdQuestion?.videoEmbeddedNode?.videoUrl).toBe(createQuestionInput?.videoEmbeddedNode?.videoUrl);

        // Form
        expect(createdQuestion?.form).not.toBeNull();
        expect(createdQuestion?.form?.fields).toHaveLength(1);
        expect(createdQuestion?.form?.fields?.[0]?.isRequired).toBe(createQuestionInput?.form?.fields?.[0].isRequired);
        expect(createdQuestion?.form?.fields?.[0]?.label).toBe(createQuestionInput?.form?.fields?.[0].label);
        expect(createdQuestion?.form?.fields?.[0]?.placeholder).toBe(createQuestionInput?.form?.fields?.[0].placeholder);
        expect(createdQuestion?.form?.fields?.[0]?.position).toBe(createQuestionInput?.form?.fields?.[0].position);
        expect(createdQuestion?.form?.fields?.[0]?.type).toBe(createQuestionInput?.form?.fields?.[0].type);
    });

    test('Finds a "CTA" node', async () => {
        const dialogue = await prisma.dialogue.create({
            data: {
                description: '',
                slug: 'dialogueSlug',
                title: 'dialogue',
                customer: {
                    create: {
                        slug: 'customerSlug',
                        name: 'customer',
                    }
                }
            }
        });

        const createQuestionInput: CreateQuestionInput = {
            title: 'ctaQuestionTitle',
            type: 'GENERIC',
            dialogueId: dialogue.id,
            isLeaf: true,
            form: {
                fields: [
                    {
                        isRequired: true,
                        placeholder: 'placeholder',
                        label: 'fieldLabelOne',
                        position: 0,
                        type: 'shortText',
                    },
                ],
            },
            links: [
                {
                    backgroundColor: 'backgroundColor',
                    iconUrl: 'iconUrl',
                    title: 'linkTitleOne',
                    type: 'SOCIAL',
                    url: 'linkUrl',
                },
            ],
        };

        const question = await prisma.questionNode.create({
            data: {
                title: createQuestionInput.title,
                type: 'GENERIC',
                links: {
                    create: createQuestionInput.links,
                },
                form: {
                    create: {
                        fields: {
                            create: createQuestionInput?.form?.fields,
                        },
                    },
                },
                share: {
                    create: {
                        title: 'shareTitle',
                        url: 'shareUrl',
                    },
                },
                questionDialogue: {
                    connect: {
                        id: dialogue.id
                    },
                },
            }
        })

        const ctaQuestion = await questionNodePrismaAdapter.getCTANode(question.id);

        // Share
        expect(ctaQuestion?.share).not.toBeNull();
        expect(ctaQuestion?.links).toHaveLength(1);
        expect(ctaQuestion?.form?.fields).toHaveLength(1);
    });

    test('Finds parent question node by Link id', async () => {
        const link = await prisma.link.create({
            data: {
                type: 'FACEBOOK',
                url: 'url',
                questionNode: {
                    create: {
                        title: 'linkParentQuestion'
                    },
                },
            },
        });

        const notFoundParent = await questionNodePrismaAdapter.findNodeByLinkId('-1');
        expect(notFoundParent).toBeNull();

        const foundParent = await questionNodePrismaAdapter.findNodeByLinkId(link.id);
        expect(foundParent).not.toBeNull();
        expect(foundParent?.title).toBe('linkParentQuestion');
    });

    test('Connects edge to question', async () => {
        const dialogue = await prisma.dialogue.create({
            data: {
                description: '',
                slug: 'dialogueSlug',
                title: 'dialogue',
                customer: {
                    create: {
                        slug: 'customerSlug',
                        name: 'customer',
                    },
                },
                questions: {
                    create: [
                        {
                            id: 'parentQuestionId',
                            title: 'parent',
                        },
                        {
                            id: 'childQuestionId',
                            title: 'child',
                        }
                    ]
                }
            },

        });

        const edge = await edgePrismaAdapter.createEdge({
            childNodeId: 'childQuestionId',
            conditions: [
                {
                    conditionType: 'TEXT_MATCH',
                    matchValue: 'oi',
                    renderMax: 0,
                    renderMin: 0,
                },
            ],
            dialogueId: dialogue.id,
            parentNodeId: 'parentQuestionId',
        });

        await questionNodePrismaAdapter.connectEdgeToQuestion('parentQuestionId', edge.id);

        const questionWithEdge = await prisma.questionNode.findUnique({
            where: {
                id: 'parentQuestionId',
            },
            include: {
                children: {
                    include: {
                        conditions: true,
                    }
                },
            },
        });

        expect(questionWithEdge?.children).toHaveLength(1);
        expect(questionWithEdge?.children?.[0]?.parentNodeId).toBe('parentQuestionId');
    });

    test('Removes form fields from form node', async () => {
        const nodeOne = await prisma.questionNode.create({
            data: {
                title: 'questionOne',
            }
        })
        await questionNodePrismaAdapter.createFieldsOfForm({
            questionId: nodeOne.id,
            fields: {
                fields: {
                    create: [
                        {
                            id: 'firstNameId',
                            isRequired: false,
                            label: 'First name',
                            type: 'shortText',
                            position: 1,
                        },
                        {
                            id: 'lastNameId',
                            isRequired: false,
                            label: 'Last name',
                            type: 'shortText',
                            position: 2,
                        },
                        {
                            id: 'emailId',
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
        await questionNodePrismaAdapter.removeFormFields(
            nodeOne.id, [
            { id: 'firstNameId' },
            { id: 'emailId' }
        ]
        );

        const questionWithoutDeletedNodes = await prisma.questionNode.findUnique({
            where: {
                id: nodeOne.id,
            },
            include: {
                form: {
                    include: {
                        fields: true,
                    },
                },
            },
        });

        expect(questionWithoutDeletedNodes?.form?.fields).toHaveLength(1);
        expect(questionWithoutDeletedNodes?.form?.fields?.[0]?.id).toBe('lastNameId');
    });

    test('Finds questions by question IDs', async () => {
        const ctaOne = await questionNodePrismaAdapter.createQuestion({
            title: 'ctaOne',
            type: 'LINK',
            links: [
                {
                    backgroundColor: '',
                    iconUrl: '',
                    title: '',
                    type: 'FACEBOOK',
                    url: '',
                }
            ]
        })

        const nodeOne = await questionNodePrismaAdapter.createQuestion({
            title: 'q1',
            type: 'VIDEO_EMBEDDED',
            overrideLeafId: ctaOne.id,
            options: [
                {
                    position: 0,
                    value: 'valueOne',
                },
            ],
            videoEmbeddedNode: {
                videoUrl: 'videoUrl',
            }
        });

        await questionNodePrismaAdapter.createQuestion({
            title: 'q2',
            type: 'SLIDER',
            overrideLeafId: ctaOne.id,
        });

        const nodes = await questionNodePrismaAdapter.getNodesByNodeIds([ctaOne.id, nodeOne.id]);

        expect(nodes).toHaveLength(2);
        const targetCTA = nodes.find((node) => node.title === ctaOne.title);
        expect(targetCTA?.isOverrideLeafOf).toHaveLength(2);
        const targetQuestion = nodes.find((node) => node.title === nodeOne.title);
        expect(targetQuestion?.options).toHaveLength(1);
        expect(targetQuestion?.videoEmbeddedNode?.videoUrl).toBe('videoUrl')
    });

    test('Finds node by ID', async () => {
        const ctaOne = await questionNodePrismaAdapter.createQuestion({
            title: 'ctaOne',
            type: 'LINK',
            links: [
                {
                    backgroundColor: '',
                    iconUrl: '',
                    title: '',
                    type: 'FACEBOOK',
                    url: '',
                }
            ]
        })

        const nodeOne = await questionNodePrismaAdapter.createQuestion({
            title: 'q1',
            type: 'VIDEO_EMBEDDED',
            overrideLeafId: ctaOne.id,
            options: [
                {
                    position: 0,
                    value: 'valueOne',
                },
            ],
            videoEmbeddedNode: {
                videoUrl: 'videoUrl',
            }
        });
        const targetCTA = await questionNodePrismaAdapter.findNodeById(ctaOne.id);
        expect(targetCTA?.isOverrideLeafOf).toHaveLength(1);

        const targetQuestion = await questionNodePrismaAdapter.findNodeById(nodeOne.id);
        expect(targetQuestion?.options).toHaveLength(1);
        expect(targetQuestion?.videoEmbeddedNode?.videoUrl).toBe('videoUrl')
    });

    test('', async () => {
        const ctaOne = await questionNodePrismaAdapter.createQuestion({
            title: 'ctaOne',
            type: 'LINK',
            links: [
                {
                    backgroundColor: '',
                    iconUrl: '',
                    title: '',
                    type: 'FACEBOOK',
                    url: '',
                }
            ]
        })

        const nodeOne = await questionNodePrismaAdapter.createQuestion({
            title: 'q1',
            type: 'VIDEO_EMBEDDED',
            overrideLeafId: ctaOne.id,
            options: [
                {
                    position: 0,
                    value: 'valueOne',
                },
            ],
            videoEmbeddedNode: {
                videoUrl: 'videoUrl',
            }
        });

        const nodeTwo = await questionNodePrismaAdapter.createQuestion({
            title: 'q2',
            type: 'SLIDER',
            overrideLeafId: ctaOne.id,
        });

        await questionNodePrismaAdapter.deleteMany([ctaOne?.id, nodeOne?.id]);
        const nodes = await questionNodePrismaAdapter.getNodesByNodeIds([ctaOne?.id, nodeOne?.id, nodeTwo?.id]);
        expect(nodes).toHaveLength(1);
    });
});