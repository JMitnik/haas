import * as UI from '@haas/ui';
import {
  AnimatePresence, Variants, motion, transform,
  useAnimation, useTransform, useSpring,
} from 'framer-motion';
import { usePopper } from 'react-popper';
import { differenceInSeconds } from 'date-fns';
import { useTimer } from 'react-timer-hook';
import { useTranslation } from 'react-i18next';
import Lottie from 'react-lottie';
import React, { useEffect, useRef, useState } from 'react';
import { UseFormReturn } from 'react-hook-form';

import { SliderNodeMarkerType } from 'types/generated-types';
import HappyIcon from './icon-happy.svg';
import UnhappyIcon from './icon-unhappy.svg';
import FingerIcon from './icon-fingerprint.svg';

import * as LS from './SliderNodeStyles';
import { SlideMeAnimation } from './SliderNodeAnimations';
import { SliderText } from './SliderText';
import { useBunnySliderAnimation } from './useBunnySliderAnimation';

const adaptColor = (colorHex: string) => {
  const color = '#444';
  return '#ddd';

  // if (color.isLight()) {
    // return color.mix(Color('black'), 0.4).saturate(1).hex();
  // }

  // return '#ddd';
  // return color.mix(Color('white'), 0.4).saturate(1).hex();
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

interface SliderBunnyProps {
  form: UseFormReturn<{ slider: number }>;
  onSubmit: () => void;
  markers: SliderNodeMarkerType[];
  unhappyText: string | null | undefined;
  happyText: string | null | undefined;
}

// Number of seconds that are still too fast for a slide.
const earlyReleaseThresholdSeconds: number = 5;
const endTime: number = 5;

export const SliderBunny = ({ form, onSubmit, markers, happyText, unhappyText }: SliderBunnyProps) => {
  const { t } = useTranslation();
  const [isComplete, setIsComplete] = useState(false);
  const [showIsEarly, setShowIsEarly] = useState(false);
  const startDate = useRef(new Date());

  const animationControls = useAnimation();
  const timerProgressAbs = useSpring(endTime);

  const { animationState, dispatchAnimationState } = useBunnySliderAnimation();

  const { pause, restart, seconds } = useTimer({
    expiryTimestamp: new Date((new Date).getSeconds() + 15),
    autoStart: false,
    onExpire: () => {
      setIsComplete(true);
    },
  });

  useEffect(() => {
    timerProgressAbs.set(seconds);
  }, [timerProgressAbs, seconds]);

  // Use-effect to submit: show the transition, and then submit the slider entry afterwards
  useEffect(() => {
    if (isComplete) {
      setTimeout(() => {
        onSubmit();
      }, 1000);
    }
  }, [isComplete, onSubmit]);

  const timerProgress = useTransform(timerProgressAbs, [endTime, 0], [151, 202]);

  const sliderValue = Number(form.watch().slider / 10);
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

  /**
   * Move the bunny, and update the slider value.
   */
  const moveBunny = (event: React.FormEvent<HTMLInputElement>) => {
    const val = Number(event.currentTarget.value);
    form.setValue('slider', val);

    // Start the value bubble
    animationControls.start('active');

    // Start running the bunny
    dispatchAnimationState({ type: 'run', payload: { position: val } });

    // Pause the potential countdown of the the submission
    pause();

    // Update the position of the popper
    if (update) update();
  };

  /**
   * When the bunny is let go, try to start submission.
   */
  const handleBunnyRelease = () => {
    dispatchAnimationState({ type: 'idle' });

    const isNotEarly = differenceInSeconds(new Date(), startDate.current) > earlyReleaseThresholdSeconds;

    if (isNotEarly) {
      setShowIsEarly(false);

      // Start the submission countdown
      const time = new Date();
      time.setSeconds(time.getSeconds() + endTime);
      restart(time);
    } else {
      setShowIsEarly(true);
    }
  };

  /**
   * If the "early" message is shown, skip the early timeout.
   */
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
        <LS.SlideHereContainer variants={SlideMeAnimation} animate="animate" initial="initial" exit="exit">
          <UI.Flex
            data-testid="unhappy"
            alignItems="center"
          >
            <UnhappyIcon />
            <UI.Text fontSize="0.8rem">
              {unhappyText || t('unhappy')}
            </UI.Text>
          </UI.Flex>
          <UI.Flex alignItems="center" data-testid="happy">
            <UI.Text mr={1} fontSize="0.8rem">
              {happyText || t('happy')}
            </UI.Text>
            <HappyIcon />
          </UI.Flex>
        </LS.SlideHereContainer>
      )}

      <LS.HAASRabbit
        style={{
          left: `${animationState.position}%`,
          bottom: '10px',
          transform: 'translateX(-50%)',
        }}
        ref={setSliderRef}
      >
        <LS.SliderSpeechWrapper
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
          )}
        </LS.SliderSpeechWrapper>
        <UI.Div
          className="rabbit"
          style={{
            transform: `scaleX(${animationState.direction})`,
            zIndex: 1,
          }}
        >
          <Lottie
            isStopped={animationState.isStopped}
            options={{
              animationData: animationState.animationJson,
              loop: true,
            }}
            width={200}
            speed={animationState.speed}
          />
        </UI.Div>
      </LS.HAASRabbit>

      <UI.Slider
        data-testid="slider"
        data-cy="Slider"
        width={1}
        style={{ zIndex: 300 }}
        {...form.register('slider')}
        onChange={(e) => moveBunny(e)}
        onMouseUp={() => handleBunnyRelease()}
        onTouchEnd={() => handleBunnyRelease()}
        min={1}
        max={100}
        defaultValue={50}
      />

      {animationState.isStopped && (
        <LS.FingerPrintContainer
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
        </LS.FingerPrintContainer>
      )}

    </>
  );
};
