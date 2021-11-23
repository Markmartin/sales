import React, {Component} from 'react';
import {createStackNavigator} from 'react-navigation';

import Report from './main'
import Evaluate from './evaluate'
import BackNarrowIcon from 'react-native-vector-icons/MaterialIcons';
import {View} from "react-native"


const ReportStack = createStackNavigator(
    {
        Report: {
            screen: Report,
            navigationOptions: {
                title: '报表'
            }
        },
        Evaluate: {
            screen: Evaluate,
            navigationOptions: ({navigation}) => ({
                title: '总体服务评价',
                headerLeft: (
                    <BackNarrowIcon
                        onPress={() => navigation.goBack()}
                        name='arrow-back'
                        size={30}
                        color='#F5FBFF' light/>

                ),
                headerLeftContainerStyle: {
                    paddingLeft: 10,
                    fontWeight: '300'
                }
            })
        }
    },
    {
        defaultNavigationOptions: ({navigation}) => ({
            headerStyle: {
                backgroundColor: '#00CFB4',
                fontWeight: '300',
                borderBottomWidth: 0,
                elevation: 0,       //remove shadow on Android
                shadowOpacity: 0,   //remove shadow on iOS
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
                textAlign: 'center',
                flex: 1
            },
            headerRight: (<View/>),
            headerLeft: (<View/>)
        })
    }
);
export default ReportStack
