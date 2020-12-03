import { AnimatePresence, Variants, motion, transform,
  useAnimation, useMotionValue, useTransform } from 'framer-motion';
import { usePopper } from 'react-popper';
import { useTimer } from 'use-timer';
import Color from 'color';
import Lottie from 'react-lottie';
import React, { useEffect, useReducer, useState } from 'react';
import styled from 'styled-components';

import { Div, Flex, Text, Slider as UISlider } from '@haas/ui';
import { ReactComponent as FingerIcon } from 'assets/icons/icon-fingerprint.svg';
import { HAASIdle, HAASRun, HAASStopping } from 'assets/animations';
import { ReactComponent as HappyIcon } from 'assets/icons/icon-happy.svg';
import { ReactComponent as UnhappyIcon } from 'assets/icons/icon-unhappy.svg';

import { FingerPrintContainer, HAASRabbit, SlideHereContainer, SliderNodeValue } from './SliderNodeStyles';
import { SlideMeAnimation } from './SliderNodeAnimations';
import { SliderNodeMarkersProps } from '../../../../models/Tree/SliderNodeMarkersModel';
import { SliderText } from './SliderText';

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

const adaptColor = (colorHex: string) => {
  const color = Color(colorHex);

  if (color.isLight()) {
    return color.mix(Color('black'), 0.4).saturate(1).hex();
  }

  return color.mix(Color('white'), 0.4).saturate(1).hex();
};

const SliderSpeechWrapper = styled(Div)`
  > div {
    width: 100%;
    display: flex;
    align-items: center;

    border-radius: 30px;
    background: rgba(255, 255, 255, 0.5);
    backdrop-filter: blur(5px);
    padding: 12px;
    box-shadow: rgba(0, 0, 0, 0.08) 0px 4px 12px;

    &:hover {
      cursor: pointer;
    }
  }
`;

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
  markers: SliderNodeMarkersProps[];
}

const endTime = 40;
const initialWindUpSec = 2;

const Slider = ({ form, register, onSubmit, markers }: SliderProps) => {
  const [isValid, setIsValid] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [showIsEarly, setShowIsEarly] = useState(false);
  const animationControls = useAnimation();
  const timerProgressAbs = useMotionValue(0);

  const { start, reset } = useTimer({
    endTime,
    interval: 10,
    onTimeUpdate: (time) => {
      timerProgressAbs.set(time);
    },
    onTimeOver: () => {
      setIsComplete(true);
    },
  });

  // Initial timer for Client
  useTimer({
    endTime: initialWindUpSec,
    autostart: true,
    onTimeOver: () => {
      setIsValid(true);
    },
  });

  // Use-effect to submit: show the transition, and then submit the slider entry afterwards
  useEffect(() => {
    if (isComplete) {
      setTimeout(() => {
        onSubmit();
      }, 1000);
    }
  }, [isComplete, onSubmit]);

  //
  useEffect(() => {
    if (showIsEarly) {
      setIsValid(true);
    }
  }, [showIsEarly, setIsValid]);

  // Hardcoded
  const timerProgress = useTransform(timerProgressAbs, [0, endTime], [151, 202]);

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
    if (isValid && showIsEarly) {
      setShowIsEarly(false);
    }

    reset();
    const val = Number(event.currentTarget.value);
    animationControls.start('active');

    dispatchAnimationState({ type: 'run', payload: { position: val } });

    if (update) update();
  };

  const handleSubmit = () => {
    dispatchAnimationState({ type: 'idle' });

    if (!isValid) {
      setShowIsEarly(true);
    } else {
      start();
    }
  };

  const handleEarlyClick = () => {
    if (showIsEarly) {
      setIsComplete(true);
    }
  };

  const adaptedColor = adaptColor(sliderColor);

  const adjustedScore = (Math.round(sliderValue * 2) / 2);

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
        <SliderSpeechWrapper
          onClick={() => handleEarlyClick()}
          ref={setOverlay}
          style={{
            width: '250px',
            display: 'flex',
            ...styles.popper,
          }}
          {...attributes.popper}
        >
          {!animationState.isStopped && (
            <motion.div
              initial={{ opacity: 0, y: 70, x: 10 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.1 }}
            >
              <SliderNodeValue
                initial="initial"
                variants={sliderValueAnimeVariants}
                animate={animationControls}
              >
                <motion.svg viewBox="0 0 50 50">
                  <motion.circle
                    cx="25"
                    cy="25"
                    r="24"
                    style={{
                      strokeDashoffset: 453,
                      strokeDasharray: timerProgress,
                      fill: 'transparent',
                      stroke: sliderColor,
                      strokeWidth: '2px',
                    }}
                  />
                </motion.svg>

                <motion.span animate={{ color: sliderColor }} style={{ width: '100%' }}>
                  <AnimatePresence exitBeforeEnter>
                    {!isComplete ? (
                      <motion.div key="score" initial={{ y: 0 }} exit={{ y: -30 }} style={{ width: '100%' }}>
                        {adjustedScore.toFixed(1)}
                      </motion.div>
                    ) : (
                      <motion.div
                        style={{ background: sliderColor, color: adaptedColor }}
                        className="signal"
                        key="signal"
                        initial={{ y: 30 }}
                        animate={{ y: 0 }}
                      >
                        {sliderValue > 5 ? (
                          <HappyIcon />
                        ) : (
                          <UnhappyIcon />
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.span>
              </SliderNodeValue>
              <SliderText
                markers={markers}
                color={sliderColor}
                adaptedColor={adaptedColor}
                score={adjustedScore}
                isEarly={showIsEarly}
              />
            </motion.div>
          )}
        </SliderSpeechWrapper>
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
          data-cy="Slider"
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
