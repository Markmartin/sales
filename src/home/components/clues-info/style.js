import styled from 'styled-components/native'
import { colors, size } from '../../../style/variables'

const iconHeight = '24px'
const CluesWrapper = styled.View`
  background-color: #fffbe8;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  flex-wrap: nowrap;
  height: 44px;
`
const CluesTitle = styled.View`
  flex: 1;
  flex-direction: row;
  height: ${iconHeight};
`
const CluesTitleText = styled.Text`
  color: #ed6a0c;
  line-height: ${iconHeight};
  font-size: ${size.h5FontSize};
`
export { CluesWrapper, CluesTitle, CluesTitleText }
