import styled from 'styled-components/native'


const RowContentView = styled.View`
    flex-direction: row;
	justifyContent: space-between;
	alignItems: center;
`;

const LineRowItemView = styled.View`
    flex-direction: row;
	justifyContent: flex-start;
	alignItems: center;
`;

const LineBetweenItemView = styled.View`
    flex-direction: row;
    justifyContent: space-between;
    alignItems: center;
`;

const LineTitleItemView = styled.View`
    flex-direction: row;
	justifyContent: flex-start;
	alignItems: center;
`;

const RowLineView = styled.View`
    background-color: #EBEDF0;
    width: 93%;
    height: 0.5px;
`;

const ColumnLineView = styled.View`
    background-color: #EBEDF0;
    width: 0.5px;
    height: 100%;
`;


export {
    RowContentView,
    RowLineView,
    ColumnLineView,
    LineTitleItemView,
    LineBetweenItemView,
    LineRowItemView
}