import * as UI from '@haas/ui';
import { ResponsiveSankey } from '@nivo/sankey';
import { uniqBy } from 'lodash';
import React from 'react';

import { DialoguePathsSummaryType } from 'types/generated-types';

interface PathSummaryModuleProps {
  data?: DialoguePathsSummaryType | null;
}

export const PathSummaryModule = ({ data }: PathSummaryModuleProps) => {
  const nodes = uniqBy([
    ...data?.mostCriticalPath?.nodes.map((node) => ({ ...node, color: 'hsl(0, 91%, 71%)' })) || [],
    ...data?.mostPopularPath?.nodes.map((node) => ({ ...node, color: 'hsl(155, 78%, 60%)' })) || [],
  ], 'id');

  const nodeIdToNodeCount = nodes.reduce<Record<string, number>>((total, current) => {
    if (current.id) {
      total[current.id] = current.summary?.nrEntries || 0;
    }

    return total;
  }, {});

  const edges = uniqBy([
    ...data?.mostCriticalPath?.edges || [],
    ...data?.mostPopularPath?.edges || [],
  ], 'childNodeId').filter((edge) => edge.childNodeId in nodeIdToNodeCount);

  return (
    <>
      <UI.CardHead bg="red.50">
        <UI.Text color="red.500">
          Path summary
        </UI.Text>
      </UI.CardHead>
      <UI.CardBody>
        <div style={{ height: 300 }}>
          <ResponsiveSankey
            // @ts-ignore
            layout="vertical"
            labelOrientation="vertical"
            label={(d) => d.label}
            data={{
              nodes: nodes.map((node) => ({
                id: node.id,
                label: node.title,
                color: node.color,
              })),
              links: edges.map((edge) => ({
                source: edge.parentNodeId,
                target: edge.childNodeId,
                value: nodeIdToNodeCount[edge.childNodeId],
              })),
            }}
            colors={(d) => d.color}
            enableLinkGradient
          />
        </div>
      </UI.CardBody>
    </>
  );
};

