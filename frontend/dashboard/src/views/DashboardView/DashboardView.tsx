import React from 'react';
import * as UI from '@haas/ui';
import { useTranslation } from 'react-i18next';
import { Polygon } from '@visx/shape';
import { Group } from '@visx/group';
import { Zoom } from '@visx/zoom';
import { localPoint } from '@visx/event';
import { motion } from 'framer-motion';

import { useGetWorkspaceDialogueStatisticsQuery } from 'types/generated-types';
import { useCustomer } from 'providers/CustomerProvider';
import useElementSize from 'hooks/useElementSize';
import { useState } from 'react';
import { useEffect } from 'react';
import { HexagonItem } from './HexagonItem';

export const DashboardView = () => {
  const { t } = useTranslation();
  const { activeCustomer } = useCustomer();
  const [gridData, setGridData] = useState<any[]>([]);

  // const [ref] = useElementSize()
  const height = 600;
  const width = 500;

  const { data } = useGetWorkspaceDialogueStatisticsQuery({
    variables: {
      startDateTime: '01-01-2022',
      endDateTime: '01-07-2022',
      workspaceId: activeCustomer?.id || '',
    },
    fetchPolicy: 'cache-and-network',
  });
  const dialogues = data?.customer?.dialogues || [];
  const dialoguesCloneSlice = dialogues.map(dialogue => ({
    ...dialogue,
    dialogueStatisticsSummary: {
      ...dialogue.dialogueStatisticsSummary,
      impactScore: 10,
    },
  }));

  const dialogueLayerTwo = [...dialoguesCloneSlice, ...dialoguesCloneSlice];

  useEffect(() => {
    setGridData(dialogues);
  }, [dialogues]);

  const hexSize = 50;

  const zoominLevel = (zoom: any) => {
    // Empty canvas and unset soom
    setGridData([]);
    zoom.reset();
    zoom.center();

    // Set and fetch new data.
    setGridData(dialogueLayerTwo);
  }

  return (
    <>
      <UI.ViewHead>
          <UI.ViewTitle>{t('views:dashboard')}</UI.ViewTitle>
        </UI.ViewHead>
        <UI.ViewBody>
          <Zoom<SVGElement>
            width={width}
            height={height}
          >
            {(zoom) => (
              <svg
                width={width}
                height={height}
                style={{ cursor: zoom.isDragging ? 'grabbing' : 'grab', touchAction: 'none' }}
                // @ts-ignore
                ref={zoom.containerRef}
                >
                <rect width={width} height={height} fill="#e9eff5" />
                <rect
                width={width}
                height={height}
                rx={14}
                fill="transparent"
                onTouchStart={zoom.dragStart}
                onTouchMove={zoom.dragMove}
                onTouchEnd={zoom.dragEnd}
                onMouseDown={zoom.dragStart}
                onMouseMove={zoom.dragMove}
                onMouseUp={zoom.dragEnd}
                onMouseLeave={() => {
                  if (zoom.isDragging) zoom.dragEnd();
                }}
                onDoubleClick={(event) => {
                  zoom.scale({ scaleX: 1.1, scaleY: 1.1 });
                }}
              />
                <motion.g
                  initial={{ transform: 'auto', opacity: 0 }}
                  animate={{ transform: zoom.toString(), opacity: 1 }}
                >
                  <Group top={100} left={100}>
                  {gridData?.map((dialogue, index) => (
                    <HexagonItem
                      key={dialogue.id}
                      top={index * hexSize * 0.9}
                      left={index * hexSize * 1.5}
                      score={dialogue?.dialogueStatisticsSummary?.impactScore || 0}
                      containerWidth={width}
                      containerHeight={height}
                      hexSize={hexSize}
                      zoomHelper={zoom}
                      onZoom={zoominLevel}
                    />
                  ))}
                </Group>
                </motion.g>
              </svg>
            )}
          </Zoom>
        </UI.ViewBody>
    </>
  )
}
