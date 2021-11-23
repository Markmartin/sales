/**
 * @description 用来处理点击拨号的组件
 * @param {phone} props需要传入的电话号码
 */

import React, {Component} from 'react';
import {Alert, Linking, TouchableOpacity, Text} from 'react-native';
import Icon from 'react-native-vector-icons/dist/Feather';

export default class PhoneCall extends Component {
	constructor(props) {
		super(props)
	}

	// 拨号
	call(phone) {
		let tel = `tel:${phone}`
		Alert.alert('提示', '是否拨打该号码？',
			[{
				text: '取消', onPress: () => {
					console.log('取消')
				}
			},
				{
					text: '确定',
					onPress: () => {
						Linking.canOpenURL(tel)
							.then((supported) => {
								if (!supported) {
									console.log('Can not handle tel:' + tel)
								} else {
									return Linking.openURL(tel)
								}
							})
							.catch(error => console.log('tel error', error))
					}
				}])
	}

	render() {
		const {phone, style} = this.props
		let color = '#999'
		if (style && style.color) {
			color = style.color
		}
		console.log('this.props.style', this.props.style)
		return (
			<TouchableOpacity onPress={() => this.call(phone)}>
				<Text style={this.props.style}>
					{phone} <Icon name='smartphone' size={15} color={color} light/>
				</Text>
			</TouchableOpacity>
		)
	}
}
