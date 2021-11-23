import styled from 'styled-components/native'
import {colors, size} from "../../../style/variables";
import variables from "../../../style/beeshell";

const CustomerBg = styled.View`
	background-color: ${colors.grey5};
	flex: 1;
`
const ButtonWrapper = styled.View`
	flex: 1;
    padding: 10px;
`
const FormItemWrapper = styled.View`
	background-color: #fff;
    margin-bottom: 10px;
`
const PageTitle = styled.Text`
	font-size: ${size.fontsizeLg};
    padding: 15px;
`

const CustomerWrapper = styled.View`
	padding: 10px;
	background-color: #ffffff;
	margin-top: 10px;
`
const CustomerInfo = styled.View`
	flex-direction: row;
	justify-content: space-around;
	flex-wrap: nowrap;
	padding: 5px 0;
`
const FollowUpListTitle = styled.View`
	padding: 10px 0;
`

const FollowUpList = styled.View`
	border-top-color: ${colors.grey5};
	border-top-width: 1px;
	padding: 5px 0;
`
const FollowUpItem = styled.View`
	flex-direction: row;
	padding: 15px 10px;
`
const FollowUpListText = styled.Text`
	color: ${variables.mtdGrayBase};
`
const Card = styled.View`
	min-height: 56px;
	background-color: #fff;
`
const CardTitle = styled.View`
	padding-top: 18px;
	margin-left: 13px;
	margin-right: 13px;
	height: 56px;
	border-bottom-color: ${variables.mtdBorderColor};
	border-bottom-width: 1px;
`
const CardTitleIcon = styled.Text`
	position: absolute;
	right: 13px;
	top:16px;
`
const RateBox = styled.View`
  background-color: white;
  margin-top: 13px;
  margin-left: 13px;
  margin-right: 13px;
  border-radius: 5px;
`

const RateDesText = styled.Text`
    padding-bottom: 10px;
    padding-left: 10px;
	font-size: 13px;
	margin-bottom: 5px;
`
export {
    CardTitleIcon,
    CardTitle,
    Card,
    FormItemWrapper,
    CustomerBg,
    ButtonWrapper,
    PageTitle,
    CustomerWrapper,
    CustomerInfo,
    FollowUpListTitle,
    FollowUpList,
    FollowUpItem,
    FollowUpListText,
    RateBox,
    RateDesText
}
