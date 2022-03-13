import { Spinner } from '@chakra-ui/core';
import React, { useState } from 'react';
import YouTube from 'react-youtube';

import * as LS from './VideoNode.styles';

interface YoutubeEmbedProps {
  videoId: string | null;
}

export const YoutubeEmbed = ({ videoId }: YoutubeEmbedProps) => {
  const [isReady, setIsReady] = useState(false);

  const onReady = () => {
    setIsReady(true);
  }

  const videoOptions = {
    height: '853',
    width: '480',
  };

  return (
    <LS.DrawerContainer>
      <LS.IframeContainer>
        <YouTube videoId={videoId || undefined} opts={videoOptions} onReady={onReady} />
      </LS.IframeContainer>

      {!isReady && <LS.LoadingContainer><Spinner /></LS.LoadingContainer>}
    </LS.DrawerContainer>
  );
};
