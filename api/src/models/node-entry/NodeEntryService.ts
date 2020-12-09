import { ChoiceNodeEntry,
  FormNodeEntryGetPayload,
  LinkNodeEntry, NodeEntry, NodeEntryCreateWithoutSessionInput, NodeEntryWhereInput,
  QuestionNode, RegistrationNodeEntry,
  SliderNodeEntry, TextboxNodeEntry } from '@prisma/client';
import { isPresent } from 'ts-is-present';
import _ from 'lodash';

// eslint-disable-next-line import/no-cycle
import { NexusGenInputs } from '../../generated/nexus';
import { OrderByProps } from '../../types/generic';
import { pickProperties } from '../../utils/pickProperties';
import prisma from '../../config/prisma';

export interface NodeEntryWithTypes extends NodeEntry {
  session?: {
    id: String;
    createdAt: Date;
  } | undefined | null;
  relatedNode?: QuestionNode | null;
  sliderNodeEntry?: SliderNodeEntry | undefined | null;
  choiceNodeEntry?: ChoiceNodeEntry | undefined | null;
  formNodeEntry?: FormNodeEntryGetPayload<{ include: { values: true } }> | undefined | null;
  registrationNodeEntry?: RegistrationNodeEntry | undefined | null;
  textboxNodeEntry?: TextboxNodeEntry | undefined | null;
  linkNodeEntry?: LinkNodeEntry | undefined | null;
}

class NodeEntryService {
  static constructCreateNodeEntryFragment = (nodeEntryInput: NexusGenInputs['NodeEntryInput']): NodeEntryCreateWithoutSessionInput => ({
    relatedNode: (nodeEntryInput.nodeId && { connect: { id: nodeEntryInput.nodeId } }) || undefined,
    relatedEdge: (nodeEntryInput.edgeId && { connect: { id: nodeEntryInput.edgeId } }) || undefined,
    depth: nodeEntryInput?.depth,

    choiceNodeEntry: nodeEntryInput?.data?.choice?.value ? {
      create: { value: nodeEntryInput?.data?.choice?.value },
    } : undefined,

    registrationNodeEntry: nodeEntryInput?.data?.register?.value ? {
      create: { value: nodeEntryInput?.data?.register?.value },
    } : undefined,

    sliderNodeEntry: nodeEntryInput?.data?.slider?.value ? {
      create: { value: nodeEntryInput?.data?.slider?.value },
    } : undefined,

    textboxNodeEntry: nodeEntryInput?.data?.textbox?.value ? {
      create: { value: nodeEntryInput?.data?.textbox?.value },
    } : undefined,

    formNodeEntry: nodeEntryInput?.data?.form?.values ? {
      create: {
        values: {
          create: nodeEntryInput?.data?.form?.values?.map((val) => ({
            relatedField: { connect: { id: val.relatedFieldId || '-1' } },
            ...pickProperties(
              val,
              ['email', 'phoneNumber', 'url', 'shortText', 'longText', 'number'],
            ),
          })),
        },
      },
    } : undefined,
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

  /**
   * Return a textual-representation of a node-entry.
   * - Used for building up a mail.
   */
  static getNodeEntryValue = (nodeEntry: NodeEntryWithTypes): any => {
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

    if (nodeEntry.relatedNode?.type === 'FORM') {
      try {
        return nodeEntry?.formNodeEntry?.values.map((val) => Object.values(_.pick(val, [
          'email',
          'phoneNumber',
          'url',
          'shortText',
          'longText',
          'number',
        ])).find(isPresent)).join(', ');
      } catch {
        throw new Error('RegistrationNodeEntry was not included on initial retrieval.');
      }
    }

    if (!nodeEntry.relatedNode) {
      return null;
    }

    throw new Error(`Unable to find node entry type ${nodeEntry.relatedNode?.type}.`);
  };

  /**
   * Searches for text-nodes.
   * Used generally in the fetching of relevant interactions/sessions.
   * @param text
   */
  static constructFindWhereTextNodeEntryFragment(text: string): NodeEntryWhereInput {
    return {
      OR: [
        { textboxNodeEntry: {
          value: {
            contains: text,
            mode: 'insensitive',
          },
        } },
        { choiceNodeEntry: {
          value: {
            contains: text,
            mode: 'insensitive',
          },
        } },
        // DEPRECATED (but still included)
        {
          registrationNodeEntry: {
            value: {
              equals: text,
            },
          },
        },
        {
          formNodeEntry: {
            values: {
              some: {
                OR: [
                  {
                    phoneNumber: {
                      contains: text,
                      mode: 'insensitive',
                    },
                  },
                  {
                    shortText: {
                      contains: text,
                      mode: 'insensitive',
                    },
                  },
                  {
                    url: {
                      contains: text,
                      mode: 'insensitive',
                    },
                  },
                  {
                    email: {
                      contains: text,
                      mode: 'insensitive',
                    },
                  },
                  {
                    longText: {
                      contains: text,
                      mode: 'insensitive',
                    },
                  },
                ],
              },
            },
          },
        },
      ],
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
