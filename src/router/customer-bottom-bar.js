import {BottomTabBar} from 'react-navigation-tabs';
import React, {PureComponent} from 'react';
import {createBottomTabNavigator} from 'react-navigation';
import {tabs, Options, originalRoutes} from './tab-navigation'

//自定义BottomTabBar
class CustomBottomTabBar extends PureComponent {

	dealNavigation = () => {
		const {state} = this.props.navigation;

		// 这里调整routes
		const routes = originalRoutes;
		const newState = {
			...state, routes
		}
		return {
			...this.props.navigation,
			state: newState
		}

	};

	render() {
		const {navigation, ...restProps} = this.props
		const myNavigation = this.dealNavigation()
		return <BottomTabBar {...restProps} navigation={myNavigation}/>
	}
}

const MyTabRouter = createBottomTabNavigator(tabs, {
	...Options,
	tabBarComponent: CustomBottomTabBar
});

export default class Tabs extends PureComponent {
	//这里必须有这个静态属性，表示将这个页面视为一个navigator，这样才能和AppStack共用一套导航系统
	static router = MyTabRouter.router;

	render() {
		return <MyTabRouter navigation={this.props.navigation}/>;
	}
}

