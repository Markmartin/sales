/**
 * @description 用来实现车辆外饰颜色选择的组件，主要接收数据，对外传递数据
 * @param {rightCallback} 是关闭弹窗接收的函数
 * @param {catalogId} 车辆型谱数据
 */

import React, {Component} from 'react';
import {Text, View, SafeAreaView} from 'react-native';
import {Scrollpicker, BottomModal} from 'beeshell';
import {map} from "lodash"

export default class ColorOut extends Component {
	constructor(props) {
		super(props)
		this.state = {
			list: [{value: null, label: '请选择'}],
			value: [0]
		}
	}

	// 打开modal
	open() {
		return this.bottomModal.open()
	}

	// 设置默认回显方法
	setDefault(value) {
		this.setState({value: [value]})
	}

	// TODO 目前的车辆型谱是三位
	// Update 之后
	componentDidUpdate(prevProps, prevState) {
		// 如果Props catalogId存在 且不与老的相同则请求数据
		if (!this.props.catalogId) return
		if (this.props.catalogId.length !== 3) return

		const vehicleCode = this.props.catalogId[2].id
		if (!prevProps.catalogId || prevProps.catalogId.length !== 3 || prevProps.catalogId[2].id !== vehicleCode) {
			const vehicleCode = this.props.catalogId[2].id
			axios.request({
				url: '/admin/vehicleConfigVer/listByColorOut',
				params: {vehicleCode},
				method: 'get'
			}).then(({data}) => {
				let list
				if (!data.length) {
					list = [{value: null, label: '请选择'}]
				} else {
					list = map(data, item => {
						return {
							value: item.featureCode, label: item.featureName
						}
					})
				}
				this.setState({
					list: [...list]
				})
			})
		}
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
						 title='请选择外观颜色'
						 rightCallback={() => {
							 const data = this.state.list[this.state.value[0]]
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
