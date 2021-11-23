import React from 'react';
import {createBottomTabNavigator} from 'react-navigation';
import {colors, size} from "../style/variables";

import Icon from 'react-native-vector-icons/dist/Feather';

import HomeStack from './home'
import TabCustomerStack from "../customer/tabCustomerStack"

import ReportStack from '../report'

const tabs = {
	Home: {
		screen: HomeStack,
		navigationOptions: ({ navigation }) => {
			let tabBarVisible = true;
			if (navigation.state.index > 0) {
				tabBarVisible = false;
			}
			return {
				tabBarLabel: '首页',
				tabBarVisible
			}
		}
	},
	Customer: {
		screen: TabCustomerStack,
		navigationOptions: {
			tabBarLabel: '客户'
		}
	},
	Report: {
		screen: ReportStack,
		navigationOptions: {
			tabBarLabel: '报表'
		}
	}
}

// 全部的底部路由
const originalRoutes = [
	{ key: 'Home', routeName: 'Home', params: null },
	{ key: 'Customer', routeName: 'Customer', params: null },
	{ key: 'Report', routeName: 'Report', params: null }
]

const Options = {
	defaultNavigationOptions: ({navigation}) => ({
		tabBarIcon: ({focused, tintColor}) => {
			const {routeName} = navigation.state;
			let size = 24
			let icon;
			switch (routeName) {
				case 'Home':
					icon = `home`;
					break;
				case 'Report':
					icon = `activity`;
					break;
				case 'Customer':
					icon = `users`;
					break;
			}

			return <Icon
				name={icon}
				size={size}
				color={tintColor}/>;
		},
	}),
	tabBarOptions: {
		activeTintColor: colors.primary,
		inactiveTintColor: colors.grey3,
		showIcon: true
	}
}

export {tabs,Options,originalRoutes}
