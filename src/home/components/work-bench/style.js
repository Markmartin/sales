import styled from 'styled-components/native'
import {colors, size} from "../../../style/variables";

const BenchWrapper = styled.View`
	flex: 1;
	background-color: ${colors.white};
	width: 100%;
	margin-top: 10px;
	padding-horizontal:10px;
	padding-bottom: 20px;
`
const BenchTitle = styled.Text`
  	font-size: ${size.h5FontSize};
  	font-weight: bold;
  	color: ${colors.black};
  	margin: 15px 0;
`
const WorkList = styled.View`
	flex-direction: row;
	justify-content: flex-start;
	flex-wrap: wrap;
`
const WorkWrapper = styled.View`
	width: 21%;
	height: 60px;
	margin: 2%;
	margin-bottom: 6%;
	padding-left: 1%;
`
const WorkTitle = styled.Text`
	margin-top: 5px;
`

export {BenchWrapper, BenchTitle, WorkList, WorkWrapper, WorkTitle}
