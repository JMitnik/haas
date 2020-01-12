import styled from 'styled-components';
import { TypographyProps, typography, space, SpaceProps, color, ColorProps } from 'styled-system';

interface GenericTypeProps extends TypographyProps, SpaceProps, ColorProps {}

export const GenericType = styled.p<GenericTypeProps>`
  ${color}
  ${space}
  ${typography}
`;

export const Paragraph = styled(GenericType).attrs({ as: 'p' })``;

export const H1 = styled(GenericType).attrs({ as: 'h2' })``;

export const H2 = styled(GenericType).attrs({ as: 'h2' })``;

export const H3 = styled(GenericType).attrs({ as: 'h3' })``;

export const H4 = styled(GenericType).attrs({ as: 'h4' })``;

export default {};
