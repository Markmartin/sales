import React from 'react';
import {createStackNavigator} from "react-navigation";
import Customer from ".";
import {colors} from "../style/variables";
import customers from "../router/customers"
import BackNarrowIcon from 'react-native-vector-icons/MaterialIcons';
import AddDriver from '../home/pages/drive/add-driver'

const TabCustomerStack = createStackNavigator(
    {
        Customer: {
            screen: Customer
        },
        AddDriver:{
            screen: AddDriver,
            navigationOptions: ({navigation}) => ({
                title: '创建试驾订单'
            })
        },
        ...customers
    },
    {
        defaultNavigationOptions: ({navigation}) => ({
            headerStyle: {
                backgroundColor: colors.primary,
                fontWeight: '300',
                borderBottomWidth: 0,
                elevation: 0,       //remove shadow on Android
                shadowOpacity: 0,   //remove shadow on iOS
            },
            // headerTintColor: '#fff',
            headerTitleStyle: {
                textAlign: 'center',
                flex: 1,
                color: "#fff"
            },
            title: "客户信息",
            headerRightContainerStyle: {
                paddingRight: 15,
                fontWeight: '300'
            },
            headerLeftContainerStyle: {
                paddingLeft: 10,
                fontWeight: '300'
            },
            headerLeft: (
                <BackNarrowIcon
                    onPress={() => navigation.goBack()}
                    name='arrow-back'
                    size={30}
                    color='#F5FBFF' light/>
            ),

        })
    }
);

export default TabCustomerStack
