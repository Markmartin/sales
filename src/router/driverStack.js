import Agreement from '../home/pages/drive/agreement';
import DriveTrial from '../home/pages/drive/driveTrial';
import CancelDrive from '../home/pages/drive/cancel-drive';
import DriveDetail from '../home/pages/drive/detail';
import DriveAdd from '../home/pages/drive/add';
import Itinerary from '../home/pages/drive/itinerary';
import Success from '../home/pages/drive/success';
import Treaty from '../home/pages/drive/treaty';
import DriveOver from '../home/pages/drive/over';
import DriverDetails from "../home/pages/drive/driver-detail";
import AddDriver from '../home/pages/drive/add-driver'
import HandleTest from '../home/pages/drive/handle-test'

const DiverStack = {
    DriveDetails: {
        screen: DriverDetails,
        navigationOptions: ({navigation}) => ({
            title: '试驾详情'
        })
    },
    Agreement: {
        screen: Agreement,
        navigationOptions: ({navigation}) => ({
            title: '查看试驾协议'
        })
    },
    CancelDrive: {
        screen: CancelDrive,
        navigationOptions: ({navigation}) => ({
            title: '取消试驾'
        })
    },
    DriveTrial: {
        screen: DriveTrial,
        navigationOptions: ({navigation}) => ({
            title: '试乘试驾'
        })
    },
    DriveDetail: {
        screen: DriveDetail,
        navigationOptions: ({navigation}) => ({
            title: '试驾详情'
        })
    },
    DriveAdd: {
        screen: DriveAdd,
        navigationOptions: ({navigation}) => ({
            title: '新增试驾'
        })
    },
    Itinerary: {
        screen: Itinerary,
        navigationOptions: ({navigation}) => ({
            title: '新增试驾'
        })
    },
    Success: {
        screen: Success,
        navigationOptions: ({navigation}) => ({
            title: '新增签订'
        })
    },
    Treaty: {
        screen: Treaty,
        navigationOptions: ({navigation}) => ({
            title: '协议内容'
        })
    },
    DriveOver: {
        screen: DriveOver,
        navigationOptions: ({navigation}) => ({
            title: '试驾描述'
        })
    },
    AddDriver:{
        screen: AddDriver,
        navigationOptions: ({navigation}) => ({
            title: '创建试驾订单'
        })
    },
    HandleTest:{
        screen: HandleTest,
        navigationOptions: ({navigation}) => ({
            title: '办理试驾'
        })
    }
}

export default DiverStack
