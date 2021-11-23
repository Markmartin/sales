/**
 * @description 用来实现客户等级底部选择的组件，主要接收数据，对外传递数据
 * @param {rightCallback} 是关闭弹窗接收的函数
 */

import React, {Component} from 'react';
import {Text, View, SafeAreaView} from 'react-native';
import {Scrollpicker, BottomModal} from 'beeshell';
import {lostReason} from "../../../../data-config";

export default class LostReason extends Component {
	constructor(props) {
		super(props)
		this.state = {
			list: lostReason,
			value:[0]
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
						 title='请选择战败原因'
						 rightCallback={() => {
						 	const data = this.state.list[this.state.value[0]].value
							this.props.rightCallback(data)
						 }}
						 cancelable={true}>
				<View style={{paddingVertical: 15}}>
					<Scrollpicker
						style={{paddingHorizontal: 80}}
						offsetCount={2}
						list={[this.state.list]}
						onChange={(columnIndex, rowIndex) => {
							this.setState({
								value:[rowIndex]
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
