import { PrismaClient, QuestionNodeUpdateInput, QuestionNodeCreateInput, BatchPayload, Edge, QuestionNode, QuestionOption, VideoEmbeddedNode, FormNodeFieldUpsertArgs, FormNodeCreateInput, VideoEmbeddedNodeUpdateOneWithoutQuestionNodeInput, NodeType } from "@prisma/client";

import { CreateQuestionInput } from "../../../questionnaire/DialoguePrismaAdapterType";
import NodeService from "../../NodeService";
import { QuestionOptionProps } from "../../NodeServiceType";
import QuestionOptionPrismaAdapter from "../QuestionOption/QuestionOptionPrismaAdapter";
import { CreateFormFieldsInput, UpdateFormFieldsInput, CreateCTAInput, UpdateQuestionInput } from "./QuestionNodePrismaAdapterType";

class QuestionNodePrismaAdapter {
  prisma: PrismaClient;
  questionOptionPrismaAdapter: QuestionOptionPrismaAdapter;

  constructor(prismaClient: PrismaClient) {
    this.prisma = prismaClient;
    this.questionOptionPrismaAdapter = new QuestionOptionPrismaAdapter(prismaClient);
  }

  createFieldsOfForm(input: CreateFormFieldsInput) {
    return this.prisma.questionNode.update({
      where: {
        id: input.questionId,
      },
      data: {
        form: {
          create: input.fields,
        },
      }
    })
  }

  updateFieldsOfForm(input: UpdateFormFieldsInput) {
    return this.prisma.questionNode.update({
      where: {
        id: input.questionId,
      },
      data: {
        form: {
          update: {
            fields: {
              upsert: input.fields,
            },
          },
        },
      }
    })
  }

  createCTANode(input: CreateCTAInput) {
    return this.prisma.questionNode.create({
      data:
      {
        title: input.title,
        type: input.type,
        isLeaf: true,
        links: {
          create: input.links,
        },
        share: {
          create: input.share,
        },
        form: {
          create: input.form ? NodeService.saveCreateFormNodeInput(input.form) : undefined,
        },
        questionDialogue: {
          connect: {
            id: input.dialogueId,
          },
        },
      }
    })
  }

  delete(id: string): Promise<QuestionNode> {
    return this.prisma.questionNode.delete({
      where: {
        id,
      }
    });
  };

  updateQuestionOptions = async (options: QuestionOptionProps[]): Promise<{ id: number }[]> => Promise.all(
    options?.map(async (option) => {
      const optionId = option.id ? option.id : -1
      const optionUpsertInput = {
        value: option.value,
        publicValue: option.publicValue,
        overrideLeaf: option.overrideLeafId ? { connect: { id: option.overrideLeafId } } : undefined,
        position: option.position,
      }
      const updatedQOption = await this.questionOptionPrismaAdapter.upsert(optionId, optionUpsertInput, optionUpsertInput);

      return { id: updatedQOption.id };
    }),
  );

  async updateDialogueBuilderNode(nodeId: string, data: UpdateQuestionInput) {
    const { title, type, options, currentOverrideLeafId, overrideLeafId, videoEmbeddedNode } = data;
    const leaf = NodeService.getLeafState(currentOverrideLeafId || null, overrideLeafId || null);
    const updatedOptionIds = await this.updateQuestionOptions(options || []);

    // Remove videoEmbeddedNode if updated to different type
    let embedVideoInput: VideoEmbeddedNodeUpdateOneWithoutQuestionNodeInput | undefined;
    if (type !== NodeType.VIDEO_EMBEDDED && videoEmbeddedNode?.id) {
      embedVideoInput = { delete: true };
    }

    return this.prisma.questionNode.update({
      where: { id: nodeId },
      data: {
        title,
        type,
        options: {
          connect: updatedOptionIds,
        },
        overrideLeaf: leaf || undefined,
        videoEmbeddedNode: embedVideoInput,
      },
      include: {
        videoEmbeddedNode: true,
      }
    })
  }

