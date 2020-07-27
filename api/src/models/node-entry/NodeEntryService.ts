import { ChoiceNodeEntry,
  LinkNodeEntry, NodeEntry, NodeEntryCreateWithoutSessionInput, NodeEntryWhereInput,
  QuestionNode, RegistrationNodeEntry,
  SliderNodeEntry, TextboxNodeEntry } from '@prisma/client';
import _ from 'lodash';

// eslint-disable-next-line import/no-cycle
import { OrderByProps } from '../../types/generic';
import prisma from '../../prisma';

export interface NodeEntryWithTypes extends NodeEntry {
  session?: {
    id: String;
    createdAt: Date;
  } | undefined | null;
  relatedNode?: QuestionNode | null;
  sliderNodeEntry?: SliderNodeEntry | undefined | null;
  choiceNodeEntry?: ChoiceNodeEntry | undefined | null;
  registrationNodeEntry?: RegistrationNodeEntry | undefined | null;
  textboxNodeEntry?: TextboxNodeEntry | undefined | null;
  linkNodeEntry?: LinkNodeEntry | undefined | null;
}

class NodeEntryService {
  static constructCreateNodeEntryFragment = (nodeEntryInput: any): NodeEntryCreateWithoutSessionInput => ({
    relatedNode: nodeEntryInput.nodeId && { connect: { id: nodeEntryInput.nodeId } },
    relatedEdge: nodeEntryInput.edgeId && { connect: { id: nodeEntryInput.edgeId } },
    depth: nodeEntryInput?.depth,

    choiceNodeEntry: nodeEntryInput?.data?.choice?.value && {
      create: { value: nodeEntryInput?.data?.choice?.value },
    },

    registrationNodeEntry: nodeEntryInput?.data?.register?.value && {
      create: { value: nodeEntryInput?.data?.register?.value },
    },

    sliderNodeEntry: nodeEntryInput?.data?.slider?.value && {
      create: { value: nodeEntryInput?.data?.slider?.value },
    },

    textboxNodeEntry: nodeEntryInput?.data?.textbox?.value && {
      create: { value: nodeEntryInput?.data?.textbox?.value },
    },
  });

  // TODO: Test
  static isNodeEntryMatchText = (nodeEntry: NodeEntryWithTypes, searchTerm: string) => {
    const processedSearch = searchTerm.toLowerCase();

    if (nodeEntry.relatedNode?.type === 'CHOICE') {
      return nodeEntry.choiceNodeEntry?.value?.toLowerCase().includes(processedSearch);
    }

    if (nodeEntry.relatedNode?.type === 'REGISTRATION') {
      return nodeEntry.registrationNodeEntry?.value?.toString().includes(processedSearch);
    }

    if (nodeEntry.relatedNode?.type === 'TEXTBOX') {
      return nodeEntry.textboxNodeEntry?.value?.toString().includes(processedSearch);
    }

    return false;
  };

  static sortEntries = (entries: NodeEntryWithTypes[], orderBy: OrderByProps) => {
    let orderedNodeEntriesScore;

    if (orderBy.by === 'score') {
      orderedNodeEntriesScore = _.orderBy(
        entries, (entry) => entry.sliderNodeEntry?.value, orderBy.desc ? 'desc' : 'asc',
      );
    } else if (orderBy.by === 'id') {
      orderedNodeEntriesScore = _.orderBy(
        entries, (entry) => entry.id, orderBy.desc ? 'desc' : 'asc',
      );
    } else if (orderBy.by === 'createdAt') {
      orderedNodeEntriesScore = _.orderBy(
        entries, (entry) => entry.creationDate, orderBy.desc ? 'desc' : 'asc',
      );
    } else {
      orderedNodeEntriesScore = entries;
    }

    return orderedNodeEntriesScore;
  };

  static getEntries = async (whereInput: NodeEntryWhereInput): Promise<NodeEntryWithTypes[]> => {
    const entries = prisma.nodeEntry.findMany({
      where: whereInput,
      include: {
        session: {
          select: {
            id: true,
            createdAt: true,
          },
        },
        choiceNodeEntry: true,
        registrationNodeEntry: true,
        textboxNodeEntry: true,
        linkNodeEntry: true,
        sliderNodeEntry: true,
      },
    });

    return entries;
  };

  // static fetchNodeEntryValue = async (nodeEntry: NodeEntry): Promise<any> => {
  //   if
  // }

  static getNodeEntryValue = async (nodeEntry: NodeEntryWithTypes): Promise<any> => {
    if (nodeEntry.relatedNode?.type === 'GENERIC') {
      return null;
    }

    if (nodeEntry.relatedNode?.type === 'SLIDER') {
      try {
        return nodeEntry?.sliderNodeEntry?.value;
      } catch {
        throw new Error('sliderNodeEntry was not included on initial retrieval.');
      }
    }

    if (nodeEntry.relatedNode?.type === 'CHOICE') {
      try {
        return nodeEntry?.choiceNodeEntry?.value;
      } catch {
        throw new Error('ChoiceNodeEntry was not included on initial retrieval.');
      }
    }

    if (nodeEntry.relatedNode?.type === 'LINK') {
      try {
        return nodeEntry?.linkNodeEntry?.value;
      } catch {
        throw new Error('LinkNodeEntry was not included on initial retrieval.');
      }
    }

    if (nodeEntry.relatedNode?.type === 'REGISTRATION') {
      try {
        return nodeEntry?.registrationNodeEntry?.value;
      } catch {
        throw new Error('RegistrationNodeEntry was not included on initial retrieval.');
      }
    }

    if (!nodeEntry.relatedNode) {
      return null;
    }

    throw new Error(`Unable to find node entry type ${nodeEntry.relatedNode?.type}.`);
  };

  static constructFindWhereTextNodeEntryFragment(text: string): NodeEntryWhereInput {
    // TODO: Figure out what to do with the texts
    return {
      OR: [
        { textboxNodeEntry: {
          value: {
            contains: text,
          },
        } },
        { choiceNodeEntry: {
          value: {
            contains: text,
          },
        } },
        {
        // Ensure we can make this better searchable (JSON?)
          registrationNodeEntry: {
            value: {
              equals: text,
            },
          },
        }],
    };
  }

  static getTextValueFromEntry = (entry: NodeEntryWithTypes): (string | null) => {
    if (entry.relatedNode?.type === 'CHOICE') return entry.choiceNodeEntry?.value || null;
    if (entry.relatedNode?.type === 'TEXTBOX') return entry.choiceNodeEntry?.value || null;

    return null;
  };

  // Slice node entries to match amount of nodes displayed in front-end
  // If offset + limit is greater than amount visible in front-end
  // => slice until end of the array
  static sliceNodeEntries = (
    entries: Array<NodeEntry>,
    offset: number,
    limit: number,
    pageIndex: number,
  ) => ((offset + limit) < entries.length
    ? entries.slice(offset, (pageIndex + 1) * limit)
    : entries.slice(offset, entries.length));
}

export default NodeEntryService;
