import { Prisma } from "@prisma/client";
import cuid from "cuid";
import { makeTestPrisma } from "../../../test/utils/makeTestPrisma";
import DialoguePrismaAdapter from "../../questionnaire/DialoguePrismaAdapter";
import EdgePrismaAdapter from "../EdgePrismaAdapter";
import { clearDatabase } from './testUtils';

const prisma = makeTestPrisma();
const edgePrismaAdapter = new EdgePrismaAdapter(prisma);
const dialoguePrismaAdapter = new DialoguePrismaAdapter(prisma);

const defaultDialogueCreateInput: Prisma.DialogueCreateInput = {
    title: 'DEFAULT_DIALOGUE',
    slug: 'default',
    description: 'description',
    customer: {
        create: {
            name: 'DEFAULT_CUSTOMER',
            slug: 'customerSlug',
        }
    }
}


describe('EdgePrismaAdapter', () => {
    afterEach(async () => {
        await clearDatabase(prisma);
        prisma.$disconnect();
    });

    test('Deletes edges by edge IDs', async () => {
        const dialogue = await prisma.dialogue.create({
            data: {
                title: 'dialogue',
                slug: 'slug',
                description: 'desc',
                customer: {
                    create: {
                        name: 'customerName',
                        slug: 'customerSlug',
                    }
                }
            }
        })

        const parentQuestionOne = await prisma.questionNode.create({
            data: {
                title: 'parentQuestionOne',
                questionDialogue: {
                    connect: {
                        id: dialogue.id,
                    },
                },
            },
        });

        const childQuestionOne = await prisma.questionNode.create({
            data: {
                title: 'childQuestionOne',
                questionDialogue: {
                    connect: {
                        id: dialogue.id,
                    },
                },
            },
        });

        const childQuestionTwo = await prisma.questionNode.create({
            data: {
                title: 'childQuestionTwo',
                questionDialogue: {
                    connect: {
                        id: dialogue.id,
                    },
                },
            },
        });

        const childQuestionThree = await prisma.questionNode.create({
            data: {
                title: 'childQuestionTwo',
                questionDialogue: {
                    connect: {
                        id: dialogue.id,
                    },
                },
            },
        });

        const edgeOne = await edgePrismaAdapter.createEdge({
            parentNodeId: parentQuestionOne.id,
            childNodeId: childQuestionOne.id,
            dialogueId: dialogue.id,
            conditions: [
                {
                    conditionType: 'match',
                    matchValue: 'edgeOneMatch',
                    renderMax: null,
                    renderMin: null,
                }
            ],
        });

        const edgeTwo = await edgePrismaAdapter.createEdge({
            parentNodeId: parentQuestionOne.id,
            childNodeId: childQuestionTwo.id,
            dialogueId: dialogue.id,
            conditions: [
                {
                    conditionType: 'match',
                    matchValue: 'edgeTwoMatch',
                    renderMax: null,
                    renderMin: null,
                }
            ],
        });

        const edgeThree = await edgePrismaAdapter.createEdge({
            parentNodeId: parentQuestionOne.id,
            childNodeId: childQuestionThree.id,
            dialogueId: dialogue.id,
            conditions: [
                {
                    conditionType: 'valueBoundary',
                    matchValue: 'edgeThreeValueBoundary',
                    renderMax: 69,
                    renderMin: 96,
                }
            ],
        });

        await edgePrismaAdapter.deleteMany([edgeOne.id, edgeTwo.id]);
        const targetEdge = await edgePrismaAdapter.getEdgeById(edgeThree.id);
        expect(targetEdge).not.toBeNull();
        const totalEdges = await prisma.edge.findMany();
        expect(totalEdges).toHaveLength(1);
    });

    test('Finds conditions by edge ID', async () => {
        const dialogue = await prisma.dialogue.create({
            data: {
                title: 'dialogue',
                slug: 'slug',
                description: 'desc',
                customer: {
                    create: {
                        name: 'customerName',
                        slug: 'customerSlug',
                    }
                }
            }
        })

        const parentQuestionOne = await prisma.questionNode.create({
            data: {
                title: 'parentQuestionOne',
                questionDialogue: {
                    connect: {
                        id: dialogue.id,
                    },
                },
            },
        });

        const childQuestionOne = await prisma.questionNode.create({
            data: {
                title: 'childQuestionOne',
                questionDialogue: {
                    connect: {
                        id: dialogue.id,
                    },
                },
            },
        });

        const childQuestionTwo = await prisma.questionNode.create({
            data: {
                title: 'childQuestionTwo',
                questionDialogue: {
                    connect: {
                        id: dialogue.id,
                    },
                },
            },
        });

        await edgePrismaAdapter.createEdge({
            parentNodeId: parentQuestionOne.id,
            childNodeId: childQuestionOne.id,
            dialogueId: dialogue.id,
            conditions: [
                {
                    conditionType: 'match',
                    matchValue: 'edgeOneMatch',
                    renderMax: null,
                    renderMin: null,
                }
            ],
        });

        const edgeTwo = await edgePrismaAdapter.createEdge({
            parentNodeId: parentQuestionOne.id,
            childNodeId: childQuestionTwo.id,
            dialogueId: dialogue.id,
            conditions: [
                {
                    conditionType: 'match',
                    matchValue: 'edgeTwoMatch',
                    renderMax: null,
                    renderMin: null,
                }
            ],
        });

        const targetConditions = await edgePrismaAdapter.getConditionsById(edgeTwo.id);
        expect(targetConditions).toHaveLength(1);
        expect(targetConditions?.[0]?.conditionType).toBe('match');
    });

    test('Deletes conditions based on edge IDs', async () => {
        const dialogue = await prisma.dialogue.create({
            data: {
                title: 'dialogue',
                slug: 'slug',
                description: 'desc',
                customer: {
                    create: {
                        name: 'customerName',
                        slug: 'customerSlug',
                    }
                }
            }
        })

        const parentQuestionOne = await prisma.questionNode.create({
            data: {
                title: 'parentQuestionOne',
                questionDialogue: {
                    connect: {
                        id: dialogue.id,
                    },
                },
            },
        });

        const childQuestionOne = await prisma.questionNode.create({
            data: {
                title: 'childQuestionOne',
                questionDialogue: {
                    connect: {
                        id: dialogue.id,
                    },
                },
            },
        });

        const childQuestionTwo = await prisma.questionNode.create({
            data: {
                title: 'childQuestionTwo',
                questionDialogue: {
                    connect: {
                        id: dialogue.id,
                    },
                },
            },
        });

        const childQuestionThree = await prisma.questionNode.create({
            data: {
                title: 'childQuestionThree',
                questionDialogue: {
                    connect: {
                        id: dialogue.id,
                    },
                },
            },
        });

        const edgeOne = await edgePrismaAdapter.createEdge({
            parentNodeId: parentQuestionOne.id,
            childNodeId: childQuestionOne.id,
            dialogueId: dialogue.id,
            conditions: [
                {
                    conditionType: 'match',
                    matchValue: 'edgeOneMatch',
                    renderMax: null,
                    renderMin: null,
                }
            ],
        });

        const edgeTwo = await edgePrismaAdapter.createEdge({
            parentNodeId: parentQuestionOne.id,
            childNodeId: childQuestionTwo.id,
            dialogueId: dialogue.id,
            conditions: [
                {
                    conditionType: 'match',
                    matchValue: 'edgeTwoMatch',
                    renderMax: null,
                    renderMin: null,
                }
            ],
        });

        const edgeThree = await edgePrismaAdapter.createEdge({
            parentNodeId: parentQuestionOne.id,
            childNodeId: childQuestionThree.id,
            dialogueId: dialogue.id,
            conditions: [
                {
                    conditionType: 'valueBoundary',
                    matchValue: 'edgeThreeValueBoundary',
                    renderMax: 69,
                    renderMin: 96,
                }
            ],
        });

        const totalConditions = await prisma.questionCondition.count();
        expect(totalConditions).toBe(3);

        await edgePrismaAdapter.deleteConditionsByEdgeIds([edgeOne.id, edgeTwo.id]);
        const newTotalConditions = await prisma.questionCondition.count();
        expect(newTotalConditions).toBe(1);

        const targetEdgeCondition = await edgePrismaAdapter.getEdgeById(edgeThree.id);
        expect(targetEdgeCondition?.conditions?.[0]?.conditionType).toBe('valueBoundary');
    });

    test('Updates an edge condition', async () => {
        const createEdgeCondition: Prisma.QuestionConditionCreateInput = {
            conditionType: 'valueBoundary',
            renderMin: 10,
            renderMax: 90,
            matchValue: null,
        };

        const updateEdgeConditionInput: Prisma.QuestionConditionUpdateInput = {
            conditionType: 'valueBoundary',
            renderMin: null,
            renderMax: null,
            matchValue: 'haas',
        }

        const createdCondition = await prisma.questionCondition.create({
            data: createEdgeCondition,
        });

        const updatedCondition = await edgePrismaAdapter.updateCondition(createdCondition.id, updateEdgeConditionInput);
        expect(updatedCondition?.conditionType).toBe(updateEdgeConditionInput?.conditionType);
        expect(updatedCondition?.matchValue).toBe(updateEdgeConditionInput?.matchValue);
        expect(updatedCondition?.renderMin).toBeNull();
        expect(updatedCondition?.renderMin).toBeNull();
    });

    test('Upserts an edge condition', async () => {
        const dialogue = await prisma.dialogue.create({
            data: {
                title: 'dialogue',
                slug: 'slug',
                description: 'desc',
                customer: {
                    create: {
                        name: 'customerName',
                        slug: 'customerSlug',
                    }
                }
            }
        })

        const parentQuestionOne = await prisma.questionNode.create({
            data: {
                title: 'parentQuestionOne',
                questionDialogue: {
                    connect: {
                        id: dialogue.id,
                    },
                },
            },
        });

        const childQuestionOne = await prisma.questionNode.create({
            data: {
                title: 'childQuestionOne',
                questionDialogue: {
                    connect: {
                        id: dialogue.id,
                    },
                },
            },
        });

        const edge = await edgePrismaAdapter.createEdge({
            parentNodeId: parentQuestionOne.id,
            childNodeId: childQuestionOne.id,
            dialogueId: dialogue.id,
            conditions: [],
        });

        const createEdgeCondition: Prisma.QuestionConditionCreateInput = {
            conditionType: 'valueBoundary',
            renderMin: 10,
            renderMax: 90,
            matchValue: null,
            Edge: {
                connect: {
                    id: edge.id,
                },
            },
        };

        const updateEdgeCondition: Prisma.QuestionConditionUpdateInput = {
            conditionType: 'valueBoundary',
            renderMin: null,
            renderMax: null,
            matchValue: 'haas',
        }

        const firstUpsertCondition = await edgePrismaAdapter.upsertCondition(-1, createEdgeCondition, updateEdgeCondition);
        // Expect the condition be created
        expect(firstUpsertCondition?.conditionType).toBe(createEdgeCondition?.conditionType);
        expect(firstUpsertCondition?.edgeId).toBe(edge?.id);
        expect(firstUpsertCondition?.matchValue).toBeNull();
        expect(firstUpsertCondition?.renderMax).toBe(createEdgeCondition?.renderMax);
        expect(firstUpsertCondition?.renderMin).toBe(createEdgeCondition?.renderMin);

        await edgePrismaAdapter.upsertCondition(firstUpsertCondition?.id, createEdgeCondition, updateEdgeCondition);

        // Expect the condition to be updated
        const targetEdge = await edgePrismaAdapter.getEdgeById(edge?.id);
        expect(targetEdge?.conditions).toHaveLength(1);
        expect(targetEdge?.conditions[0]?.conditionType).toBe(updateEdgeCondition?.conditionType);
        expect(targetEdge?.conditions[0]?.renderMin).toBeNull();
        expect(targetEdge?.conditions[0]?.renderMax).toBeNull();
        expect(targetEdge?.conditions[0]?.matchValue).toBe(updateEdgeCondition?.matchValue);
    });

    test('Finds edge by edge ID', async () => {
        const dialogue = await prisma.dialogue.create({
            data: {
                title: 'dialogue',
                slug: 'slug',
                description: 'desc',
                customer: {
                    create: {
                        name: 'customerName',
                        slug: 'customerSlug',
                    }
                }
            }
        })

        const parentQuestionOne = await prisma.questionNode.create({
            data: {
                title: 'parentQuestionOne',
                questionDialogue: {
                    connect: {
                        id: dialogue.id,
                    },
                },
            },
        });

        const childQuestionOne = await prisma.questionNode.create({
            data: {
                title: 'childQuestionOne',
                questionDialogue: {
                    connect: {
                        id: dialogue.id,
                    },
                },
            },
        });

        const childQuestionTwo = await prisma.questionNode.create({
            data: {
                title: 'childQuestionTwo',
                questionDialogue: {
                    connect: {
                        id: dialogue.id,
                    },
                },
            },
        });

        const edgeOneCuid = cuid();
        await edgePrismaAdapter.createEdge({
            id: edgeOneCuid,
            parentNodeId: parentQuestionOne.id,
            childNodeId: childQuestionTwo.id,
            dialogueId: dialogue.id,
            conditions: [{
                conditionType: 'match',
                matchValue: 'haas',
                renderMax: null,
                renderMin: null,
            }]
        })

        await edgePrismaAdapter.createEdge({
            parentNodeId: parentQuestionOne.id,
            childNodeId: childQuestionOne.id,
            dialogueId: dialogue.id,
            conditions: [{
                conditionType: 'valueBoundary',
                renderMin: 10,
                renderMax: 90,
                matchValue: null,
            }],
        });

        const targetEdge = await edgePrismaAdapter.getEdgeById(edgeOneCuid);
        expect(targetEdge).not.toBeNull();
        expect(targetEdge?.parentNodeId).toBe(parentQuestionOne.id);
        expect(targetEdge?.childNodeId).toBe(childQuestionTwo.id);
        expect(targetEdge?.dialogueId).toBe(dialogue.id);
    });

    test('Create an edge based on existing question nodes', async () => {
        const dialogue = await prisma.dialogue.create({
            data: {
                title: 'dialogue',
                slug: 'slug',
                description: 'desc',
                customer: {
                    create: {
                        name: 'customerName',
                        slug: 'customerSlug',
                    }
                }
            }
        })
        const parentQuestionOne = await prisma.questionNode.create({
            data: {
                title: 'parentQuestionOne',
                questionDialogue: {
                    connect: {
                        id: dialogue.id,
                    },
                },
            },
        });

        const childQuestionOne = await prisma.questionNode.create({
            data: {
                title: 'childQuestionOne',
                questionDialogue: {
                    connect: {
                        id: dialogue.id,
                    },
                },
            },
        });

        const childQuestionTwo = await prisma.questionNode.create({
            data: {
                title: 'childQuestionTwo',
                questionDialogue: {
                    connect: {
                        id: dialogue.id,
                    },
                },
            },
        });

        await edgePrismaAdapter.createEdge({
            parentNodeId: parentQuestionOne.id,
            childNodeId: childQuestionTwo.id,
            dialogueId: dialogue.id,
            conditions: [{
                conditionType: 'match',
                matchValue: 'haas',
                renderMax: null,
                renderMin: null,
            }]
        })

        const targetEdge = await edgePrismaAdapter.createEdge({
            parentNodeId: parentQuestionOne.id,
            childNodeId: childQuestionOne.id,
            dialogueId: dialogue.id,
            conditions: [{
                conditionType: 'valueBoundary',
                renderMin: 10,
                renderMax: 90,
                matchValue: null,
            }],
        });

        // Edge is created and connected to right parent/child questions
        expect(targetEdge.parentNodeId).toBe(parentQuestionOne.id);
        expect(targetEdge.childNodeId).toBe(childQuestionOne.id);
        expect(targetEdge.dialogueId).toBe(dialogue.id);

        const edge = await prisma.edge.findUnique({
            where: {
                id: targetEdge.id,
            },
            include: {
                conditions: true,
            },
        });

        expect(edge?.conditions).toHaveLength(1);
        expect(edge?.conditions[0].conditionType).toBe('valueBoundary');
        expect(edge?.conditions[0].matchValue).toBeNull();
        expect(edge?.conditions[0].renderMin).toBe(10);
        expect(edge?.conditions[0].renderMax).toBe(90);
    });

    test('Finds all edges by parent question ID', async () => {
        const parentQuestionOne = await prisma.questionNode.create({
            data: {
                title: 'parentQuestionOne'
            },
        });
        const childQuestionOne = await prisma.questionNode.create({
            data: {
                title: 'childQuestionOne'
            },
        });

        await prisma.edge.create({
            data: {
                parentNode: {
                    connect: {
                        id: parentQuestionOne.id
                    },
                },
                childNode: {
                    connect: {
                        id: childQuestionOne.id,
                    }
                },
                conditions: {
                    create: {
                        conditionType: 'MATCH_TEXT',
                        matchValue: 'HAAS',
                    },
                },
            },
        });

        // No edge found
        const noEdge = await edgePrismaAdapter.getEdgesByParentQuestionId(childQuestionOne.id);
        expect(noEdge).toHaveLength(0);

        const edgeFound = await edgePrismaAdapter.getEdgesByParentQuestionId(parentQuestionOne.id);
        expect(edgeFound).toHaveLength(1);
    })

    test('Finds all edges by dialogue ID', async () => {
        const defaultDialogueId = cuid();
        const dialogueCreateInputWithEdgesAndQuestions: Prisma.DialogueCreateInput = {
            ...defaultDialogueCreateInput,
            id: defaultDialogueId,
            questions: {
                create: {
                    title: 'firstQuestion',
                }
            },
            edges: {
                create: {
                    parentNode: {
                        create: {
                            title: 'parentQuestion',
                            type: 'SLIDER',
                            questionDialogue: {
                                connect: {
                                    id: defaultDialogueId,
                                }
                            }
                        }
                    },
                    childNode: {
                        create: {
                            title: 'childQUestion',
                            type: 'CHOICE',
                            questionDialogue: {
                                connect: {
                                    id: defaultDialogueId,
                                }
                            }
                        }
                    },
                }
            }
        };

        await dialoguePrismaAdapter.create({ data: dialogueCreateInputWithEdgesAndQuestions });

        const edgesTestDialogueId = cuid();
        const edgesTestDialogueInput: Prisma.DialogueCreateInput = {
            id: edgesTestDialogueId,
            title: 'DEFAULT_DIALOGUE',
            slug: 'edgesTest',
            description: 'description',
            customer: {
                create: {
                    name: 'EDGES_CUSTOMER',
                    slug: 'customerEdgesSlug',
                }
            },
            edges: {
                create: [
                    {
                        parentNode: {
                            create: {
                                title: 'parentNodeOne',
                                questionDialogue: {
                                    connect: {
                                        id: edgesTestDialogueId,
                                    },
                                }
                            }
                        },
                        childNode: {
                            create: {
                                title: 'childNodeOne',
                                questionDialogue: {
                                    connect: {
                                        id: edgesTestDialogueId,
                                    },
                                }
                            }
                        }
                    },
                    {
                        parentNode: {
                            create: {
                                title: 'parentNodeTwo',
                                questionDialogue: {
                                    connect: {
                                        id: edgesTestDialogueId,
                                    },
                                }
                            },
                        },
                        childNode: {
                            create: {
                                title: 'childNodeTwo',
                                questionDialogue: {
                                    connect: {
                                        id: edgesTestDialogueId,
                                    },
                                }
                            }
                        }
                    }
                ]
            }
        }

        const dialogueWithEdges = await dialoguePrismaAdapter.create({ data: edgesTestDialogueInput });
        const foundEdges = await edgePrismaAdapter.getEdgesByDialogueId(dialogueWithEdges.id);
        expect(foundEdges).toHaveLength(2);
    });
});