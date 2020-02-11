import React from 'react';
import { H1, H5, Slider, Flex, ColumnFlex, Button, Div } from '@haas/ui';
import { useFormContext } from 'react-hook-form';
import { useJSONTree, MultiChoiceOption } from '../hooks/use-json-tree';
import { Instagram } from 'react-feather';
import { useTransition, animated } from 'react-spring';
import styled, { css } from 'styled-components';


const SignInContainer = styled.div`
  ${({ theme }) => css`
    ${Button} {
      right: 0;
      position: absolute;
      top: 1px;
      right: 0;
      bottom: 1px;
      border-radius: 0 30px 30px 0;
      border: 1px solid ${theme.colors.default.lightest};
      line-height: 100%;
    }

    input {
      border-radius: 30px;
      border: 1px solid ${theme.colors.primary};
      font-size: ${theme.fontSizes[1]}px;
      padding: 36px 48px;
      width: 100%;
      resize: none;
    }
  `}
`;


export const HAASSignIn = () => {
  return (
    <SignInContainer>
      <label htmlFor="email">
        <input id="email" type="email"></input>
      </label>

      <Button brand="secondary" onClick={() => console.log('clicked')}>Submit</Button>
    </SignInContainer>
  );
}
