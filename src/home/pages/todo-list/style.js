import styled from 'styled-components/native'
import {colors, size} from "../../../style/variables";

const ListWrapper = styled.View`
	padding: 10px 10px 0 10px;
	background-color: #ffffff;
`
const ListItem = styled.View`
	flex-direction: row;
	justify-content: flex-start;
	flex-wrap: nowrap;
	height: 80px;
	align-items: center;
	border-bottom-color:${colors.grey4};
	border-bottom-width: 1px;
`
const ListInfo = styled.View`
	flex: 1;
`
const UserInfo = styled.View`
	font-weight: bold;
	flex-direction: row;
	font-size: ${size.fontsizeMd};
`
const OrderInfo = styled.View`
	flex-direction: row;
	margin-top: 10px;
`
const ListAction = styled.View`
	width: 30px;
	padding-left: 10px;
`

const DropDownWrapper = styled.View`
	flex-direction: row;
	height: 40px;
`
const DropDownContent = styled.View`
	width: 140px;
	background-color: white;
	padding-top: 10px;
	border-bottom-color: ${colors.grey5};
	border-bottom-width: 1px;
	border-right-color: ${colors.grey5};
	border-right-width: 1px;
`

export {ListWrapper,ListItem,ListInfo,ListAction,UserInfo,OrderInfo,DropDownWrapper,DropDownContent}
