import { AnimationControls } from 'framer-motion';
import Lottie from 'react-lottie';
import React, { useReducer } from 'react';

import { ReactComponent as FingerIcon } from 'assets/icons/icon-fingerprint.svg';
import { Flex, Text, Slider as UISlider } from '@haas/ui';
import { HAASIdle, HAASRun, HAASStopping } from 'assets/animations';
import { ReactComponent as HappyIcon } from 'assets/icons/icon-happy.svg';
import { ReactComponent as UnhappyIcon } from 'assets/icons/icon-unhappy.svg';

import { FingerPrintContainer, HAASRabbit, SlideHereContainer } from './SliderNodeStyles';
import { SlideMeAnimation } from './SliderNodeAnimations';

interface SliderAnimationStateProps {
  isStopped: boolean;
  speed: number;
  direction: number;
  position: number;
  animationJson: any;
}

interface AnimationPayload {
  speed?: number;
  position?: number
}

type SliderAnimationActionType =
| { type: 'idle', payload?: AnimationPayload }
| { type: 'run', payload: AnimationPayload }
| { type: 'stop', payload?: AnimationPayload };

const defaultSliderAnimationState: SliderAnimationStateProps = {
  isStopped: true,
  speed: 2.0,
  direction: 1.0,
  position: 50,
  animationJson: HAASIdle,
};

interface SliderProps {
  register: any;
  onSubmit: () => void;
  animationControls: AnimationControls;
}

const Slider = ({ register, onSubmit, animationControls }: SliderProps) => {
  const [animationState, dispatchAnimationState] = useReducer((
    state: SliderAnimationStateProps,
    action: SliderAnimationActionType,
  ): SliderAnimationStateProps => {
    switch (action.type) {
      case 'idle': {
        return {
          speed: 2.0,
          animationJson: HAASIdle,
          isStopped: state.isStopped,
          direction: state.direction,
          position: state.position,
        };
      }

      case 'run': {
        let { direction } = state;
        const { position } = action.payload;

        if (position && position < state.position) {
          direction = -1;
        }

        if (position && position > state.position) {
          direction = 1;
        }

        return {
          speed: 1.0,
          animationJson: HAASRun,
          isStopped: false,
          direction,
          position: position ?? state.position,
        };
      }
      case 'stop': {
        return {
          speed: 0.0,
          animationJson: HAASStopping,
          isStopped: true,
          direction: state.direction,
          position: state.position,
        };
      }

      default: return state;
    }
  }, defaultSliderAnimationState);

  const moveBunny = (event: React.FormEvent<HTMLInputElement>) => {
    const val = Number(event.currentTarget.value);
    animationControls.start('active');

    dispatchAnimationState({ type: 'run', payload: { position: val } });
  };

  const handleSubmit = () => {
    dispatchAnimationState({ type: 'idle' });
    onSubmit();
  };

  return (
    <>
      {animationState.isStopped && (
      <SlideHereContainer variants={SlideMeAnimation} animate="animate" initial="initial" exit="exit">
        <Flex alignItems="center">
          <UnhappyIcon />
          <Text fontSize="0.8rem">
            Unhappy
          </Text>
        </Flex>
        <Flex alignItems="center">
          <Text mr={1} fontSize="0.8rem">
            Happy
          </Text>
          <HappyIcon />
        </Flex>
      </SlideHereContainer>
      )}
      <HAASRabbit style={{
        left: `${animationState.position}%`,
        bottom: '10px',
        transform: `translateX(-50%) scaleX(${animationState.direction})`,
      }}
      >
        <div className="rabbit">
          <Lottie
            isStopped={animationState.isStopped}
            options={{
              animationData: animationState.animationJson,
              loop: true,
            }}
            speed={animationState.speed}
          />
        </div>
      </HAASRabbit>
      <form>
        <UISlider
          width={1}
          name="slider"
          style={{ zIndex: 300 }}
          onChange={(e) => moveBunny(e)}
          onMouseUp={() => handleSubmit()}
          onTouchEnd={() => handleSubmit()}
          min={1}
          max={100}
          defaultValue={50}
          ref={register}
        />
      </form>

      {animationState.isStopped && (
        <FingerPrintContainer
          animate={{
            marginLeft: ['0%', '30%', '0%', '-30%', '0%', '0%'],
            opacity: [0, 1, 1, 1, 0.5, 0],
            transition: {
              mass: 0.2,
              loop: Infinity,
              delay: 1,
              repeatDelay: 3,
              duration: 2.8,
            },
          }}
        >
          <FingerIcon />
        </FingerPrintContainer>
      )}

    </>
  );
};

export default Slider;
