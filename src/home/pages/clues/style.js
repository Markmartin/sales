import styled from 'styled-components/native'
import { colors, size } from '../../../style/variables'

const ListWrapper = styled.View`
  padding: 0 10px;
  background-color: #ffffff;
  margin-bottom: 10px;
`
const ListItem = styled.View`
  flex-direction: row;
  justify-content: flex-start;
  flex-wrap: nowrap;
  align-items: center;
  border-bottom-color: ${colors.grey4};
  border-bottom-width: 1px;
`
const ListInfo = styled.View`
  flex: 1;
`
const UserInfo = styled.View`
  font-weight: bold;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  height: 35px;
`
const ClueType = styled.View`
  min-width: 30px;
  height: 20px;
  background-color: ${colors.grey5};
  padding: 3px;
  margin-right: 5px;
`
const ActionInfo = styled.View`
  font-weight: bold;
  flex-direction: row;
  justify-content: space-between;
  border-top-color: ${colors.grey4};
  border-top-width: 1px;
`
const OrderInfo = styled.View`
  flex-direction: row;
  padding: 5px 0;
`
const ListAction = styled.View`
  width: 80px;
`

const ClueDetail = styled.View`
  flex: 1;
  justify-content: flex-start;
  align-items: center;
  padding: 5px 0;
`

const ClueDetailCell = styled.View`
  flex: 1;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  border-top-width: 1;
  border-top-color: #f3f3f3;
`

export {
  ListWrapper,
  ListItem,
  ListInfo,
  ListAction,
  UserInfo,
  OrderInfo,
  ActionInfo,
  ClueType,
  ClueDetail,
  ClueDetailCell
}
