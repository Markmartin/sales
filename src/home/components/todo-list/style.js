import styled from 'styled-components/native'
import { colors, size } from '../../../style/variables'

const TodoView = styled.View`
  padding: 0 10px;
  height: 200px;
  background: #ffffff;
`
const ListWrapper = styled.View`
  flex-direction: row;
  justify-content: space-around;
  flex-wrap: nowrap;
  height: 125px;
`
const TodoWrapper = styled.View`
  flex: 1;
  margin: 0 2px;
  align-items: center;
  justify-content: center;
`
const BenchTitle = styled.Text`
  font-size: ${size.h5FontSize};
  font-weight: bold;
  color: ${colors.black};
  margin: 15px 0;
`

const TodoTitle = styled.Text`
  font-size: ${size.h0FontSize};
  text-align: center;
  color: #ff3366;
`
const TodoInfo = styled.Text`
  font-size: ${size.fontSizeSm};
  text-align: center;
  color: #333;
`
export { ListWrapper, TodoWrapper, TodoTitle, TodoInfo, BenchTitle, TodoView }
