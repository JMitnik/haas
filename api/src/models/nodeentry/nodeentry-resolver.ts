import { PrismaClient, SessionWhereInput } from '@prisma/client';
import _ from 'lodash';

const prisma = new PrismaClient();
class NodeEntryResolver {
  static getCurrentInteractionSessions = async (
    dialogueId: string,
    offset: number,
    limit: number,
    pageIndex: number,
    orderBy: any,
    dateRange: SessionWhereInput[] | [],
    searchTerm: string) => {
    let needPageReset = false;
    let flatMerged;
    const nodeEntriesScore = await prisma.nodeEntry.findMany(
      {
        where: {
          session: {
            dialogueId,
            AND: dateRange,
          },
        },
        include: {
          session: {
            select: {
              id: true,
              createdAt: true,
            },
          },
          values: true,
        },
      },
    );

    const groupedScoreSessions = _.groupBy(nodeEntriesScore, (entry) => entry.sessionId);
    let totalPages = Math.ceil(Object.keys(groupedScoreSessions).length / limit);

    if (searchTerm) {
      const merged = _.filter(groupedScoreSessions, (session) => session.filter((entry) => entry.values[0].textValue?.toLowerCase().includes(searchTerm.toLowerCase())).length > 0);

      totalPages = Math.ceil(merged.length / limit);
      if (pageIndex + 1 > totalPages) {
        offset = 0;
        needPageReset = true;
      }
      flatMerged = _.flatten(merged);
    }
    const finalNodeEntryScore = flatMerged || nodeEntriesScore;
    const filteredNodeEntresScore = _.filter(finalNodeEntryScore, (nodeEntryScore) => nodeEntryScore.depth === 0);

    let orderedNodeEntriesScore;
    if (orderBy.id === 'score') {
      orderedNodeEntriesScore = _.orderBy(
        filteredNodeEntresScore, (entry) => entry.values[0].numberValue, orderBy.desc ? 'desc' : 'asc',
      );
    } else if (orderBy.id === 'id') {
      orderedNodeEntriesScore = _.orderBy(
        filteredNodeEntresScore, (entry) => entry.id, orderBy.desc ? 'desc' : 'asc',
      );
    } else if (orderBy.id === 'createdAt') {
      orderedNodeEntriesScore = _.orderBy(
        filteredNodeEntresScore, (entry) => entry.creationDate, orderBy.desc ? 'desc' : 'asc',
      );
    } else {
      orderedNodeEntriesScore = filteredNodeEntresScore;
    }

    const pageNodeEntries = (offset + limit) < orderedNodeEntriesScore.length
      ? orderedNodeEntriesScore.slice(offset, (pageIndex + 1) * limit)
      : orderedNodeEntriesScore.slice(offset, orderedNodeEntriesScore.length);

    const pageSessionIds = pageNodeEntries.map((entry) => entry.sessionId);
    const pageSessions = pageSessionIds.map((sessionId) => sessionId !== null && groupedScoreSessions[sessionId]);
    const mappedPageSessions = pageSessions.map((entries) => {
      if (entries) {
        const { sessionId, session } = entries[0];
        const paths = entries.length;
        const score = entries.find((entry) => entry.depth === 0)?.values[0].numberValue;
        return {
          id: sessionId, paths, score, createdAt: session?.createdAt, nodeEntries: entries,
        };
      }
    });
    return { pageSessions: mappedPageSessions, totalPages, resetPages: needPageReset };
  };
}

export default NodeEntryResolver;
