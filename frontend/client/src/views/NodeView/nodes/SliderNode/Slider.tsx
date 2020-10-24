import { AnimationControls, Variants, motion, transform, useAnimation } from 'framer-motion';
import Color from 'color';
import Lottie from 'react-lottie';
import React, { useReducer, useState } from 'react';

import { Div, Flex, Text, Slider as UISlider } from '@haas/ui';
import { ReactComponent as FingerIcon } from 'assets/icons/icon-fingerprint.svg';
import { HAASIdle, HAASRun, HAASStopping } from 'assets/animations';
import { ReactComponent as HappyIcon } from 'assets/icons/icon-happy.svg';
import { ReactComponent as UnhappyIcon } from 'assets/icons/icon-unhappy.svg';

import { FingerPrintContainer, HAASRabbit, SlideHereContainer, SliderNodeValue } from './SliderNodeStyles';
import { SlideMeAnimation } from './SliderNodeAnimations';
import { usePopper } from 'react-popper';

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

const sliderValueAnimeVariants: Variants = {
  initial: {
    opacity: 0,
    transform: 'scale(1)',
  },
  active: {
    opacity: 1,
    y: 0,
  },
};

interface SliderProps {
  form: any;
  register: any;
  onSubmit: () => void;
}

const Slider = ({ form, register, onSubmit }: SliderProps) => {
  const animationControls = useAnimation();
  const sliderValue = Number(form.watch({ nest: true }).slider / 10);
  const sliderColor = transform(sliderValue, [0, 5, 10], ['#E53E3E', '#F6AD55', '#38B2AC']);

  const [overlay, setOverlay] = useState<HTMLDivElement | null>(null);
  const [sliderRef, setSliderRef] = useState<HTMLDivElement | null>(null);
  const { styles, attributes, update } = usePopper(sliderRef, overlay, {
    placement: 'top',
    modifiers: [{
      name: 'offset',
      options: {
        offset: [30, 0],
      },
    }],
  });

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

    if (update) update();
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

      <HAASRabbit
        style={{
          left: `${animationState.position}%`,
          bottom: '10px',
          transform: 'translateX(-50%)',
        }}
        ref={setSliderRef}
      >
        <Div
          ref={setOverlay}
          style={{
            width: '200px',
            ...styles.popper,
          }}
          {...attributes.popper}
        >
          <SliderNodeValue initial="initial" variants={sliderValueAnimeVariants} animate={animationControls}>
            <motion.p animate={{ color: sliderColor, borderColor: Color(sliderColor).lighten(0.3).hex() }}>
              {sliderValue.toFixed(0)}
            </motion.p>
          </SliderNodeValue>
        </Div>
        <div
          className="rabbit"
          style={{
            transform: `scaleX(${animationState.direction})`,
          }}
        >
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
          // onMouseUp={() => handleSubmit()}
          // onTouchEnd={() => }
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
