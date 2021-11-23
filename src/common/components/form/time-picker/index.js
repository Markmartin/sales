/**
 * @description 用来选择时间，到天对外传递数据
 * @param {rightCallback} 是关闭弹窗接收的函数
 */

import React, {Component} from 'react';
import {Text, View, SafeAreaView} from 'react-native';
import {Timepicker, BottomModal, Switch} from 'beeshell';
import {find, indexOf} from 'lodash'

const hours = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24']

export default class TimePicker extends Component {
	static defaultProps = {
		showTime: 'HH:mm:ss',
		startTime: '00:00:00',
		endTime: '23:59:59',
		disableHours: []
	}

	constructor(props) {
		super(props)
		// 分数取值取整
		this.state = {
			time: this.init(props)
		}
	}

	// 处理首次默认选中情况
	init(props) {
		const {disableHours, showTime, startTime, endTime} = props
		const show = showTime.split(':')
		const showLength = show.length
		const start = startTime.split(':')
		const end = endTime.split(':')
		switch (showLength) {
			case 3:
				return startTime
			case 2:
				return `${start[0]}:${start[1]}`
			case 1:
				if (disableHours.length) {
					// 查找符合标准的
					const currentHour = find(hours, item => item >= start[0] && item <= end[0] && indexOf(disableHours, item) === -1)
					return currentHour
				} else {
					return start[0]
				}
		}
	}

	// 打开modal
	open() {
		return this.bottomModal.open()
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
						 title='请选择时间'
						 rightCallback={() => {
							 this.props.rightCallback(this.state.time)
						 }}
						 cancelable={true}>
				<View style={{paddingVertical: 15}}>
					<Timepicker
						style={{paddingHorizontal: 50}}
						proportion={[2, 1, 1]}
						value={this.state.time}
						showTime={this.props.showTime}
						startTime={this.props.startTime}
						endTime={this.props.endTime}
						disableHours={this.props.disableHours}
						onChange={(value) => {
							this.setState({
								time: value
							})
						}}
					/>
				</View>
				{this.renderSafeArea()}
			</BottomModal>
		);
	}
}
