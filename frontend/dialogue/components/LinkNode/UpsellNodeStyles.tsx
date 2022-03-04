import * as UI from '@haas/ui';
import Color from 'color';
import styled, { css } from 'styled-components';

export const DrawerContainer = styled(UI.Div)`
  ${({ theme }) => css`
    width: 100%;
    display: grid;
    row-gap: 2em;
    background: white;
      //background: ${Color(theme.colors.primary).mix(Color('white'), 0.9).saturate(1).hex()};
    text-align: center;

    padding: 24px;
    border-radius: 30px;
    box-shadow: rgba(0, 0, 0, 0.15) 0px 15px 25px, rgba(0, 0, 0, 0.05) 0px 5px 10px;
    backdrop-filter: blur(10px);
    max-width: 600px;
  `}
`;

export const TextGradient = styled(UI.Div)`
  ${({ theme }) => css`
    color: ${Color(theme.colors.primary).isDark() ? Color(theme.colors.primary).hex() : Color(theme.colors.primary).mix(Color('black'), 0.5).saturate(1).hex()};
  `}
`;

export const HeaderContainer = styled(TextGradient)`
  font-size: 1.5em;
  font-weight: bold;
`;

export const SubheaderContainer = styled(TextGradient)`
  font-size: 1em;
  font-weight: 100;
  max-width: 300px;
`;

export const ImageContainer = styled(UI.Div)`
  display: flex;
  justify-content: center;

  img {
    max-height: 200px;
    object-fit: contain;
  }
`;

interface RedirectButtonProps {
  overrideBackgroundColor?: string;
}

export const RedirectButton = styled.a<RedirectButtonProps>`
  ${({ theme, overrideBackgroundColor }) => css`
    display: flex;
    align-items: center;

    max-width: fit-content;
    font-weight: bold;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.05);
    border-radius: 5px;
    padding: 12px 32px;

    text-decoration: none;

    background: linear-gradient(45deg, ${Color(theme.colors.primary).lighten(0.3).hex()}, ${Color(theme.colors.primary).lighten(0.3).saturate(1).hex()});
    font-family: 'Inter', sans-serif;
    color: ${Color(theme.colors.primary).isDark() ? Color(theme.colors.primary).mix(Color('white'), 0.8).saturate(1).hex() : Color(theme.colors.primary).mix(Color('black'), 0.5).saturate(1).hex()};

    :hover {
      cursor: pointer;
      color: ${Color(theme.colors.primary).isDark() ? Color('white').hex() : Color(theme.colors.primary).mix(Color('black'), 0.5).saturate(1).hex()};
    }

    ${overrideBackgroundColor && css`
      background: linear-gradient(45deg, ${Color(overrideBackgroundColor).lighten(0.3).hex()}, ${Color(overrideBackgroundColor).lighten(0.3).saturate(1).hex()});
      font-family: 'Inter', sans-serif;
      color: ${Color(overrideBackgroundColor).isDark() ? Color(overrideBackgroundColor).mix(Color('white'), 0.8).saturate(1).hex() : Color(overrideBackgroundColor).mix(Color('black'), 0.5).saturate(1).hex()};

      :hover {
        cursor: pointer;
        color: ${Color(overrideBackgroundColor).isDark() ? Color('white').hex() : Color(overrideBackgroundColor).mix(Color('black'), 0.5).saturate(1).hex()};
      }
    `}
  `}
`;

export const ButtonIconContainer = styled(UI.Div) <RedirectButtonProps>`
  //TODO: Adjust color of custom icon using inverse CSS property (?)
  ${({ theme, overrideBackgroundColor }) => css`
    img {
      color: ${Color(theme.colors.primary).isDark() ? Color(theme.colors.primary).mix(Color('white'), 0.8).saturate(1).hex() : Color(theme.colors.primary).mix(Color('black'), 0.5).saturate(1).hex()};
      width: 24px;
      height: auto
    }

    svg {
      color: ${Color(theme.colors.primary).isDark() ? Color(theme.colors.primary).mix(Color('white'), 0.8).saturate(1).hex() : Color(theme.colors.primary).mix(Color('black'), 0.5).saturate(1).hex()};
      width: 24px;
      height: auto;
    }

    ${overrideBackgroundColor && css`
      img {
        color: ${Color(overrideBackgroundColor).isDark() ? Color(overrideBackgroundColor).mix(Color('white'), 0.8).saturate(1).hex() : Color(overrideBackgroundColor).mix(Color('black'), 0.5).saturate(1).hex()};
        width: 24px;
        height: auto
      }

      svg {
        color: ${Color(overrideBackgroundColor).isDark() ? Color(overrideBackgroundColor).mix(Color('white'), 0.8).saturate(1).hex() : Color(overrideBackgroundColor).mix(Color('black'), 0.5).saturate(1).hex()};
        width: 24px;
        height: auto;
      }
    `}
  `}
`;
