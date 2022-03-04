import { inputObjectType } from "@nexus/schema";

export const SliderValueInput = inputObjectType({
  name: 'SliderValueInput',
  description: 'Input type of a SessionEvent for Sliders.',

  definition(t) {
    // What is the slider value
    t.int('value', { required: true });
  }
})
