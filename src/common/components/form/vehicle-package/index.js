/**
 * @description 用来实现车辆内饰颜色选择的组件，主要接收数据，对外传递数据
 * @param {rightCallback} 是关闭弹窗接收的函数,回传选择的对象数组
 * @param {catalogId} 车辆型谱数据
 */

import React, {Component} from 'react';
import {Text, View, SafeAreaView} from 'react-native';
import {BottomModal, Checkbox} from 'beeshell';
import {map,zipObject} from "lodash"

const hashWith = (array, key) => zipObject(map(array, key), array)
export default class VehiclePackage extends Component {
	constructor(props) {
		super(props)
		this.listHash = {}
		this.state = {
			list: [],
			value: []
		}
	}

	// 打开modal
	open() {
		return this.bottomModal.open()
	}

	// 生命周期挂载阶段
	componentDidMount() {
		axios.get('/admin/vehiclePackage/list')
			.then(({data}) => {
				const list = map(data, item => {
					return {
						value: item.featureCode,
						label: item.featureName
					}
				})
				this.listHash = hashWith(list,'value')
				this.setState({
					list: [...list],
					value:[list[0].value]
				})
			})
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
						 title='请选择选装包'
						 rightCallback={() => {
						 	const data = map(this.state.value,item=>this.listHash[item])
							 this.props.rightCallback(data)
						 }}
						 cancelable={true}>
				<View style={{paddingVertical: 15}}>
					<Checkbox
						style={{flexDirection: 'row', paddingHorizontal: 15, flexWrap: 'wrap'}}
						value={this.state.value}
						onChange={(value) => {this.setState({value: value})}}
						iconPosition='left'>
						{map(this.state.list,item=>{
							return <Checkbox.Item key={item.value} style={{marginRight: 10}} label={item.label} value={item.value}/>
						})}
					</Checkbox>
				</View>
				{this.renderSafeArea()}
			</BottomModal>
		);
	}
}
