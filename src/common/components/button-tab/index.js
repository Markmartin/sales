/**
 * @description button tab组件
 * @param 继承react native elements的所有方法与属性，
 * https://react-native-training.github.io/react-native-elements/docs/button_group.html
 * 参考使用 今日跟进提醒
 */


import React, {Component} from 'react';
import {StyleSheet, Text} from 'react-native';
import {ButtonGroup} from 'react-native-elements';
import {colors,size} from "../../../style/variables";

export default class ButtonTab extends Component {

	render() {
		return (
				<ButtonGroup
					containerStyle={styles.tabContainer}
					textStyle={styles.textStyle}
					selectedButtonStyle={styles.selectStyle}
					innerBorderStyle={{color:colors.primary}}
					{...this.props}/>
		)
	}
}
const styles = StyleSheet.create({
	tabContainer: {
		borderColor: colors.primary,
		height: 32
	},
	selectStyle: {
		borderColor: colors.primary,
		backgroundColor: colors.primary
	},
	textStyle: {
		color: colors.primary,
		fontSize:size.fontSizeBase
	}
});
