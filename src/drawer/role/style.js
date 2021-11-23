import styled from 'styled-components/native'


const Item = styled.View`
	width:40%;
	justify-content: center;
	height: 120px;
`
const ItemText = styled.Text`
	width: 100%;
	text-align: center;
	margin-top: 12px;
	font-size: 14px;
`
const CurrentItem = styled.Text`
	position: absolute;
	right:13%;
	bottom: 50px;
	background-color: #000;
	padding: 1px 5px;
	color: #fff;
	font-size: 12px;
`

const List = styled.View`
	flex-direction: row;
	flex-wrap: wrap;
	justify-content: space-around;
	padding: 10% 5%;
`
export {Item,List,ItemText,CurrentItem}
