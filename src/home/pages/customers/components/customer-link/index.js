/**
 * @description 用来实现添加联系人的组件，主要接收数据，对外传递数据
 * @param {callback} 回调接收的函数
 * @param {list} 是回显时的数据
 */

import React, {Component} from 'react';
import {Text, TouchableOpacity, View, Alert} from 'react-native';
import {CustomerInfo, CardTitle, Card, CardTitleIcon} from "../../style";
import variables from "../../../../../style/beeshell";
import {remove, isArray, forEach} from 'lodash'

// 预置数据
import Icon from "react-native-vector-icons/dist/Feather";
import {Form, Input} from "beeshell";

export default class CustomerLink extends Component {
	constructor(props) {
		super(props)
		this.reload = null
		this.state = {
			list: []
		}
	}

	// 获取焦点时刻
	getSnapshotBeforeUpdate(prevProps, prevState) {
		const {list} = this.props
		if (!this.props.list || !isArray(this.props.list) || this.reload) return null
		this.setState({list})
		this.reload = true
		return null
	}

	componentDidUpdate(prevProps, prevState, snapshot) {
	}

	// 点击增加更多联系人
	add() {
		if (this.props.editable === false) return
		if (this.state.list.length > 1) return
		this.setState({
			list: [...this.state.list, {name: '', phone: ''}]
		})
	}

	// 删除联系人
	reduce(i) {
		let {list} = this.state
		if (list[i].customerLinkId) {
			axios.post('/admin/customerlink/del', {customerLinkId: list[i].customerLinkId})
				.then(({data}) => {
					remove(list, (item, index) => i === index)
					this.setState({list: [...list]})
					this.props.callback(list)
				})
				.catch(({msg}) => {
					Alert.alert('提示', msg)
				})
		} else {
			remove(list, (item, index) => i === index)
			this.setState({list: [...list]})
			this.props.callback(list)
		}
	}

	change(i, data) {
		let {list} = this.state
		list[i][data.key] = data.value
		this.setState({list: [...list]})
		this.props.callback(list)
	}

	// 更多资料渲染
	renderMore() {
		return this.state.list.map((customer, i) => {
			return (
				<View style={{paddingHorizontal: 13}} key={i}>
					<CustomerInfo style={{alignItems: 'center'}}>
						<View style={{flex: 1}}>
							<Form.Item style={{paddingVertical: 13}} label="姓名" labelWidth={100}
									   hasLine>
								<Input testID='name' value={customer.name} textAlign='right'
									   onChange={value => this.change(i, {key: 'name', value})}/>
							</Form.Item>
							<Form.Item style={{paddingVertical: 13}} label="电话" labelWidth={100}>
								<Input testID='phone' value={customer.phone} textAlign='right'
									   onChange={value => this.change(i, {key: 'phone', value})}/>
							</Form.Item>
						</View>
						{
							this.props.editable === false ? null : <View style={{width: 20, marginLeft: 20}}>
								<TouchableOpacity onPress={() => this.reduce(i)}>
									<Icon
										name='x'
										size={20}
										color={variables.mtdGrayLight}/>
								</TouchableOpacity>
							</View>
						}
					</CustomerInfo>
				</View>
			)
		})
	}

	render() {
		return (
			<Card>
				<TouchableOpacity onPress={() => this.add()}>
					<CardTitle>
						<Text>
							联系人信息
						</Text>
						{this.state.list.length < 2 ? <CardTitleIcon>
							<Icon
								name='plus'
								size={20}
								color={variables.mtdGrayLight}/>
						</CardTitleIcon> : null}
					</CardTitle>
				</TouchableOpacity>
				{this.renderMore()}
			</Card>
		)
	}
}
