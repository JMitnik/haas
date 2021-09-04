import { Prisma, PrismaClient, Edge, QuestionNode, QuestionOption, VideoEmbeddedNode, NodeType, Link, Share } from "@prisma/client";

import { CreateQuestionInput } from "../questionnaire/DialoguePrismaAdapterType";
import NodeService from "./NodeService";
import { QuestionOptionProps } from "./NodeServiceType";
import { CreateFormFieldsInput, UpdateFormFieldsInput, CreateCTAInput, UpdateQuestionInput, CreateLinkInput, UpdateLinkInput, CreateShareInput, UpdateShareInput, UpdateSliderNodeInput, CreateSliderNodeInput, CreateVideoEmbeddedNodeInput } from "./QuestionNodePrismaAdapterType";

class QuestionNodePrismaAdapter {
  prisma: PrismaClient;

  constructor(prismaClient: PrismaClient) {
    this.prisma = prismaClient;
  }

  updateVideoNode(nodeId: string, data: Prisma.VideoEmbeddedNodeUpdateInput): Promise<VideoEmbeddedNode> {
    return this.prisma.videoEmbeddedNode.update({
      where: { id: nodeId },
      data: data,
    });
  };

  createVideoNode(data: CreateVideoEmbeddedNodeInput) {
    const { parentNodeId, videoUrl } = data;
    return this.prisma.videoEmbeddedNode.create({
      data: {
        videoUrl: videoUrl,
        QuestionNode: parentNodeId ? {
          connect: {
            id: parentNodeId,
          },
        } : undefined,
      },
    });
  };

  deleteVideoNode(id: string): Promise<VideoEmbeddedNode> {
    return this.prisma.videoEmbeddedNode.delete({
      where: {
        id,
      }
    });
  };

  getVideoNodeById(nodeId: string): Promise<VideoEmbeddedNode | null> {
    return this.prisma.videoEmbeddedNode.findUnique({
      where: {
        id: nodeId,
      }
    })
  }

  createSliderNode(data: CreateSliderNodeInput) {
    const { parentNodeId, markers, unhappyText, happyText } = data;
    return this.prisma.sliderNode.create({
      data: {
        unhappyText,
        happyText,
        QuestionNode: {
          connect: {
            id: parentNodeId,
          },
        },
        markers: {
          create: markers?.map((marker) => ({
            label: marker.label || '',
            subLabel: marker.subLabel || '',
            range: {
              create: {
                start: marker?.range?.start || undefined,
                end: marker?.range?.end || undefined,
              },
            },
          })),
        },
      },
    });
  };

  updateSliderNode(parentNodeId: string, data: UpdateSliderNodeInput) {
    const { happyText, unhappyText, markers } = data;
    return this.prisma.sliderNode.update({
      where: { id: parentNodeId },
      data: {
        happyText,
        unhappyText,
        markers: {
          update: markers?.map((marker) => ({
            where: { id: marker?.id || undefined },
            data: {
              label: marker.label,
              subLabel: marker.subLabel,
            },
          })),
        },
      },
    });
  };

  upsertShareNode(id: string, create: CreateShareInput, update: UpdateShareInput): Promise<Share> {
    return this.prisma.share.upsert({
      where: {
        id,
      },
      create: {
        title: create.title,
        tooltip: create.tooltip,
        url: create.url,
        questionNode: {
          connect: {
            id: create.questionId
          }
        }
      },
      update: {
        title: update.title,
        tooltip: update.tooltip,
        url: update.url,
      },
    });
  };

  async getShareNodeByQuestionId(parentId: string) {
    return this.prisma.share.findFirst({
      where: {
        questionNodeId: parentId,
      },
    });
  };

  deleteShareNodesByQuestionId(parentId: string): Promise<Prisma.BatchPayload> {
    return this.prisma.share.deleteMany({
      where: {
        questionNodeId: parentId,
      },
    });
  };

  deleteShareNode(id: string) {
    return this.prisma.share.delete({ where: { id } });
  }

