import * as UI from '@haas/ui';
import {
  AnimatePresence, Variants, motion, transform,
  useAnimation, useMotionValue, useTransform,
} from 'framer-motion';
import { ChevronsLeft, ChevronsRight } from 'react-feather';
import { usePopper } from 'react-popper';
import { useTimer } from 'use-timer';
import { useWatch } from 'react-hook-form';
import Color from 'color';
import Lottie from 'react-lottie';
import React, { useEffect, useReducer, useState } from 'react';
import styled, { css } from 'styled-components';

import { HAASIdle, HAASRun, HAASStopping } from 'assets/animations';
import { ReactComponent as HappyIcon } from 'assets/icons/icon-happy.svg';
import { Marker } from 'types/core-types';
import { ReactComponent as UnhappyIcon } from 'assets/icons/icon-unhappy.svg';

import * as LS from './SliderNodeStyles';
import { ExplainSlideLeftAnimation, ExplainSlideRightAnimation } from './SliderNodeAnimations';
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
const AdjustedColourWrapper = styled(UI.Div)`
  ${({ theme }) => css`
    font-weight: 600;
    color: ${Color(theme.colors.primary).isDark()
    ? Color(theme.colors.primary).mix(Color('white'), 0.9).saturate(1).hex()
    : Color(theme.colors.primary).mix(Color('black'), 0.5).saturate(1).hex()};
  `}
`;

const SliderSpeechWrapper = styled(UI.Div)`
  > div {
    width: 100%;
    display: flex;
    align-items: center;

    border-radius: 30px;
    background: rgba(255, 255, 255, 0.75);
    backdrop-filter: blur(5px);
    padding: 12px;
    box-shadow: rgba(0, 0, 0, 0.08) 0px 4px 12px;

    &:hover {
      cursor: pointer;
    }
  }
`;

const sliderValueAnimeVariants: Variants = {
  active: {
    opacity: 1,
    y: 0,
  },
};

interface SliderProps {
  form: any;
  register: any;
  onSubmit: () => void;
  markers: Marker[];
  unhappyText: string | null | undefined;
  happyText: string | null | undefined;
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

  const sliderValueWatch = useWatch({
    control: form.control,
    name: 'slider',
  });

  // Hardcoded
  const timerProgress = useTransform(timerProgressAbs, [0, endTime], [151, 202]);

  const sliderValue = Number(sliderValueWatch as number / 10);
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
      <LS.HAASRabbit
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
          <motion.div
            initial={{ opacity: 0, y: 70, x: 10 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.1 }}
          >
            <LS.SliderNodeValue
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
            </LS.SliderNodeValue>
            <SliderText
              markers={markers}
              color={sliderColor}
              adaptedColor={adaptedColor}
              score={adjustedScore}
              isEarly={showIsEarly}
            />
          </motion.div>
        </SliderSpeechWrapper>
        <div
          className="rabbit"
          style={{
            position: 'relative',
            transform: `scaleX(${animationState.direction})`,
          }}
        >
          {animationState.isStopped && (
            <>
              <UI.Flex
                width="100%"
                position="absolute"
                bottom="20px"
                left="50%"
                justifyContent="space-between"
                style={{ transform: 'translateX(-62.5px)' }}
              >
                <motion.div variants={ExplainSlideLeftAnimation} animate="animate" initial="initial" exit="exit">
                  <AdjustedColourWrapper>
                    <ChevronsLeft />
                  </AdjustedColourWrapper>
                </motion.div>

              </UI.Flex>

              <UI.Flex
                width="100%"
                position="absolute"
                bottom="20px"
                left="50%"
                justifyContent="space-between"
                style={{ transform: 'translateX(35px)' }}
              >
                <motion.div variants={ExplainSlideRightAnimation} animate="animate" initial="initial" exit="exit">
                  <AdjustedColourWrapper>
                    <ChevronsRight />
                  </AdjustedColourWrapper>
                </motion.div>
              </UI.Flex>

            </>
          )}
          <Lottie
            isStopped={animationState.isStopped}
            options={{
              animationData: animationState.animationJson,
              loop: true,
            }}
            speed={animationState.speed}
          />
        </div>
      </LS.HAASRabbit>

      <UI.Div position="relative">
        <UI.Slider
          data-testid="slider"
          data-cy="Slider"
          width={1}
          name="slider"
          style={{ zIndex: 300, height: 90, opacity: 0, cursor: 'pointer' }}
          onChange={(e) => moveBunny(e)}
          onMouseUp={() => handleSubmit()}
          onTouchEnd={() => handleSubmit()}
          min={1}
          max={100}
          defaultValue={50}
          ref={register}
        />
        <LS.PseudoSliderTrack style={{
          height: 15, position: 'absolute', bottom: 0, left: 0, right: 0,
        }}
        />

        <UI.Flex width="100%" position="absolute" bottom="-20px" justifyContent="space-between">
          <AdjustedColourWrapper>
            0
          </AdjustedColourWrapper>
          <AdjustedColourWrapper style={{ transform: 'translateX(7.5px)' }}>
            10
          </AdjustedColourWrapper>
        </UI.Flex>
      </UI.Div>
    </>
  );
};

export default Slider;
