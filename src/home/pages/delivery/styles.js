import styled from 'styled-components/native'
import {colors, size} from "../../../style/variables";

const CluesBg = styled.View`
	background-color: ${colors.grey5};
	flex: 1;
	position: relative
`;
const CluesWrapperItem = styled.View`
	background-color: ${colors.white};
	padding-left: 16px;
	padding-right: 16px;
	padding-top: 16px;
`;
const CluesWrapper = styled.View`
	background-color: ${colors.white};
	flex-direction: row;
	justify-content: flex-start;
	flex-wrap: nowrap;
	align-items: center;
	border-bottom-color:${colors.grey4};
	border-bottom-width: 1px;
	padding-bottom: 16px;
	height: 107px;
`;
const CluesInfo = styled.View`
	flex: 1;
`;
const CluesUserInfo = styled.View`
	flex-direction: row;
`;
const CluesName = styled.Text`
	font-size: ${size.fontsizeMd};
	font-weight: bold;
`;
const CluesTimeInfo = styled.Text`
    font-size: ${size.fontSizeBase};
    color: ${colors.grey3};
    padding: 12px 0;
`;
const CluesCarInfo = styled.Text`
    color: ${colors.grey0};
    font-size: ${size.fontSizeBase};
`;
const CluesAction = styled.View`
	width: 80px;
`;
const Button = styled.Text`
	height: 30px;
	width: 80px;
	text-align: center;
	line-height: 30px;
	border-radius: 15px;
	overflow: hidden;
	color: ${colors.white};
	font-size: ${size.fontSizeBase};
	background-color: ${colors.primary};
`;
const ButtonText = styled.View`
	color: ${colors.grey3};
	flex-direction: row;
	justify-content: flex-end;
`;

// 办理交车
const StepsBox = styled.View`
	padding: 20px 100px;
	flex-direction: row;
	justify-content: space-between;
	position: relative;
`;
const StepsBoxItem = styled.View`
    width: 64px;
`;
const StepsBoxItemText = styled.View`
    height: 20px;
	width: 20px;
	border-radius: 50px;
	overflow: hidden;
	background-color: ${colors.primary};
	text-align: center;
`;
const StepsBoxItemTitle = styled.Text`
	font-size: ${size.fontSizeBase};
	color: ${colors.grey0};
	text-align: center;
`;
const Line = styled.View`
	position: absolute;
	height: 2px;
	width: 61%;
	background-color: #e3e6e6;
	top: 30px;
	left: 142px;
`;
const Content = styled.View`
	padding: 0 16px;
	marginBottom: 16px;
`;
const ContentInner = styled.View`
	background-color: ${colors.white};
	padding: 24px 16px 8px;
	border-radius: 4px;
	overflow: hidden;
	marginBottom: 24px;
`;
const ContentInnerImg = styled.View`
	background-color: ${colors.grey3};
	height: 90;
	width: 160;
	alignSelf: center;
	marginBottom: 24px;
`;
const InfoItem = styled.View`
	flex-direction: row;
	paddingBottom: 16px;
`;
const LabelText = styled.Text`
	width: 100px;
	font-size: ${size.fontSizeBase};
	color: ${colors.grey0}
`;
const ValueText = styled.Text`
    flex: 2;
	font-size: ${size.fontSizeBase};
	color: ${colors.grey0}
`;

export {CluesWrapperItem,CluesName,CluesWrapper,CluesInfo,CluesAction,CluesUserInfo,CluesTimeInfo,CluesCarInfo,CluesBg,Button,ButtonText,
    StepsBox,StepsBoxItem,StepsBoxItemText,StepsBoxItemTitle,Line,Content,ContentInner,ContentInnerImg,InfoItem,LabelText,ValueText}
