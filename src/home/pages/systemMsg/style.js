import styled from 'styled-components/native'


const RowContentView = styled.View`
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
`;

const LineColumnItemView = styled.View`
    flex-direction: column;
	justifyContent: center;
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
    width: 93%;
    height: 0.5px;
`;

const IconBgView = styled.View`
    justify-content: center;
    align-items: center;
    background-color: #37C1B4;
    border-radius: 4px;
    height: 48px;
    width: 48px;
    margin-left: 16px;
    margin-top: 16px;
    margin-bottom: 16px;
`;

export {
    RowContentView,
    ItemSpaceView,
    LineColumnItemView,
    IconBgView,
    LineBetweenItemView,
    RowLineView,
    RowCenterItemView
}