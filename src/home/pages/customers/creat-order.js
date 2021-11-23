import React, {Component} from 'react';
import {ScrollView,  Alert} from 'react-native';
import {Tab} from 'beeshell';
import {inject} from 'mobx-react';

import {CustomerBg} from "./style";
import {tabData} from "../../data-config";
import variables from "../../../style/beeshell";

import 	OrderHistoryList from './components/order-history-list'

@inject(['userStore'])
export default class CreatOrder extends Component {
	constructor(p) {
		super(p)
		this.store = this.props.userStore
		this.state = {
		}
	}



	// 生命周期挂载阶段
	componentDidMount() {
		// 获取参数
		const {navigation} = this.props
		const customerNo = navigation.getParam('customerNo')
		// 处理异常情况
		if (!customerNo) {
			Alert.alert('提示信息', '客户资料异常，没有customerNo')
			this.props.navigation.navigate('App')
			return null
		}
	}


	// 点击切换tab
	touchTab(v, value) {
		const {navigation} = this.props
		switch (value) {
			case 1:
				this.props.navigation.navigate('Customers',{customerNo: navigation.getParam('customerNo')})
				break;
			case 2:
				this.props.navigation.navigate('FollowUp',{customerNo: navigation.getParam('customerNo')})
				break;
			default:
				return;
		}
	}


	render() {
		return (
			<CustomerBg style={{flex: 1, paddingTop: 10}}>
				<ScrollView>
					<Tab
						value={3}
						data={tabData}
						onChange={item => this.touchTab('value', item.value)}
						activeColor={variables.mtdBrandPrimaryDark}/>

					<OrderHistoryList customerNo={this.props.navigation.getParam('customerNo')} />

				</ScrollView>
			</CustomerBg>
		);
	}
}
