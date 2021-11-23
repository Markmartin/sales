// 客户相关
import Customers from '../home/pages/customers'
import FollowUp from '../home/pages/customers/follow-up'
import CreatOrder from '../home/pages/customers/creat-order'

// 代办
import TodayFollowUp from '../home/pages/todo-list/today-follow-up'
import OldCustomers from '../home/pages/todo-list/old-customers'
import TodayCustomers from '../home/pages/todo-list/today-customers'
import TimeoutCustomers from '../home/pages/todo-list/timeout-customers'
import ReceivedFollowUp from '../home/pages/todo-list/received-follow-up'

export default {
  // 新建客户
  Customers: {
    screen: Customers,
    navigationOptions: ({ navigation }) => ({
      title: '客户资料'
    })
  },
  // 跟进客户
  FollowUp: {
    screen: FollowUp,
    navigationOptions: ({ navigation }) => ({
      title: '客户跟进'
    })
  },
  // 创建订单
  CreatOrder: {
    screen: CreatOrder,
    navigationOptions: ({ navigation }) => ({
      title: '订单管理'
    })
  },
  // 客户跟进提醒
  TodayFollowUp: {
    screen: TodayFollowUp,
    navigationOptions: ({ navigation }) => ({
      title: '今日待跟进客户'
    })
  },
  OldCustomers: {
    screen: OldCustomers,
    navigationOptions: ({ navigation }) => ({
      title: '老客户跟进'
    })
  },
  TodayCustomers: {
    screen: TodayCustomers,
    navigationOptions: ({ navigation }) => ({
      title: '今日新增客户'
    })
  },
  TimeoutCustomers: {
    screen: TimeoutCustomers,
    navigationOptions: ({ navigation }) => ({
      title: '逾期未跟进客户'
    })
  },
  ReceivedFollowUp: {
    screen: ReceivedFollowUp,
    navigationOptions: ({ navigation }) => ({
      title: '已领取待跟进客户'
    })
  }
}
