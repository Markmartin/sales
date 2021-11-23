// 底部导航Home的路由栈
import React from 'react';
import {View, Button} from 'react-native';
import {createStackNavigator} from 'react-navigation';
import Icon from 'react-native-vector-icons/dist/Feather';
import BackNarrowIcon from 'react-native-vector-icons/MaterialIcons';

import {colors} from '../style/variables'
import Home from '../home';
import Clues from '../home/pages/clues'
import Driver from '../home/pages/drive'
import Delivery from '../home/pages/delivery'
import DriverStack from "./driverStack"
import MonthOrder from "./month-order"
import DeliveryStack from './deliveryStack'
import DrawerStack from './drawerStack'
import LostStack from './lostStack'
import Order from './order'
import customers from './customers'
import Lost from '../home/pages/lost'
import HomeSearchList from '../home/pages/homeSearchList'
import {SearchBarBtn} from '../home/pages/homeSearchList/searchBar'
import HomeSystemMsgList from '../home/pages/systemMsg'
import PhotoBrowserScene from "../common/components/fullScreenBrowser";

const HomeStack = createStackNavigator(
	{
		Home: {
			screen: Home,
			navigationOptions: ({navigation}) => ({
				headerTitle: <SearchBarBtn/>,
				headerRightContainerStyle: {
					paddingRight: 10,
					fontWeight: '300'
				},
				headerLeftContainerStyle: {
					paddingLeft: 10,
					fontWeight: '300'
				},
				headerLeft: (
					<Icon
						onPress={() => {
							navigation.openDrawer()
						}}
						name='align-left'
						size={24}
						color='#F5FBFF' light/>
				)
			}),
		},
		// 线索分配
		Clues: {
			screen: Clues,
			navigationOptions: ({navigation}) => ({
				title: '线索大厅',
			}),
		},
		// 试乘试驾
		Driver: {
			screen: Driver,
			navigationOptions: ({navigation}) => ({
				title: '试乘试驾',
				headerRightContainerStyle: {
					paddingRight: 10,
					fontWeight: '300'
				}
			}),
		},
		// 交车管理
		Delivery: {
			screen: Delivery,
			navigationOptions: ({navigation}) => ({
				title: '交车管理',
				headerRightContainerStyle: {
					paddingRight: 10,
					fontWeight: '300'
				}
			}),
		},
		// 战败审批
		Lost: {
			screen: Lost,
			navigationOptions: ({navigation}) => ({
				title: '战败审批',
				headerRightContainerStyle: {
					paddingRight: 10,
					fontWeight: '300'
				}
			}),
		},
		// 首页搜索界面
		HomeSearchList: {
			screen: HomeSearchList
		},
		// 首页系统消息
		HomeSystemMsgList: {
			screen: HomeSystemMsgList,
			navigationOptions: ({navigation}) => ({
				title: '系统消息',
			}),
		},
		// 全屏浏览
		Photo: {
			screen: PhotoBrowserScene,
		},
		...MonthOrder,
		...DriverStack,
		...DeliveryStack,
		...DrawerStack,
		...LostStack,
		...customers,
		...Order
	},
	{
		defaultNavigationOptions: ({navigation}) => ({
			gesturesEnabled: true,
			headerStyle: {
				backgroundColor: colors.primary,
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
			// 重写返回按钮
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
			// 修复android 右侧无按钮标题右偏问题
			headerRight: (<View/>)
		})
	}
);

export default HomeStack