  deleteOptionsByQuestionIds(questionIds: string[]): Promise<Prisma.BatchPayload> {
    return this.prisma.questionOption.deleteMany(
      {
        where: {
          questionNodeId: {
            in: questionIds,
          },
        },
      },
    );
  };

  upsertLink(linkId: string, create: CreateLinkInput, update: UpdateLinkInput) {
    return this.prisma.link.upsert({
      where: { id: linkId },
      create: {
        title: create.title,
        type: create.type,
        url: create.url,
        backgroundColor: create.backgroundColor,
        iconUrl: create.iconUrl,
        questionNode: {
          connect: {
            id: create.questionId,
          }
        }
      },
      update: {
        title: update.title,
        type: update.type,
        url: update.url,
        backgroundColor: update.backgroundColor,
        iconUrl: update.iconUrl,
      }
    });
  };

  deleteLinks(linkIds: string[]) {
    return this.prisma.link.deleteMany({ where: { id: { in: linkIds } } });
  }

  getLinksByNodeId(parentId: string): Promise<Link[]> {
    return this.prisma.link.findMany({
      where: {
        questionNodeId: parentId,
      },
    });
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

  upsertQuestionOption(id: number, create: Prisma.QuestionOptionCreateInput, update: Prisma.QuestionOptionUpdateInput): Promise<QuestionOption> {
    return this.prisma.questionOption.upsert({
      where: { id },
      create,
      update,
    })
  };

  findOptionsByQuestionId(parentId: string) {
    return this.prisma.questionOption.findMany({
      where: { questionNodeId: parentId },
      orderBy: {
        position: 'asc',
      },
      include: {
        overrideLeaf: true
      }
    });
  }

  deleteQuestionOptions(optionIds: number[]): Promise<Prisma.BatchPayload> {
    return this.prisma.questionOption.deleteMany({ where: { id: { in: optionIds } } });
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
      const updatedQOption = await this.upsertQuestionOption(optionId, optionUpsertInput, optionUpsertInput);

      return { id: updatedQOption.id };
    }),
  );

  async updateDialogueBuilderNode(nodeId: string, data: UpdateQuestionInput) {
    const { title, type, options, currentOverrideLeafId, overrideLeafId, videoEmbeddedNode } = data;
    const leaf = NodeService.constructUpdateLeafState(currentOverrideLeafId || null, overrideLeafId || null);
    const updatedOptionIds = await this.updateQuestionOptions(options || []);

    // Remove videoEmbeddedNode if updated to different type
    let embedVideoInput: Prisma.VideoEmbeddedNodeUpdateOneWithoutQuestionNodeInput | undefined;
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
    return this.prisma.questionNode.findUnique({
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

  create(data: Prisma.QuestionNodeCreateInput): Promise<QuestionNode> {
    return this.prisma.questionNode.create({
      data,
    });
  };

  async getCTANode(nodeId: string) {
    const existingNode = await this.prisma.questionNode.findUnique({
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


  async findNodeByLinkId(linkId: string) {
    const link = await this.prisma.link.findUnique({
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

  update(nodeId: string, data: Prisma.QuestionNodeUpdateInput): Promise<QuestionNode> {
    return this.prisma.questionNode.update({
      where: {
        id: nodeId,
      },
      data,
    });
  }

  getNodesByNodeIds(questionIds: string[]) {
    return this.prisma.questionNode.findMany({
      where: {
        id: {
          in: questionIds,
        },
      },
      include: {
        options: true,
        videoEmbeddedNode: true,
        isOverrideLeafOf: true,
        Edge: true,
      },
    });
  };

  async findNodeById(nodeId: string): Promise<QuestionNode | null> {
    return this.prisma.questionNode.findUnique({
      where: { id: nodeId },
      include: {
        options: true,
        videoEmbeddedNode: true,
        isOverrideLeafOf: true,
      },
    });
  }

  async deleteMany(questionIds: string[]): Promise<Prisma.BatchPayload> {
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