  getDialogueBuilderNode(nodeId: string): Promise<(QuestionNode & { videoEmbeddedNode: VideoEmbeddedNode | null; children: Edge[]; options: QuestionOption[]; questionDialogue: { id: string; } | null; overrideLeaf: { id: string; } | null; }) | null> {
    return this.prisma.questionNode.findOne({
      where: { id: nodeId },
      include: {
        videoEmbeddedNode: true,
        children: true,
        options: true,
        questionDialogue: {
          select: {
            id: true,
          },
        },
        overrideLeaf: {
          select: {
            id: true,
          },
        },
      }
    });
  }

  createQuestion(question: CreateQuestionInput) {
    return this.prisma.questionNode.create({
      data: {
        isRoot: question.isRoot,
        isLeaf: question.isLeaf,
        title: question.title,
        type: question.type,
        questionDialogue: question.dialogueId ? {
          connect: {
            id: question.dialogueId,
          }
        } : undefined,
        videoEmbeddedNode: question.videoEmbeddedNode?.videoUrl ? {
          create: {
            videoUrl: question.videoEmbeddedNode.videoUrl,
          }
        } : undefined,
        links: question.links?.length ? {
          create: question.links,
        } : undefined,
        options: question.options?.length ? {
          create: question.options.map(({ value, overrideLeafId, publicValue, position }) => {
            return {
              value,
              publicValue,
              position,
              overrideLeaf: overrideLeafId ? { connect: { id: overrideLeafId } } : undefined
            }
          }),
        } : undefined,
        overrideLeaf: question.overrideLeafId ? {
          connect: {
            id: question.overrideLeafId,
          }
        } : undefined,
        form: question.form ? {
          create: {
            fields: {
              create: question.form?.fields,
            },
          },
        } : undefined,
        sliderNode: question.sliderNode ? {
          create: {
            markers: {
              create: question?.sliderNode?.markers?.map((marker) => ({
                label: marker?.label,
                subLabel: marker?.subLabel,
                range: {
                  create: {
                    start: marker?.range?.start,
                    end: marker?.range?.end,
                  },
                },
              })),
            },
          },
        } : undefined,
      },
    });
  }

  create(data: QuestionNodeCreateInput): Promise<QuestionNode> {
    return this.prisma.questionNode.create({
      data,
    });
  };

  async getCTANode(nodeId: string) {
    const existingNode = await this.prisma.questionNode.findOne({
      where: { id: nodeId },
      include: {
        links: true,
        share: true,
        form: {
          include: {
            fields: true,
          },
        },
      },
    });
    return existingNode;
  }


  async getNodeByLinkId(linkId: string) {
    const link = await this.prisma.link.findOne({
      where: { id: linkId },
      include: { questionNode: true },
    });

    return link?.questionNode;
  }

  connectEdgeToQuestion(nodeId: string, edgeId: string) {
    return this.prisma.questionNode.update({
      where: {
        id: nodeId,
      },
      data: {
        children: {
          connect: [{ id: edgeId }],
        },
      },
    });
  }

  removeFormFields(questionId: string, fields: Array<{ id: string }>) {
    return this.prisma.questionNode.update({
      where: {
        id: questionId,
      },
      data: {
        form: {
          update: {
            fields: {
              disconnect: fields,
            },
          },
        },
      },
    });
  };

  update(nodeId: string, data: QuestionNodeUpdateInput): Promise<QuestionNode> {
    return this.prisma.questionNode.update({
      where: {
        id: nodeId,
      },
      data,
    });
  }


  async getNodeById(nodeId: string): Promise<QuestionNode | null> {
    return this.prisma.questionNode.findOne({
      where: { id: nodeId },
    });
  }

  async deleteMany(questionIds: string[]): Promise<BatchPayload> {
    return this.prisma.questionNode.deleteMany(
      {
        where: {
          id: {
            in: questionIds,
          },
        },
      },
    );
  }

}

export default QuestionNodePrismaAdapter;
