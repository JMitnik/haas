import styled, { css } from 'styled-components';
import { space, SpaceProps } from 'styled-system';

export const CheckBoxWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

export const CheckBoxLabel = styled.label`
  position: absolute;
  top: 0;
  left: 0;
  width: 42px;
  height: 26px;
  border-radius: 15px;
  background: #bebebe;
  cursor: pointer;
  &::after {
    content: "";
    display: block;
    border-radius: 50%;
    width: 18px;
    height: 18px;
    margin: 3px;
    background: #ffffff;
    box-shadow: 1px 3px 3px 1px rgba(0, 0, 0, 0.2);
    transition: 0.2s;
  }
`;

export const CheckBox = styled.input`
  opacity: 0;
  z-index: 1;
  border-radius: 15px;
  width: 42px;
  height: 26px;
  &:checked + ${CheckBoxLabel} {
    background: #3847B2;
    &::after {
      content: "";
      display: block;
      border-radius: 50%;
      width: 18px;
      height: 18px;
      margin-left: 21px;
      transition: 0.2s;
    }
  }
`;

export const Slider = styled.input.attrs({ type: 'range' })<SpaceProps>`
& {
  height: 25px;
  -webkit-appearance: none;
  margin: 10px 0;
  width: 100%;
}
&:focus {
  outline: none;
}
&::-webkit-slider-runnable-track {
  width: 100%;
  height: 5px;
  cursor: pointer;
  animate: 0.2s;
  box-shadow: 0px 0px 0px #000000;
  background: #E3E3E3;
  border-radius: 1px;
  border: 0px solid #000000;
}
&::-webkit-slider-thumb {
  box-shadow: 0px 0px 0px #000000;
  border: 1px solid #2497E3;
  height: 18px;
  width: 18px;
  border-radius: 25px;
  background: #FFFCFC;
  cursor: pointer;
  -webkit-appearance: none;
  margin-top: -7px;
}
&:focus::-webkit-slider-runnable-track {
  /* background: #E3E3E3; */
}
&::-moz-range-track {
  width: 100%;
  height: 5px;
  cursor: pointer;
  animate: 0.2s;
  box-shadow: 0px 0px 0px #000000;
  background: #E3E3E3;
  border-radius: 1px;
  border: 0px solid #000000;
}
&::-moz-range-thumb {
  box-shadow: 0px 0px 0px #000000;
  border: 1px solid #2497E3;
  height: 18px;
  width: 18px;
  border-radius: 25px;
  background: #FFFCFC;
  cursor: pointer;
}
&::-ms-track {
  width: 100%;
  height: 5px;
  cursor: pointer;
  animate: 0.2s;
  background: transparent;
  border-color: transparent;
  color: transparent;
}
&::-ms-fill-lower {
  background: #E3E3E3;
  border: 0px solid #000000;
  border-radius: 2px;
  box-shadow: 0px 0px 0px #000000;
}
&::-ms-fill-upper {
  background: #E3E3E3;
  border: 0px solid #000000;
  border-radius: 2px;
  box-shadow: 0px 0px 0px #000000;
}
&::-ms-thumb {
  margin-top: 1px;
  box-shadow: 0px 0px 0px #000000;
  border: 1px solid #2497E3;
  height: 18px;
  width: 18px;
  border-radius: 25px;
  background: #FFFCFC;
  cursor: pointer;
}
&:focus::-ms-fill-lower {
  background: #E3E3E3;
}
&:focus::-ms-fill-upper {
  background: #E3E3E3;
}`;

export const GridForm = styled.form`
  ${({ theme }) => css`
    display: grid;
    row-gap: 20px;
    column-gap: 10px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    padding: 10px;
  `}
`;
