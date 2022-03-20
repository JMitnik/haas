import * as UI from '@haas/ui';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Polygon } from '@visx/shape';
import { Group } from '@visx/group';
import { Zoom } from '@visx/zoom';
import { localPoint } from '@visx/event';
import { motion } from 'framer-motion';

import { HexagonItem } from './HexagonItem';
import { DialogueStatisticsSummaryModel } from 'types/generated-types';
import { useEffect } from 'react';
import { ProvidedZoom } from '@visx/zoom/lib/types';

interface Dialogue {
  id: string;
  dialogueStatisticsSummary?: DialogueStatisticsSummaryModel | null;
}

export interface WorkspaceGridProps {
  data_L0: Dialogue[];
  data_L1?: any[];
  data_L2?: any[];
  width: number;
  height: number;
  backgroundColor: string;
}

export const WorkspaceGrid = ({ data_L0, data_L1, data_L2, width, height, backgroundColor }: WorkspaceGridProps) => {
  const { t } = useTranslation();
  const [zoomLevel, setZoomLevel] = React.useState(0);
  const [dataItems, setDataItems] = React.useState(data_L0);
  const hexSize = 40;
  const zoomHelper = React.useRef<ProvidedZoom<SVGElement> | null>(null);

  const maxZoomLevel = 1;
  const minZoomLevel = 0;
  const isAtMaxZoomLevel = zoomLevel === maxZoomLevel;
  const isAtMinZoomLevel = zoomLevel === minZoomLevel;

  const zoomToData: Record<number, any[]> = React.useMemo(() => ({
    0: data_L0,
    1: data_L1 || [],
    // 2: data_L2 || [],
  }), [data_L0, data_L1, data_L2]);

  const handleZoominLevel = (zoom: any) => {
    if (isAtMaxZoomLevel) return;

    // Empty canvas and unset soom
    setDataItems([]);
    zoom.reset();
    zoom.center();

    setZoomLevel(currentZoomLevel => currentZoomLevel + 1);
  }

  const handleZoomOut = () => {
    if (!zoomHelper.current) return;
    if (isAtMinZoomLevel) return;

    // Empty canvas and unset soom
    setDataItems([]);
    zoomHelper.current.reset();
    zoomHelper.current.center();
    setZoomLevel(currentZoomLevel => currentZoomLevel - 1);
  }

  useEffect(() => {
    const newData = zoomToData[zoomLevel];
    setDataItems(newData);
  }, [zoomLevel, zoomToData, setDataItems]);

  return (
    <UI.Div>
      {!isAtMinZoomLevel && (
        <UI.Button onClick={() => handleZoomOut()}>
          {t('go_back')}
        </UI.Button>
      )}
      <Zoom<SVGElement>
        width={width}
        height={height}
      >
        {(zoom) => {
          zoomHelper.current = zoom;
          return (
          <UI.Div>
            <svg
              width={width}
              height={height}
              style={{ cursor: zoom.isDragging ? 'grabbing' : 'grab', touchAction: 'none' }}
              // @ts-ignore
              ref={zoom.containerRef}
            >
              <rect width={width} height={height} fill={backgroundColor} />
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
                initial={{ transform: 'matrix(1, 0, 0, 1, 0, 0', opacity: 0 }}
                style={{ transform: "matrix(1, 0, 0, 1, 0, 0" }}
                animate={{ transform: zoom.toString(), opacity: 1 }}
              >
                <Group top={100} left={100}>
                  {dataItems?.map((dialogue, index) => (
                    <HexagonItem
                      key={dialogue.id}
                      top={index * hexSize * 0.9}
                      left={index * hexSize * 1.5}
                      score={dialogue?.dialogueStatisticsSummary?.impactScore || 0}
                      containerWidth={width}
                      containerHeight={height}
                      hexSize={hexSize}
                      zoomHelper={zoom}
                      onZoom={handleZoominLevel}
                      containerBackgroundFill={backgroundColor}
                    />
                  ))}
                </Group>
              </motion.g>
            </svg>
          </UI.Div>
          )
        }}
      </Zoom>
    </UI.Div>
  );
}
