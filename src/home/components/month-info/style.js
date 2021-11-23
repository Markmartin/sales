import styled from 'styled-components/native'
import {colors, size} from "../../../style/variables";

const BenchWrapper = styled.View`
	background-color: ${colors.primary};
	flex-direction: row;
	justify-content: space-around;
	flex-wrap: nowrap;
	height: 130px;
`
const WorkWrapper = styled.View`
	width: 70px;
	height: 60px;
	margin: 20px 0;
`
const WorkTitle = styled.Text`
	margin-top: 15px;
	width: 70px;
	color: ${colors.white};
	text-align: center;
	font-size: 12px;
`

export {BenchWrapper, WorkWrapper, WorkTitle}
