import MonthDealDetails from '../home/pages/month/month-deal-details'
import MonthDeal from '../home/pages/month/month-deal'
import MonthClient from '../home/pages/month/month-client'
import MonthDrive from '../home/pages/month/month-drive'
import monthOrder from '../home/pages/month/month-order'
import React from "react";
import { View} from 'react-native';

const MonthOrder = {
    // 月新增成
    MonthDeal:{
        screen: MonthDeal,
        navigationOptions: ({navigation}) => ({
            title: '月新增成交',
            headerRight: <View/>
        }),
    },
    // 月新增成交详情
    MonthDealDetails:{
        screen: MonthDealDetails,
        navigationOptions: ({navigation}) => ({
            title: '订单明细',
            headerRight: <View/>
        }),
    },
    // 月新增客户
    MonthClient:{
        screen: MonthClient,
        navigationOptions: ({navigation}) => ({
            title: '月新增客户',
            headerRight: <View/>

        }),
    },
    // 月新增试驾
    MonthDrive:{
        screen: MonthDrive,
        navigationOptions: ({navigation}) => ({
            title: '月新增试驾',
            headerRight: <View/>

        }),
    },
    // 月订单目标
    monthOrder:{
        screen: monthOrder,
        navigationOptions: ({navigation}) => ({
            title: '月订单目标',
            headerRight: <View/>

        }),
    },
}

export default MonthOrder
