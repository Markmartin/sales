/**
 * @description 用来实现试驾专员底部选择的组件，主要接收数据，对外传递数据
 * @param {rightCallback} 是关闭弹窗接收的函数
 */

import React, {Component} from 'react';
import {Text, View, SafeAreaView} from 'react-native';
import {Scrollpicker, BottomModal} from 'beeshell';
import {findIndex, map} from 'lodash'
export default class TestDriver extends Component {
	constructor(props) {
		super(props)
		this.state = {
			value: [0],
			drivers:[]
		}
	}
	componentDidMount() {
		// 获取试驾专员
		axios.get('/admin/staff/listStaffByRoleCode', {params: {roleCode: 'rolePartnerTestDrive'}})
			.then(({data}) =>{
				const drivers = map(data, i => {
					return {label: i.staffName, value: i.accountNo}
				})
				this.setState({drivers})
			})
	}
	// 打开modal
	open() {
		return this.bottomModal.open()
	}

	// 设置默认回显方法
	setDefault(value) {
		let index = findIndex(this.state.drivers, item => item.value == value)
		this.setState({value: [index]})
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
						 title='请选择试驾专家'
						 rightCallback={() => {
							 const data = this.state.drivers[this.state.value[0]]
							 this.props.rightCallback(data)
						 }}
						 cancelable={true}>
				<View style={{paddingVertical: 15}}>
					<Scrollpicker
						style={{paddingHorizontal: 80}}
						offsetCount={2}
						list={[this.state.drivers]}
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
