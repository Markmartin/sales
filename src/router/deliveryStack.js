import Handle from '../home/pages/delivery/handle';
import Detail from '../home/pages/delivery/detail';
import Handing from '../home/pages/delivery/handing';
import HandOver from '../home/pages/delivery/handOver';

const DeliveryStack = {
    Handle: {
        screen: Handle,
        navigationOptions: ({navigation}) => ({
            title: '办理交车'
        })
    },
    Detail: {
        screen: Detail,
        navigationOptions: ({navigation}) => ({
            title: '交车详情'
        })
    },
    Handing: {
        screen: Handing,
        navigationOptions: ({navigation}) => ({
            title: '办理交车'
        })
    },
    HandOver: {
        screen: HandOver,
        navigationOptions: ({navigation}) => ({
            title: '交车完成',
            headerRightContainerStyle: {
                paddingRight: 10,
                fontWeight: '300'
            }
        })
    }
}

export default DeliveryStack