// 这是领取的对话框

import React, {Component} from 'react';
import {Text, View,Alert} from 'react-native';
import {Dialog} from 'beeshell';
import {colors, size} from "../../../style/variables";
import navigation from '../../../common/services/navigation'
// 定义领取成功提示

export default class Receive extends Component {

	constructor(props) {
		super(props)
		this.clues = null
		this.state = {
			bodyText: ''
		}
	}

	// 领取线索方法
	receive(item) {
		// 请求远端API 领取线索
		const {clueId} = item
		axios.post('/admin/satCustomerClue/getClue', {clueId})
			.then(() => {
				this.clues = item
				this._dialog.open().then(() => {
					this.setState({bodyText: `您已经领取了${item.customerName}信息，是否继续完善客户资料`})
				})
			})
	}

	// 关闭对话框
	close() {
		this._dialog.close()
		this.setState({bodyText: ''})
		this.clues = null
		// 刷新父组件列表
		this.props.refresh()
	}

	// 底部按钮渲染函数
	getLabel(label, type, index) {
		const color = colors.primary
		return (
			<View style={{
				flex: 1,
				flexDirection: 'row',
				alignItems: 'center',
				justifyContent: 'center',
				paddingVertical: 10,
				paddingHorizontal: 15,
			}}>
				<Text style={{fontSize: 16, color, marginLeft: 5}}>{label}</Text>
			</View>
		)
	}

	render() {
		return (
			<View>
				<Dialog
					ref={c => this._dialog = c}
					cancelable={false}
					title={'领取成功'}
					bodyText={this.state.bodyText}
					operations={[
						{
							label: this.getLabel('继续领取', 'confirm', 1),
							onPress: () => this.close()
						},
						{
							label: this.getLabel('去完善', 'confirm', 2),
							type: 'confirm',
							onPress: () => {
								switch (this.clues.clueType) {
									case '1':
										// 请求查看是否客户建档
										navigation.navigate('Customers', {customerNo: this.clues.customerNo, clues: this.clues})
										break
									case '2':
										// 试驾类型
										navigation.navigate('DriveDetails', {driveId: this.clues.businessKey})
										break
									case '3':
										// 订单类型
										navigation.navigate('OrderInquireDetails', {orderNo: this.clues.businessKey})
										break
								}
								this.close()
							}
						}
					]}
				/>
			</View>
		);
	}
}
