/**
 * @description 用来选择交车的时间段
 * @param {rightCallback} 是关闭弹窗接收的函数
 * @param {disableHours} 接收不显示的时间段
 */

import React, {Component} from 'react';
import {Text, View, SafeAreaView} from 'react-native';
import {Scrollpicker, BottomModal} from 'beeshell';
import {time} from './util'
import {reject, indexOf} from "lodash"

export default class DeliveryTime extends Component {
	constructor(props) {
		super(props)
		this.state = {
			list: time,
			value: [0]
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
		const disableHours = this.props.disableHours ? this.props.disableHours : []
		let list
		if (this.props.disableHours) {
			list = reject(this.state.list, item => indexOf(disableHours, item.value) !== -1)
		} else {
			list = this.state.list
		}
		return (
			<BottomModal ref={c => this.bottomModal = c}
						 title='请选择交车时间'
						 rightCallback={() => {
							 const data = this.state.list[this.state.value[0]]
							 this.props.rightCallback(data)
						 }}
						 cancelable={true}>
				<View style={{paddingVertical: 15}}>
					<Scrollpicker
						style={{paddingHorizontal: 80}}
						offsetCount={2}
						list={[list]}
						onChange={(columnIndex, rowIndex) => {
							this.setState({
								value: [rowIndex]
							})
						}}
						value={this.state.value}
						renderItem={(item) => {
							return (
								<View
									style={{
										flexDirection: 'row',
										paddingVertical: 10
									}}>
									<Text>{item.label}</Text>
								</View>
							)
						}}
					/>
				</View>
				{this.renderSafeArea()}
			</BottomModal>
		);
	}
}
