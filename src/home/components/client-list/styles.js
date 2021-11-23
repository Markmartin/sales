import styled from "styled-components/native/dist/styled-components.native.esm";
import {colors} from "../../../style/variables";

const ListItem = styled.View`
    background: #fff;
     flex-direction: row;
   	border-bottom-width:1px;
  	border-bottom-color:${colors.grey5};
    justify-content: space-between;
    padding: 15px 0;
`

const ListLeft = styled.View`
    flex: 8;
`

const ListRight = styled.View`
    flex: 2;
    align-self: center;
    flex-direction: row;
    justify-content:  flex-end;
    text-align-vertical: center;
`

export {ListItem, ListLeft, ListRight}
