/**
 * @description 用来显示错误信息
 * @param {validateResults} 验证结果集
 * @param {name} 需要显示错误的信息name
 */

import React, {Component} from 'react';
import {Text} from "react-native";
import variables from "../../../../style/beeshell";

export default class ErrorMsg extends Component {
	static defaultProps = {
		name: 'name'
	}
	render() {
		const validateResults = this.props.validateResults
		const name = this.props.name
		if(!validateResults || !validateResults[name]) return null
		if(validateResults[name].valid) return null
		return (
					<Text testID='sexInfo' style={{...this.props.style, color: variables.mtdBrandDanger}}>
						{validateResults[name].msg} </Text>
		);
	}
}
