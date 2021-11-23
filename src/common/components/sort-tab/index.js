/**
 * @description 表头排序的组件
 * @param {tabs} 表头的数据
 * @param {styles} 外部添加的样式
 * @param {callBack} 点击表头后的调用函数，参数为表头值，selectedIndex，排序标识
 * 参考使用 今日新建客户
 */

import React, {Component} from 'react';
import {StyleSheet, View, Text} from 'react-native';
import {ButtonGroup} from 'react-native-elements';
import {colors, size} from "../../../style/variables";
import Icon from 'react-native-vector-icons/dist/Feather'
import {map} from 'lodash'

export default class SortTab extends Component {
	constructor() {
		super()
		this.state = {
			init: false,
			buttons: [],
			buttonStates: []
		}
	}

	// 静态方法更新buttons
	static getDerivedStateFromProps(nextProps, prevState) {
		if (!prevState.init) {
			// 遍历数据，添加element
			const buttons = map(nextProps.tabs, item => {
				return {element: () => <Text style={{color: colors.grey3}}>{item} </Text>}
			})
			const buttonStates = new Array(nextProps.tabs.length).fill(null)
			return {
				init: true,
				buttons,
				buttonStates
			}
		}
		return null
	}

	updateIndex(selectedIndex) {
		// 更改
		const text = this.props.tabs[selectedIndex]
		let state = this.state.buttonStates[selectedIndex]
		const element = state !== 'chevron-up' ? <Text style={{color: colors.grey3}}>
			{text} <Icon name="chevron-up" color={colors.primary}/>
		</Text> : <Text style={{color: colors.grey3}}>
			{text} <Icon name="chevron-down" color={colors.primary}/>
		</Text>

		state = state !== 'chevron-up' ? 'chevron-up' : 'chevron-down'
		// 更改状态与展示数据
		this.state.buttons[selectedIndex] = {element: () => element}
		this.state.buttonStates[selectedIndex] = state

		this.setState({
			buttons: [...this.state.buttons],
			buttonStates: [...this.state.buttonStates]
		})

		// 调用callBack函数
		this.props.callBack({text, selectedIndex, state})
	}

	render() {
		return (
			<View style={{...styles.container,...this.props.styles}}>
				<ButtonGroup
					containerStyle={styles.tabContainer}
					textStyle={styles.textStyle}
					selectedButtonStyle={styles.selectStyle}
					innerBorderStyle={{color: colors.grey5}}
					{...this.props}
					buttons={this.state.buttons}
					onPress={selectedIndex => this.updateIndex(selectedIndex)}
				/>
			</View>
		)
	}
}
const styles = StyleSheet.create({
	buttonContainer: {
		borderColor: colors.white
	},
	container: {
		borderBottomColor: colors.grey5,
		borderTopColor: colors.grey5,
		borderBottomWidth: 1,
		borderTopWidth: 1,
		backgroundColor: colors.white,
		height: 40,
	},
	tabContainer: {
		borderColor: colors.white,
		height: 32,
		marginTop: 2
	},
	selectStyle: {
		borderColor: colors.primary,
		backgroundColor: colors.primary
	},
	textStyle: {
		color: colors.grey2,
		fontSize: size.fontSizeBase
	}
});
