import styled from 'styled-components/native'
import {colors, size} from "../../../style/variables";

const LostBG = styled.View`
	background-color: ${colors.grey5};
	flex: 1;
	position: relative
`;

const LostItemView = styled.View`
   background-color:${colors.white};
   flex:1;
`
const LostItemRowView = styled.View`
   flex:1;
   padding: 16px 16px 4px;
`

const LostItemHandleRowView = styled.View`
   flex:1;
   padding: 16px 16px 4px;
   flex-direction: row;
   justify-content: space-between;
`

const LostItemButtonRowView = styled.View`
   flex:1;
   flex-direction: row;
`
const LostItemSubRowView = styled.View`
   flex:1;
   flex-direction: row;
   justify-content: space-between;
   padding-bottom: 12px;
`
const LostItemSubDefaultRowView = styled.View`
   flex:1;
   flex-direction: row;
   padding-bottom: 12px;
`
const LostItemSubItemView = styled.View`
   flex-direction: row;
`

const LostText = styled.Text`
  color:#99999A;
  font-size: 14px;
`

const LostBoldText = styled.Text`
  color:#323233;
  font-size: 16px;
  font-weight: bold;
`

const LostDetailRow = styled.View`
  background-color:#fff;
  padding: 16px 24px 4px;
  justify-content: space-between;
`

const LostDetailSubRow = styled.View`
  flex-direction: row;
  background-color:#fff;
`

const LostDetailText = styled.Text`
  color:#323233;
  padding-bottom: 12px;
  line-height: 20px;
`

export {
    LostBG,
    LostItemView,
    LostItemRowView,
    LostItemHandleRowView,
    LostItemButtonRowView,
    LostItemSubDefaultRowView,
    LostItemSubRowView,
    LostItemSubItemView,
    LostBoldText,
    LostText,

    LostDetailRow,
    LostDetailSubRow,
    LostDetailText,

}
