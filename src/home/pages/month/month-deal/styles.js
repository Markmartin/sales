import styled from 'styled-components/native/dist/styled-components.native.esm'
import {colors, size} from "../../../../style/variables";


const TopSort = styled.View`
    background: #fff;
    flex-direction: row;
    height: 36px;
    background: #fff;
    border-bottom-width:1px;
  	border-bottom-color: ${colors.grey5};
`

const TopSortItem = styled.Text`
    width: 50%;
    text-align: center;
    height: 100%
    text-align-vertical: center;
    font-size: ${size.fontSizeBase}; 
    color: ${colors.grey0}
`
const Line = styled.View`
    background:${colors.grey5};
    width: 1px;
    height: 14px;
    position: relative;
    top: 10px;
`

export {TopSort, TopSortItem, Line}
