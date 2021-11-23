import LostDetail from '../home/pages/lost/detail';

const LostStack = {
    LostDetail: {
        screen: LostDetail,
        navigationOptions: ({navigation}) => ({
            title: '战败详情'
        })
    }
}

export default LostStack
