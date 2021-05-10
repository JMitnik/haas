import { BlockPicker, ColorResult } from 'react-color';
import { Button } from '@chakra-ui/core';
import { Div } from '@haas/ui';
import React, { useRef, useState } from 'react';
import styled from 'styled-components';

import useOnClickOutside from 'hooks/useClickOnOutside';

const ColorPickerContainer = styled(Div)`
  position: absolute;
  z-index: 200;
`;

const ColorPickerInput = ({ onChange, value }: any) => {
  const [isOpenPicker, setIsOpenPicker] = useState(false);
  const pickerRef = useRef<HTMLDivElement | null>(null);
  useOnClickOutside(pickerRef, () => setIsOpenPicker(false));

  const handlePickerChange = (e: ColorResult) => {
    if (e.hex) onChange(e.hex);
  };

  return (
    <>
      <Div>
        <Button
          style={{ backgroundColor: value || 'auto' }}
          type="button"
          size="sm"
          onClick={() => setIsOpenPicker(!isOpenPicker)}
        >
          Primary
        </Button>

        <ColorPickerContainer data-testid="colorPicker" ref={pickerRef}>
          {isOpenPicker && (
          <BlockPicker color={value} onChange={(e) => handlePickerChange(e)} />
          )}
        </ColorPickerContainer>
      </Div>
    </>
  );
};

export default ColorPickerInput;
