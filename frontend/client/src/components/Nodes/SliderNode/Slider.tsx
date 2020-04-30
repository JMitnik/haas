import React, { forwardRef, useReducer } from 'react';
import { HAASIdle, HAASRun, HAASStopping } from 'assets/animations';
import Lottie from 'react-lottie';
import { Slider as UISlider } from '@haas/ui';
import { HAASRabbit } from './SliderNodeStyles';
import { AnimationControls } from 'framer-motion';

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
  isStopped: false,
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
  const [animationState, dispatchAnimationState] = useReducer((state: SliderAnimationStateProps, action: SliderAnimationActionType): SliderAnimationStateProps => {
    switch(action.type) {
      case 'idle':
        return {
          speed: 2.0,
          animationJson: HAASIdle,
          isStopped: state.isStopped,
          direction: state.direction,
          position: state.position
        }

      case 'run':
        let direction = state.direction;
        const { position } = action.payload;

        if (position && position < state.position) {
          direction = -1;
        }

        if (position && position > state.position) {
          direction = 1;
        }

        console.log('position', position);
        return {
          speed: 1.0,
          animationJson: HAASRun,
          isStopped: false,
          direction: direction,
          position: position ?? state.position
        }

      case 'stop':
        return {
          speed: 0.0,
          animationJson: HAASStopping,
          isStopped: true,
          direction: state.direction,
          position: state.position,
        }

      default:
        return state;
    }
  }, defaultSliderAnimationState);

  const moveBunny = (event: React.FormEvent<HTMLInputElement>) => {
    const val = Number(event.currentTarget.value);
    animationControls.start('active');

    dispatchAnimationState({ type: 'run', payload: { position: val } })
  }

  const handleSubmit = () => {
    dispatchAnimationState({ type: 'idle' });
    onSubmit();
  }

  return (
      <>
        <HAASRabbit style={{
          left: `${animationState.position}%`,
          transform: `translateX(-50%) scaleX(${animationState.direction})`
        }}>
          <Lottie
            isStopped={animationState.isStopped}
            options={{
              animationData: animationState.animationJson,
              loop: true,

            }}
            speed={animationState.speed}
          />
        </HAASRabbit>
        <form>
          <UISlider
            width={1}
            name="numberValue"
            onChange={(e) => moveBunny(e)}
            onMouseUp={() => handleSubmit()}
            min={0}
            max={100}
            defaultValue={50}
            ref={register}
          />
        </form>
      </>
  );
}


export default Slider;
