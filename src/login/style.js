import styled from 'styled-components/native'
import {colors, size} from "../style/variables";

const LoginForm = styled.View`
	padding: 0 20px;
	margin-top: 300px;
`
const ButtonWrapper = styled.View`
    padding: 10px;
`

const PrivacyTitle = styled.Text`
	font-size: ${size.h2FontSize};
  	font-weight: bold;
  	color: ${colors.black};
  	text-align: center;
`
const PrivacyPart = styled.Text`
	font-size: ${size.h5FontSize};
  	font-weight: bold;
  	color: ${colors.black};
`
const PrivacyText = styled.Text`
  	color: ${colors.black};
  	line-height: 20px;
  	padding: 5px;
`
export {LoginForm, ButtonWrapper,PrivacyTitle,PrivacyPart,PrivacyText}
