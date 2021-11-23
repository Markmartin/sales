/**
 * @description 日期选择器
 * @param {rightCallback} 是关闭弹窗接收的函数
 */

import React, {Component} from 'react';
import {Text, View, SafeAreaView} from 'react-native';
import {Datepicker , BottomModal} from 'beeshell';

export default class OrderDatePicker extends Component {
	constructor(props) {
		super(props)
		this.state = {
			date:moment().format('YYYY-MM-DD')
		}
	}

	// 打开modal
	open() {
		return this.bottomModal.open()
	}

	renderSafeArea() {
		return (
			<View style={{maxHeight: 30}}>
				<SafeAreaView style={{flex: 1}}>
					<View style={{height: 30}}/>
				</SafeAreaView>
			</View>
		)
	}

	render() {
		return (
			<BottomModal ref={c => this.bottomModal = c}
						 title='请选择查询日期'
						 rightCallback={() => {
							 const {date} = this.state
							 this.props.rightCallback(date)
						 }}
						 cancelable={true}>
				<View style={{paddingVertical: 15}}>
					<Datepicker
								startYear={Number(new Date().getFullYear()) - 1}
								numberOfYears={2}
								date={this.state.date}
								onChange={value => {
									this.setState({date: value})
								}}/>
				</View>
				{this.renderSafeArea()}
			</BottomModal>
		);
	}
}
