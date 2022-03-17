import * as UI from '@haas/ui';
import {
  AnimatePresence, Variants, motion, transform,
  useAnimation, useTransform, useSpring,
} from 'framer-motion';
import { usePopper } from 'react-popper';
import { differenceInSeconds } from 'date-fns';
import { useTranslation } from 'react-i18next';
import Lottie from 'react-lottie';
import React, { useEffect, useRef, useState } from 'react';
import { UseFormReturn } from 'react-hook-form';

import { SliderNodeMarkerType } from '../../types/generated-types';
import UnhappyIcon from './icon-unhappy.svg';
import HappyIcon from './icon-happy.svg';
import * as LS from './SliderNodeStyles';
import FingerIcon from './icon-fingerprint.svg';
import { SlideMeAnimation } from './SliderNodeAnimations';
import { SliderText } from './SliderText';
import { useBunnySliderAnimation } from './useBunnySliderAnimation';
import { useCountDown } from '../../hooks/useCountDown';
import { linearSpring } from '../../animations/springConfigs';
import { lighten } from '../Theme/colorUtils';

const adaptColor = (colorHex: string) => {
  return lighten(colorHex, 0.6);
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
const earlyReleaseThresholdSeconds = 3;
const timerNrSeconds = 2;

export const SliderBunny = ({ form, onSubmit, markers, happyText, unhappyText }: SliderBunnyProps) => {
  const { t } = useTranslation();
  const [isComplete, setIsComplete] = useState(false);
  const [showIsEarly, setShowIsEarly] = useState(false);
  const startDate = useRef(new Date());
  const [hasStarted, setHasStarted] = useState(false);

  const animationControls = useAnimation();

  const { animationState, dispatchAnimationState } = useBunnySliderAnimation();

  // TODO: Replace with useTime hook from framer-motion?
  const { timeLeft, start } = useCountDown(timerNrSeconds * 1000);

  const timerProgressAbs = useSpring(0, linearSpring);
  const timerProgress = useTransform(timerProgressAbs, [0, timerNrSeconds * 1000], [202, 151]);

  useEffect(() => {
    if (timeLeft === 0) {
      setIsComplete(true);
    }
  }, [timeLeft, setIsComplete]);

  useEffect(() => {
    timerProgressAbs.set(timeLeft);
  }, [timerProgressAbs, timeLeft]);

  // Use-effect to submit: show the transition, and then submit the slider entry afterwards
  useEffect(() => {
    if (isComplete) {
      setTimeout(() => {
        onSubmit();
      }, 1000);
    }
  }, [isComplete, onSubmit]);

  const sliderValue = Number(form.watch().slider / 10);
  const adjustedScore = (Math.round(sliderValue * 2) / 2);

  const sliderColor = transform(sliderValue, [0, 5, 10], ['#E53E3E', '#F6AD55', '#38B2AC']);
  const adaptedColor = adaptColor(sliderColor);

  // Dropdown
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
  const moveBunny = async (event: React.FormEvent<HTMLInputElement>) => {
    setHasStarted(true);
    const val = Number(event.currentTarget.value);
    form.setValue('slider', val);

    // Start the value bubble
    void animationControls.start('active');

    // Start running the bunny
    dispatchAnimationState({ type: 'run', payload: { position: val } });

    // Pause the potential countdown of the submission
    stop();

    // Update the position of the popper
    if (update) await update();
  };

  /**
   * When the bunny is let go, try to start submission.
   */
  const handleBunnyRelease = () => {
    dispatchAnimationState({ type: 'idle' });

    const isNotEarly = differenceInSeconds(new Date(), startDate.current) > earlyReleaseThresholdSeconds;

    if (isNotEarly) {
      setShowIsEarly(false);
      start();
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


  return (
    <>
      {animationState.isStopped && (
        <LS.SlideHereContainer variants={SlideMeAnimation} animate="animate" initial="initial" exit="exit">
          <UI.Flex
            data-testid="unhappy"
            alignItems="center"
          >
            <UnhappyIcon/>
            <UI.Text fontSize="0.8rem">
              {unhappyText || t('unhappy')}
            </UI.Text>
          </UI.Flex>
          <UI.Flex alignItems="center" data-testid="happy">
            <UI.Text mr={1} fontSize="0.8rem">
              {happyText || t('happy')}
            </UI.Text>
            <HappyIcon/>
          </UI.Flex>
        </LS.SlideHereContainer>
      )}

      <LS.HAASRabbit
        style={{
          left: `${animationState.position}%`,
          bottom: '10px',
          transform: 'translateX(-50%)',
          pointerEvents: 'none',
          cursor: 'pointer',
        }}
        ref={setSliderRef}
        onClick={() => handleEarlyClick()}
      >
        <LS.SliderSpeechWrapper
          isOpen={hasStarted}
          onClick={() => handleEarlyClick()}
          ref={setOverlay}
          style={{
            width: '250px',
            display: 'flex',
            ...styles.popper,
          }}
          {...attributes.popper}
        >
          <LS.InnerSpeechWrapper>
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
                            <HappyIcon/>
                          ) : (
                            <UnhappyIcon/>
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
          </LS.InnerSpeechWrapper>
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

      <UI.Div position="relative">
        <UI.Slider
          data-testid="slider"
          data-cy="Slider"
          width={1}
          style={{ zIndex: 300, height: 90, opacity: 0, cursor: 'pointer' }}
          {...form.register('slider')}
          onChange={(e) => moveBunny(e)}
          onMouseUp={() => handleBunnyRelease()}
          onTouchEnd={() => handleBunnyRelease()}
          min={1}
          max={100}
          defaultValue={50}
        />

        <LS.PseudoSliderTrack style={{ height: 15, position: 'absolute', bottom: 0, left: 0, right: 0 }}/>
      </UI.Div>

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
          <FingerIcon/>
        </LS.FingerPrintContainer>
      )}

    </>
  );
};
