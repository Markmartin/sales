/**
 * @description 用来做必填输入的label组件
 * @param {labelName} label名称
 * @param {labelWidth} label 宽度
 */

import React, {Component} from 'react';
import {colors, size} from "../../../../style/variables";
import {Text, View} from "react-native";
import variables from "../../../../style/beeshell";

export default class RequiredLabel extends Component {
	static defaultProps = {
		labelName: '姓名',
		labelWidth: 100
	}

	render() {
		return (
			<View
				style={{
					flexDirection: 'row',
					alignItems: 'center',
					width: this.props.labelWidth,
					marginRight: 4
				}}>
				<Text style={{color: variables.mtdGrayBase}}>{this.props.labelName}</Text>
				<Text style={{color: colors.error, marginLeft: 3}}>*</Text>
			</View>
		);
	}
}
