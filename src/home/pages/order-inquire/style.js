import styled from 'styled-components/native'


const RowContentView = styled.View`
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
`;

const ColumnContentView = styled.View`
    flex-direction: column;
	justifyContent: flex-start;
	alignItems: flex-start;
`;

const LineBetweenItemView = styled.View`
    flex-direction: row;
    justifyContent: space-between;
    alignItems: center;
`;

const RowCenterItemView = styled.View`
    flex-direction: row;
    justifyContent: center;
    alignItems: center;
`;

const ItemSpaceView = styled.View`
    background-color: #ECF0F3;
    width: 100%;
    height: 10px;
`;

const RowLineView = styled.View`
    background-color: #EBEDF0;
    width: 100%;
    height: 0.5px;
`;

const BottomSpaceView = styled.View`
    background-color: #FFFFFF;
    width: 100%;
    height: 24px;
`;

export {
    RowLineView,
    ItemSpaceView,
    RowContentView,
    BottomSpaceView,
    RowCenterItemView,
    ColumnContentView,
    LineBetweenItemView
}