import { prisma } from '../../src/generated/prisma-client/index';

import seedCompany from './make-company';

const CUSTOMER = 'Starbucks';

const makeStarbucks = async () => {
  const customer = await prisma.createCustomer({
    name: CUSTOMER,
    settings: {
      create: {
        logoUrl: 'https://www.stickpng.com/assets/images/58428cc1a6515b1e0ad75ab1.png',
        colourSettings: {
          create: {
            primary: '#007143',
          },
        },
      },
    },
  });

  await seedCompany(customer);

  // // Create leaf-nodes
  // const leafs = await Promise.all(leafNodes.map(async (leafNode) => {
  //   return prisma.createLeafNode({
  //     title: leafNode.title,
  //     type: leafNode.type,
  //   });
  // }));

  // const rootQuestion = await prisma.createQuestionNode({
  //   title: `How do you feel about ${customer.name}?`,
  //   questionType: sliderType,
  //   isRoot: true,
  // });

  // // Create questionnaire
  // const questionnaire = await prisma.createQuestionnaire({
  //   customer: {
  //     connect: {
  //       id: customer.id,
  //     },
  //   },
  //   leafs: {
  //     connect: leafs.map((leaf) => ({ id: leaf.id })),
  //   },
  //   title: 'Default starbucks questionnaire',
  //   description: 'Default questions',
  //   questions: {
  //     connect: [{
  //       id: rootQuestion.id,
  //     },
  //     ],
  //   },
  // });

  // // Connect the questionnaire to the customer
  // prisma.updateCustomer({
  //   where: {
  //     id: customer.id,
  //   },
  //   data: {
  //     questionnaires: {
  //       connect: {
  //         id: questionnaire.id,
  //       },
  //     },
  //   },
  // });

  // const standardSubChildrenWithLeafs = await Promise.all(standardSubChildren.map(async (rootChild) => {
  //   const subleafs = await prisma.leafNodes({
  //     where: {
  //       title_contains: rootChild.overrideLeafContains,
  //       AND: {
  //         id_in: await Promise.all((await prisma.questionnaire({ id: questionnaire.id }).leafs()).map((leaf) => leaf.id)),
  //       },
  //     },
  //   });

  //   let leaf = null;

  //   if (subleafs) {
  //     [leaf] = subleafs;
  //   }

  //   return {
  //     ...rootChild,
  //     overrideLeaf: leaf,
  //   };
  // }));

  // const standardRootChildrenWithLeafs = await Promise.all(standardRootChildren
  //   .map(async (rootChild) => {
  //     const subleafs = await prisma.leafNodes({
  //       where: {
  //         title_contains: rootChild.overrideLeafContains,
  //         AND: {
  //           id_in: await Promise.all((await prisma.questionnaire({ id: questionnaire.id })
  //             .leafs()).map((leaf) => leaf.id)),
  //         },
  //       },
  //     });

  //     let leaf = null;

  //     if (subleafs) {
  //       [leaf] = subleafs;
  //     }

  //     return {
  //       ...rootChild,
  //       overrideLeaf: leaf,
  //       children: standardSubChildrenWithLeafs,
  //     };
  //   }));

  // // Create root-questions
  // const rootQuestions = await Promise.all(standardRootChildrenWithLeafs
  //   .map(async (childNode) => prisma.createQuestionNode({
  //     title: childNode.title,
  //     questionnaire: {
  //       connect: {
  //         id: questionnaire.id,
  //       },
  //     },
  //     questionType: childNode.questionType,
  //     overrideLeaf: {
  //       connect: {
  //         id: childNode.overrideLeaf?.id,
  //       },
  //     },
  //     options: {
  //       create: childNode.options.map((option) => ({ value: option })),
  //     },
  //     children: {
  //       create: childNode.children.map((child) => ({
  //         title: child.title,
  //         questionnaire: {
  //           connect: {
  //             id: questionnaire.id,
  //           },
  //         },
  //         questionType: child.type,
  //         overrideLeaf: {
  //           connect: {
  //             id: child.overrideLeaf?.id,
  //           },
  //         },
  //         options: {
  //           create: child.childrenNodes.map((subChild) => ({ value: subChild.value })),
  //         },
  //       })),
  //     },
  //   })));

  // // Extract mainQuestion
  // // TODO: How to get unique boolean isRoot, so that we can use prisma.questionNode
  // const mainQuestions = await prisma.questionNodes({
  //   where: {
  //     isRoot: true,
  //     AND: {
  //       id_in: await Promise.all((await prisma.questionnaire({ id: questionnaire.id })
  //         .questions()).map((q) => q.id)),
  //     },
  //   },
  // });
  // const mainQuestion = mainQuestions[0];

  // // Connect the root question to the other questions
  // await prisma.updateQuestionNode({
  //   where: {
  //     id: mainQuestion.id,
  //   },
  //   data: {
  //     questionnaire: {
  //       connect: {
  //         id: questionnaire.id,
  //       },
  //     },
  //     children: {
  //       connect: rootQuestions.map((rootNode) => ({ id: rootNode.id })),
  //     },
  //   },
  // });

  // const leafIds = leafs.map((leaf) => leaf.id);

  // // Create edges here
  // await Promise.all(getStandardEdgeData('Starbucks').map(async (edge) => {
  //   const childNode = await prisma.questionNodes({
  //     where: {
  //       title_contains: edge.childQuestionContains,
  //       OR: [
  //         {
  //           overrideLeaf: {
  //             id_not: null,
  //             id_in: leafIds,
  //           },
  //         },
  //         {
  //           id: null,
  //         },
  //       ],
  //     },
  //   });

  //   if (!childNode[0]) {
  //     console.log('Cant find node for:', edge);
  //   }
  //   const childNodeId = childNode?.[0]?.id;

  //   const parentNode = await prisma.questionNodes(
  //     {
  //       where: {
  //         OR: [
  //           {
  //             title_contains: edge.parentQuestionContains,
  //             overrideLeaf: {
  //               id_not: null,
  //               id_in: leafIds,
  //             },
  //           },
  //           {
  //             title_contains: edge.parentQuestionContains,
  //             overrideLeaf: null,
  //           },
  //         ],
  //       },
  //     },
  //   );

  //   const parentNodeId = parentNode?.[0]?.id;

  //   if (childNodeId && parentNodeId) {
  //     await prisma.createEdge({
  //       childNode: {
  //         connect: {
  //           id: childNodeId,
  //         },
  //       },
  //       parentNode: {
  //         connect: {
  //           id: parentNodeId,
  //         },
  //       },
  //       conditions: {
  //         create: {
  //           conditionType: edge.conditions?.[0].conditionType,
  //           matchValue: edge.conditions?.[0].matchValue,
  //           renderMin: edge.conditions?.[0].renderMin,
  //           renderMax: edge.conditions?.[0].renderMax,
  //         },
  //       },
  //     });
  //   }
  // }));

  // await Promise.all((await prisma.questionNodes({ where:
  //   { questionnaire: { id: questionnaire.id } } })).map(async (node) => {
  //   const edgeChildrenNodes = await prisma.edges({
  //     where: {
  //       parentNode: {
  //         id: node.id,
  //       },
  //     },
  //   });

  //   await prisma.updateQuestionNode({
  //     where: {
  //       id: node.id,
  //     },
  //     data: {
  //       questionnaire: {
  //         connect: {
  //           id: questionnaire.id,
  //         },
  //       },
  //       edgeChildren: {
  //         connect: edgeChildrenNodes.map((edgeChild) => ({ id: edgeChild.id })),
  //       },
  //     },
  //   });
  //   // 1. Find all edges (parentId) corresponderend met huidige node id
  //   // 2. Update edgeChildren van huidige node met gevonden edges
  // }));
};

export default makeStarbucks;
