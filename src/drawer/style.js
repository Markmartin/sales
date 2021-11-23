import styled from 'styled-components/native'
import {colors, size} from "../style/variables";


const ImageAvatar = styled.Image`
	border-radius: 36px;
	width: 72px;
	height: 72px;
	margin-top: 52px;
	align-self: center;
`
const NameText = styled.Text`
  text-align: center;
  margin-top: 16px;
  font-size: 22px;
  color: #323233;
  font-weight: bold;
`
const RoleText = styled.Text`
  text-align: center;
  font-size: 14px;
  margin-top: 8px;
  color: #323233;
`
const ItemContainer = styled.View`
  flex-direction: row;
  align-items: center;
  padding: 18px;
`
export {ImageAvatar, NameText, RoleText, ItemContainer}
