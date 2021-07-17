import { ColorProps, color } from 'styled-system';
import { Div } from '@haas/ui';
import styled, { css } from 'styled-components';

export const SocialShareNodeContainer = styled(Div)``;

export const ShareItem = styled.a<ColorProps>`
  ${({ theme }) => css`
    ${color}
    display: inline-block;
    --btn-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);
    --btn-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(1px + var(--tw-ring-offset-width)) var(--tw-ring-color);
    --btn-shadow: 0 4px 6px -1px rgba(0,0,0,0.1),0 2px 4px -1px rgba(0,0,0,0.06);
    box-shadow: var(--btn-shadow),var(--btn-ring-shadow),var(--tw-shadow,0 0 #0000);
    border-radius: 10px;
    padding: 4px 6px;

    @media ${theme.media.mob} {
      margin-right: ${theme.gutter / 2}px;
    }
  `}
`;

export const ShareDrawerContainer = styled.div`
  backdrop-filter: blur(16px) saturate(180%);
  -webkit-backdrop-filter: blur(16px) saturate(180%);
  background-color: rgba(17, 25, 40, 0.60);
  border-radius: 10px 10px 10px 10px;
  padding: 30px;
  margin-bottom: -5vh;
  color: white;
  font-weight: 600;
  font-size: 1.1rem;
  border: 1px solid rgba(255, 255, 255, 0.125);

  a {

  }
`;

export const LinkContainer = styled.div``;

export const LinkRows = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  grid-gap: 12px;

  margin-bottom: 12px;
`;
export const LinkRowContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
