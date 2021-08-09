import * as UI from '@haas/ui';
import { ResponsiveSunburst } from '@nivo/sunburst';
import React from 'react';

import { GetBranchStatisticsQuery, QuestionNode } from 'types/generated-types';

const findChildren = (currentNode: QuestionNode, nodes: QuestionNode[]): any => {
  if (!currentNode?.children.length) return [];

  const childNodes = currentNode.children.map(
    (childEdge) => nodes.find((node) => node.id === childEdge.childNodeId),
  ).filter((node) => !!node);

  return childNodes.map((childNode) => ({
    title: childNode?.title,
    count: childNode?.statistics?.count,
    // @ts-ignore
    children: findChildren(childNode, nodes).filter((node) => node.count > 0) || [],
  })).filter((node) => node?.count > 0);
};

const nestFlattenedNodes = (nodes: QuestionNode[]) => {
  const rootNode = nodes.find((node) => node.isRoot);
  if (!rootNode) return [];

  const children = findChildren(rootNode, nodes).flat();
  return children;
};

export const SunburstModule = ({ data }: { data: GetBranchStatisticsQuery }) => {
  const positiveBranch = data.customer?.dialogue?.statistics?.positiveBranch;
  const neutralBranch = data.customer?.dialogue?.statistics?.neutralBranch;
  const negativeBranch = data.customer?.dialogue?.statistics?.negativeBranch;
  // @ts-ignore
  const positiveNodes = nestFlattenedNodes(positiveBranch?.nodes || []);
  // @ts-ignore
  const neutralNodes = nestFlattenedNodes(neutralBranch?.nodes || []);
  // @ts-ignore
  const negativeNodes = nestFlattenedNodes(negativeBranch?.nodes || []);

  const rootNode = positiveNodes.find((node: QuestionNode) => node.isRoot);

  const sunbudrstData = {
    title: rootNode?.title,
    count: rootNode?.count,
    children: [
      { title: 'positive', children: positiveNodes },
      { title: 'neutral', children: neutralNodes },
      { title: 'negative', children: negativeNodes }],
  };

  console.log(sunbudrstData);

  return (
    <UI.Div height="400px">
      <ResponsiveSunburst
        data={sunbudrstData}
        margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
        id="title"
        value="count"
        cornerRadius={2}
        borderColor={{ theme: 'background' }}
        childColor={{ from: 'color', modifiers: [['brighter', 0.1]] }}
        enableArcLabels
        arcLabelsSkipAngle={10}
        arcLabelsTextColor={{ from: 'color', modifiers: [['darker', 1.4]] }}
      />
    </UI.Div>
  );
};
