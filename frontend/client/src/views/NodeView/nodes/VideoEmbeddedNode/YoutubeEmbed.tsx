import { Div } from '@haas/ui';
import { Spinner } from '@chakra-ui/core';
import Color from 'color';
import React from 'react';
import YouTube from 'react-youtube';
import styled, { css } from 'styled-components';

const DrawerContainer = styled(Div)`
  position: relative;
${({ theme }) => css`
  background: linear-gradient(45deg, ${Color(theme.colors.primary).lighten(0.3).hex()}, ${Color(theme.colors.primary).lighten(0.3).saturate(1).hex()});
  padding: 24px;
  border-radius: 30px;
  box-shadow: rgba(0, 0, 0, 0.15) 0px 15px 25px, rgba(0, 0, 0, 0.05) 0px 5px 10px;
  backdrop-filter: blur(10px);
`}`;

const LoadingContainer = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translateX(-50%);
`;

const IframeContainer = styled.div`
  overflow: hidden;
  padding-bottom: 56.25%;
  position: relative;
  height: 0;

  iframe {
    left: 0;
    top: 0;
    height: 100%;
    width: 100%;
    position: absolute;
  }
`;

type MyProps = { videoId: string };
type MyState = { isVideoReady: boolean };

class YoutubeEmbed extends React.Component<MyProps, MyState> {
  constructor(props: any) {
    super(props);
    this.state = { isVideoReady: false };
  }

  // eslint-disable-next-line class-methods-use-this
  onReady = (event: any) => {
    // access to player in all event handlers via event.target
    console.log('Youtube ready');
    event.target.pauseVideo();

    this.setState({
      isVideoReady: true,
    });
  };

  render() {
    const opts = {
      height: '853',
      width: '480',
    };

    const { isVideoReady } = this.state;
    const { videoId } = this.props;

    return (
      <DrawerContainer>
        <IframeContainer>
          <YouTube videoId={videoId} opts={opts} onReady={this.onReady} />
        </IframeContainer>
        {!isVideoReady && <LoadingContainer><Spinner /></LoadingContainer>}
      </DrawerContainer>
    );
  }
}

export default YoutubeEmbed;
