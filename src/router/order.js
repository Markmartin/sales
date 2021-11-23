import OrderInquire from '../home/pages/order-inquire'
import React from "react";
import OrderDetail from "../home/pages/order-inquire/orderDetail";
import MonthDeal from "../home/pages/order-inquire/order-inquire-details"
const Order = {
    // 订单查询
    OrderInquire:{
        screen: OrderInquire,
        navigationOptions: ({navigation}) => ({
            title: '订单查询',
            headerRightContainerStyle: {
                paddingRight: 10,
                fontWeight: '300'
            }
        }),
    },
    // 订单详情
    OrderInquireDetails:{
        screen: OrderDetail,
        // screen: MonthDeal,
        navigationOptions: ({navigation}) => ({
            title: '订单明细'
        }),
    },
}

export default Order
