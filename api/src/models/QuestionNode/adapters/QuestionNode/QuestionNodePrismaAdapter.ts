import { PrismaClient, QuestionNodeUpdateInput, QuestionNodeCreateInput, BatchPayload, Edge, QuestionNode, QuestionOption, VideoEmbeddedNode, FormNodeFieldUpsertArgs, FormNodeCreateInput } from "@prisma/client";
import { NexusGenInputs } from "../../../../generated/nexus";
import { CreateQuestionInput } from "../../../questionnaire/DialoguePrismaAdapter";
import NodeService from "../../NodeService";

export type CreateCTAInput = {
  title: string,
  type?: "GENERIC" | "SLIDER" | "FORM" | "CHOICE" | "REGISTRATION" | "TEXTBOX" | "LINK" | "SHARE" | "VIDEO_EMBEDDED" | undefined,
  form?: NexusGenInputs['FormNodeInputType'] | null, // FormNodeInputType
  links: {
    id: string | undefined;
    backgroundColor: string | undefined;
    iconUrl: string | undefined;
    title: string | undefined;
    type: "API" | "FACEBOOK" | "INSTAGRAM" | "LINKEDIN" | "SOCIAL" | "TWITTER" | "WHATSAPP";
    url: string;
  }[],
  share: {
    id: string | undefined;
    title: string;
    tooltip: string | undefined;
    url: string;
  } | undefined,
  dialogueId: string,
}

export type UpdateFormFieldsInput = {
  questionId: string;
  fields: FormNodeFieldUpsertArgs[];
}

export type CreateFormFieldsInput = {
  questionId: string;
  fields: FormNodeCreateInput;
}

class QuestionNodePrismaAdapter {
  prisma: PrismaClient;

  constructor(prismaClient: PrismaClient) {
    this.prisma = prismaClient;
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

  async updateDialogueBuilderNode(nodeId: string, data: QuestionNodeUpdateInput) {
    return this.prisma.questionNode.update({
      where: { id: nodeId },
      data: data,
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
